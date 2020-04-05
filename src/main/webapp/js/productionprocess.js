/*function initDate(datePickerId, dateType) {
	$(datePickerId).datepicker(
			{
				showOtherMonths : true,
				selectOtherMonths : false,
				dateFormat: 'yy/mm/dd',
				// startDate:'-3d'
				// isRTL:true,
				changeMonth : true,
				changeYear : true,

				showButtonPanel : true,
				beforeShow : function() {
					// change button colors
					var datepicker = $(this).datepicker("widget");
					setTimeout(function() {
						var buttons = datepicker.find(
								'.ui-datepicker-buttonpane').find('button');
						buttons.eq(0).addClass('btn btn-xs');
						buttons.eq(1).addClass('btn btn-xs btn-success');
						buttons.wrapInner('<span class="bigger-110" />');
					}, 0);
				}

			});
	if (dateType == "startDate") {
		var currDate = new Date();
		var before7DateTime = currDate.getTime() - 7 * 24 * 3600 * 1000;
		var before7Date = new Date(before7DateTime);
		var year = before7Date.getFullYear();
		var month = before7Date.getMonth() + 1;
		var day = before7Date.getDate();
		$(datePickerId).val(year + "/" + month + "/" + day);

	} else if (dateType == "endDate") {
		var currDate = new Date();
		var year = currDate.getFullYear();
		var month = currDate.getMonth() + 1;
		var day = currDate.getDate();
		$(datePickerId).val(year + "/" + month + "/" + day);
	}
}*/

function queryWithUrlByTimeRange(url, code) {

	var gridTableId = "#grid-table";
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var startDateCondition = startDate.split("/")[0] + "-"
			+ startDate.split("/")[1] + "-" + startDate.split("/")[2];
	var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1]
		  + "-" + endDate.split("/")[2];

    var gridUrl = url + "?";
    if (code == undefined) {
      gridUrl += "code=" + code + "&";
    }
	gridUrl += "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;

	jQuery(gridTableId).jqGrid('setGridParam', {
		datatype : "json",
		url : gridUrl
	}).trigger('reloadGrid');
}

function getDateDuration(gridUrl) {
	var gridTableId = "#grid-table";
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var startDateCondition = startDate.split("/")[0] + "-"
			+ startDate.split("/")[1] + "-" + startDate.split("/")[2];
	var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1]
			+ "-" + endDate.split("/")[2];
	return "dateConditionStart=" + startDateCondition + "&dateConditionEnd="
			+ endDateCondition;
}

function findUrlWithPars(url, par) {
	var url = url;
	var paras = "";
	var results = "";

	if (par != undefined) {
		paras = par;
	}
	operationFunc(paras, url, function(result) {
		var val = $.parseJSON(result);
		$.each(val, function(id, item) {
			if (results != "") {
				results = results + ";" + item.code + ":"
						+ item.name;
			} else {
				results = " : ;" + item.code + ":" + item.name;
			}
		});
	});
	return results;
}

function upload(obj, picPath) {
	
	if(obj instanceof HTMLTableRowElement)
		obj=obj.attributes.id['value'];//传输的

	parent.zeroModal.show({
		title : '文件上传',
		iframe : true,
		url : '/toUpload?class=' + picPath + '&id=' + obj,
		width : '60%',
		height : '65%',
		ok : true,
		okFn : function() {
			$("#grid-table").trigger("reloadGrid");
		}
	});
}

function fileUpLoad(cellvalue, options, rowObject) 
{
	var del = '<button class="btn btn-minier btn-purple"  onclick="upload(\''+ options.rowId+ '\', \'' + uploadUrl + '\')"><i class="icon-cloud-upload bigger-120"></i>上传</button> ';
	var url = 'downloadEntry?file='+ cellvalue; 
	if (cellvalue != null&& cellvalue.length != 0)
		del += '<a href="'+url+'">下载</a>';
	return del;
}

function contactConfig(id, detailUrl) {
	zeroModal.show({
		title : '部件详情',
		iframe : true,
		url : detailUrl + '?code=' + id,
		width : '80%',
		height: '80%',
		ok: true,
		okFn : function() {
			$("#grid-table").trigger("reloadGrid");
		}
	});
}

function showDetail(cellvalue, options, rowObject)
{
	return '<a class="ctl" href="javascript:void(0)"  onclick="contactConfig(\'' + options.rowId + '\', \'' + detailUrl + '\')"><i class = "icon-edit"></i>配置与查看</a>';
}
