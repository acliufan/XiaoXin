
var taskNames = findLocaltaskName_StopState();

function getSupplyPlanForTablewithUrl() {

	var gridUrl = "querySupplyPlan";
	var gridTableId = "#grid-table";
	var girdPaperId = "#grid-pager";
	var gridCaption = "";
	var colNames = ['序号', '供应计划编号', '供应计划名称', '年度任务名称', '制单用户', '制单时间', '计划批准文号', '备注', '状态','操作', '基本操作'];

	var colModels = [
		{name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
		{
			name: 'supplyPlanCode',
			index: 'supplyPlanCode',
			width: 100,
			hidden: true,
			editable: true,
			editrules: {edithidden: false}
		},
		{
			name: 'supplyPlanName',
			index: 'supplyPlanName',
			width: 100,
			sorttype: "json",
			edittype: "text",
			editable: true,
			editrules:{required:true}
		},
		{
            name: 'ccglYearTask.taskCode', index: 'ccglYearTask.taskCode', fixed: false, sortable: true,editable: true,editrules: {required: true, edithidden: true},
            edittype: "select",
            editoptions: {value: taskNames},
			unformat: function (cellvalue, options, rowobject) {
				var values = new Array();
				var valuestemp = new Array();
				values = options.colModel.editoptions.value.split(";");
				for (var i = 0; i < values.length; i++) {
					var temp = values[i].split(":");
					if (cellvalue == temp[1]) {
						return temp[0];
					}
				}
			},
			formatter: function (cellvalue, options, rowobject) {
				var values = new Array();
				var valuestemp = new Array();
				values = options.colModel.editoptions.value.split(";");
				for (var i = 0; i < values.length; i++) {
					var temp = values[i].split(":");
					if (rowobject.ccglYearTask.taskCode == temp[0]) {
						return temp[1];
					}
				}

			}
        },
		{name: 'makePlanUser.makePlanUserCode', index: 'makePlanUser.makePlanUserCode', width: 100, editable: true, editrules:{required:true,integer:true}},
		{
			name: 'makePlanDate',
			index: 'makePlanDate',
			width: 100,
			editable: true,
			formatter: 'date',
			edittype: 'text',
			editrules:{required:true},
			unformat: pickDate,
			formatter: function (cellvalue, opts, rwd) {
				if (cellvalue)
					return $.fn.fmatter.call(this, 'date', new Date(cellvalue.time), opts, rwd);
				else
					return '';
			},
			formatoptions: {newformat: 'Y/m/d'},
			editoptions: {
				dataInit: function (element) {
					$(element).datepicker({dateFormat: 'yy/mm/dd', changeMonth: true, changeYear: true})
				}
			}
		},
		{name:'planApprovalNumber',index:'planApprovalNumber',width:100, editable:true,edittype:"text",editrules:{required:true}
		},

		{
			name: 'BZ',
			index: 'BZ',
			width: 100,
			edittype: "text",
			editable: true,

		},
		{name:'planState',index:'planState',width:100, editable:false,edittype:"text"
		},
        {
            name: 'operate',
            index: 'operate',
            width: 150,
            fixed: true,

            formatter:function(cellvalue,options,rowobj){
                    var btn1 = '<a style="color:#9EBDD8;"  onclick="test();" ><i class="icon-edit"></i>设置分配规则 </a>'
                    var btn2 =  '<a style="color:#9EBDD8;"   ><i class="icon-edit"></i>统计分析结果 </a> ';
                    return btn1+btn2;
            }
        },
		{
			name: 'basicoperation',
			index: '',
			width: 100,
			fixed: true,
			sortable: false,
			resize: false,
			viewable: false,
			formatter: function (cellvalue, options, rowobj) {
				var btn = "";
				btn = btn + '<div style = "margin-left:8px;">' +
					'<div title = "编辑所选记录" style = "float:left;cursor:pointer;"' +
					'class = "ui-pg-div ui-inline-edit"' +
					' id = "jEditButton_1" onclick = "jQuery.fn.fmatter.rowactions.call(this,\'formedit\');" onmouseover = "jQuery(this).addClass(\'ui-state-hover\');"' +
					' onmouseout = "jQuery(this).removeClass(\'ui-state-hover\');" data - original - title = " " > ' +
					'<span class = "ui-icon ui-icon-pencil">' +
					'</span>' +
					'编辑</div>' +
					'<div title = "删除所选记录" style = "float:left;margin-left:5px;" class = "ui-pg-div ui-inline-del" id = "jDeleteButton_1"' +
					' onclick = "jQuery.fn.fmatter.rowactions.call(this,\'del\');" ' +
					'onmouseover = "jQuery(this).addClass(\'ui-state-hover\');" ' +
					'onmouseout = "jQuery(this).removeClass(\'ui-state-hover\');" ' +
					'data - original - title = " ">' +
					'<span class = "ui-icon ui-icon-trash">' +
					'</span>' +
					'删除</div>' +
					'<div title = "确定" style = "float:left;display:none" class= "ui-pg-div ui-inline-save" id = "jSaveButton_1"' +
					' onclick = "jQuery.fn.fmatter.rowactions.call(this,\'save\');"' +
					'onmouseover = "jQuery(this).addClass(\'ui-state-hover\');"' +
					'onmouseout = "jQuery(this).removeClass(\'ui-state-hover\');"' +
					'data - original - title = " ">' +
					'<span class = "ui-icon ui-icon-disk">' +
					'</span>' +
					'</div>' +
					'<div title = "取消" style = "float:left;display:none;margin-left:5px;" class = "ui-pg-div ui-inline-cancel"' +
					' id = "jCancelButton_1"' +
					' onclick = "jQuery.fn.fmatter.rowactions.call(this,\'cancel\');"' +
					'onmouseover = "jQuery(this).addClass(\'ui-state-hover\');"' +
					'onmouseout = "jQuery(this).removeClass(\'ui-state-hover\');"' +
					'data - original - title = " ">' +
					' <span class= "ui-icon ui-icon-cancel">' +
					'</span>' +
					' </div>' +
					' </div>';
				return btn;
			},
			formatoptions: {
				keys: true,
				delOptions: {
					closeAfterDel: true,
					recreateForm: true,
					beforeShowForm: beforeDeleteCallback,
					afterSubmit: afterSubmitFunc
				},
				editformbutton: true,
				editOptions: {
					closeAfterEdit: true,//useful here!!
					recreateForm: true,
					beforeShowForm: beforeEditCallback,
					afterSubmit: afterSubmitFunc
				}
			}
		}
	]
	var operateStatus = [true, true, true, false, true, true];
	var gridEditUrl = "/editSupplyPlan";

	var jsonReaderObj = {repeatitems: false, id: "supplyPlanCode"};
	createJQGridTableByGridUrl(gridUrl, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl, afterSubmitFunc,false);
}
