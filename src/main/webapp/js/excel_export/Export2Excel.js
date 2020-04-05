function generateDatagrid(table,ws_name,filename)//将datagrid生成符合格式的对象,表名、标题名、水厂名、
{
	var ranges = [];
	var stnum=0;//表格体起始位置,也是就表头所占的行数
  var tableprint=$('#'+table)
  var x = tableprint.dateTable
	var tpobj=tableprint.datagrid('getRows');
	var til=$('#'+table).datagrid('getColumnFields');
	var frozenColumns = tableprint.datagrid("options").frozenColumns;  // 得到frozenColumns对象
    var columns = tableprint.datagrid("options").columns;    // 得到columns对象
	var wbdata=new Array();var rowcnt=new Array();var rowcnt1=new Array();
//	console.log(columns,frozenColumns);
	//填写表头部分
	var col=new Array();
	if (typeof columns != 'undefined' && columns != '')//将冻结的列和没有冻结的列合并，去除不显示的列。
	{
		for(vs=0;vs<columns.length;vs++)
		{
			col[vs]=new Array();
			if (typeof frozenColumns != 'undefined' && typeof frozenColumns[vs] != 'undefined')//判断是否是冻结的列
			{
				for(ms=0;ms<frozenColumns[vs].length;ms++)
				{
					if (!frozenColumns[vs][ms].hidden) {
					col[vs].push(frozenColumns[vs][ms]);}
				}
			}
			for(ms=0;ms<columns[vs].length;ms++)
			{
				if (!columns[vs][ms].hidden) {
				var coln=columns[vs][ms];
				if(coln.title.indexOf('<sub>')>0){coln.title=coln.title.replace('<sub>','');coln.title=coln.title.replace('</sub>','');}//去除下标在网页上的内容
				col[vs].push(coln);}
			}
		}
	}
	//填写表头部分
	for(vs=0;vs<col.length;vs++)//先将所有的行初始化
	{	wbdata[wbdata.length]=new Array();
		stnum=stnum+1;
	}
	for(vs=0;vs<col.length;vs++)
	{
		rowcnt[vs]=new Array();
		for(ms=0;ms<col[vs].length;ms++)
		{
			rowcnt[vs][ms]=0;
		}
	}
	for(vs=0;vs<col.length;vs++)
	{
		var cnt=0;var st=0;var et=0;var sc=0;var ec=0;
		for(ms=0;ms<col[vs].length;ms++)
		{
			var ro=0;var co=0;
			if(col[vs][ms].rowspan==undefined||col[vs][ms].rowspan==1)
			{ro=1;}	else{ro=parseInt(col[vs][ms].rowspan);}
			if(col[vs][ms].colspan==undefined||col[vs][ms].colspan==1)
			{co=1}else{co=parseInt(col[vs][ms].colspan)}			
			for(var rn=1;rn<ro;rn++){rowcnt[vs+rn][ms]=co}//console.log(rowcnt);
			var tpvl=0;
			for(rn=0;rn<ms+1;rn++){tpvl=tpvl+rowcnt[vs][rn];}//取出当前格子前面有多少行被占用
			wbdata[wbdata.length-col.length+vs][cnt+tpvl]=col[vs][ms].title;
			sc=cnt+tpvl;ec=cnt+co-1+tpvl;
			cnt=cnt+co;
			if(sc!=ec){ranges.push({s:{r:wbdata.length-col.length+vs, c:sc},e:{r:wbdata.length-col.length+vs+ro-1, c:ec}});}//填写列融合信息
			if(wbdata.length-col.length+vs!=wbdata.length-col.length+vs+ro-1){ranges.push({s:{r:wbdata.length-col.length+vs, c:sc},e:{r:wbdata.length-col.length+vs+ro-1, c:ec}});}//填写行融合信息
			for(ronum=0;ronum<ro;ronum++)
			{
				if(ronum!=0){var temco=co}else{var temco=co-1}
				for(tnum=0;tnum<temco;tnum++){wbdata[wbdata.length-col.length+ronum+vs][cnt-temco+tnum+rowcnt[wbdata.length-col.length+ronum+vs]]=null}//填相应的空白
			}
		}
	}
	
	for(vs=0;vs<tpobj.length;vs++)//取出所有的行列信息
	{
		wbdata[wbdata.length]=new Array();
		for(hs=0;hs<til.length;hs++)
		{
			if(getunhidden(til[hs],col)==true){
			var tpdatas=tpobj[vs][til[hs]];
			//if(!isNaN(parseFloat(tpdatas))){tpdatas=parseFloat(tpdatas)}
			if(tpdatas==undefined){wbdata[wbdata.length-1][wbdata[wbdata.length-1].length]=null;}
			else{wbdata[wbdata.length-1][wbdata[wbdata.length-1].length]=tpdatas}
			}
		}
	}
	
	function getunhidden(nam,cols)
	{
		for(mi=0;mi<cols.length;mi++)
		{
			for(si=0;si<cols[mi].length;si++)
			{
				if(cols[mi][si].field==nam&&!cols[mi][si].hidden)
				{return true;}
			}
		}
		return false;
	}
	if(filename==''){filename=ws_name}
//	console.log(JSON.stringify(ranges),wbdata);
	export_table_to_excel(wbdata,ranges,ws_name,filename);
	
}

function export_table_to_excel(data,ranges,ws_name,filename) {
//console.log(data);// console.log(oo); 

var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
 
/* add ranges to worksheet */
ws['!merges'] = ranges;

/* add worksheet to workbook */
wb.SheetNames.push(ws_name);
wb.Sheets[ws_name] = ws;

var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});

saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), filename+".xlsx")
}
function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
 
function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}
 
function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}
 
function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}
