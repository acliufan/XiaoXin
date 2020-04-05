
/*
 * 获取产品组成
 * @author baitao.wang
 * @time 2016-11-24
 */
function getProductionComposition(type,productCode,productionPlanCode)
{

		var condition = "type="+type + "&productCode="+productCode +"&productionPlanCode="+productionPlanCode;
		operationFunc(condition,"queryProductionComposition",function(result){
			generateProductionCompositionDetail(result)
		});
		
}

/*
 * 获取项目批次组成
 * @author baitao.wang
 * @time 2016-11-24
 */
function getLotComposition(type,productLotCode)
{

		var condition = "type="+type + "&productLotCode="+productLotCode ;
		operationFunc(condition,"queryProductionLotDefine",function(result){
			generateLotCompositionDetail(result)
		});
		
}



/*
 * 产品组成详细情况表
 * @author baitao.wang
 * @time 2016-11-24
 */
function generateProductionCompositionDetail(result)
{
	var val = $.parseJSON(result);
		var treeContent = ""; 
		treeContent += '<thead><tr>'
		treeContent += '<th>部件名称</th><th>部件编号</th><th>需要数量</th><th>已有数量</th><th>可用数量</th><th>选择数量</th><th>查看详情</th><th>基本操作</th>';
		treeContent += '</tr></thead>';
		treeContent += '<tbody>';
		for(var i = 0;i<val.rows.length;i++)
		{
			var date = new Date();
			treeContent += '<tr>'
			treeContent += '<td>';
			treeContent += val.rows[i].partInfo.partName;
			treeContent += '</td>';
			treeContent += '<td>';
			if(val.rows[i].partInfo.partCode.length>32){
				treeContent += '内部编号';
			}else
			{
				treeContent += val.rows[i].partInfo.partCode;
			}
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].needPartCount;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].havePartCount;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].storagePartCount;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].chosePartCount;
			treeContent += '</td>';
		
			treeContent += '<td>';
			treeContent += '<a  onclick ="choseDetail('+ "'" +val.rows[i].partInfo.partCode+ "'"+ ')" ';
			treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
			treeContent += '</td>';

			treeContent += '<td>';
			treeContent += '<a onclick ="chose('+ "'" +val.rows[i].partInfo.partCode+ "'"+ ')" ';
			treeContent += 'class="tooltip-info" data-rel="tooltip" title="编辑"><span class="blue"><i class="icon-edit"></i> 编辑</span></a>';
			treeContent += '</td>';
			treeContent += '</tr>';			
		}
		treeContent += '</tbody>';
		document.getElementById("composition_table").innerHTML = treeContent;
	
}

/*
 * 产品项目批次组成详细情况表
 * @author baitao.wang
 * @time 2016-11-24
 */
function generateLotCompositionDetail(result)
{
	
	var val = $.parseJSON(result);
		var treeContent = ""; 
		treeContent += '<thead><tr>'
		treeContent += '<th>批次编号</th><th>产品名称</th><th>产品编号</th><th>需要数量</th><th>选择数量</th><th>已有数量</th><th>可用数量</th><th>查看详情</th><th>基本操作</th>';
		treeContent += '</tr></thead>';
		treeContent += '<tbody>';
		for(var i = 0;i<val.rows.length;i++)
		{
			var date = new Date();
			treeContent += '<tr>'
			treeContent += '<td>';
			treeContent += val.rows[i].productionLot.productionLotCode;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].productionInfo.productionName;
			treeContent += '</td>';
			treeContent += '<td>';
			if(val.rows[i].productionInfo.productionCode.length>32) {
				treeContent +='内部编号';
			}else{
				treeContent += val.rows[i].productionInfo.productionCode;
			}
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].needProductionCount;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].choseProductionCount;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].haveProductionCount;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].storageProductionCount;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += '<a  onclick ="choseDetail('+ "'" +val.rows[i].productionInfo.productionCode+ "'"+ ','+ "'" +val.rows[i].productionLot.productionLotCode+ "'"+')" ';
			treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
			treeContent += '</td>';

			treeContent += '<td>';
			treeContent += '<a onclick ="chose('+ "'" +val.rows[i].productionInfo.productionCode+ "'"+ ','+ "'" +val.rows[i].productionLot.productionLotCode+ "'"+')" ';
			treeContent += 'class="tooltip-info" data-rel="tooltip" title="编辑"><span class="blue"><i class="icon-edit"></i> 编辑</span></a>';
			treeContent += '</td>';
			treeContent += '</tr>';			
		}
		treeContent += '</tbody>';
		document.getElementById("productlot_table").innerHTML = treeContent;
	
}
