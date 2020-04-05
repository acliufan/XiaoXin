var partInStockApplyTable = null;
function getPartInStockApply() {
	var parts = findParts();
	var persons = findPersons();
	var depts = findDepts();
	var suppliers= findSuppliers();

	var gridUrl = "queryPartInStockApply?isFinishInStock=false";

	var gridTableId = "#apply_table";
	var girdPaperId = "#table-pager";

	var gridCaption = "部件入库申请";
	var colNames = [ '序号','申请编号','部件编号','部件名称','入库批次', '单价', '入库数量','入库类型','生产类型','供应商名称' ,'部门名称' ,'是否单件管理' ,'是否完成入库' ,'申请人' ,'申请日期','入库','操作'];

	var productType = []
	var colModels = [
			{name:'num',index:'num', width:30, sorttype:"int", editable: false},
			{name:'partInStockApplyCode',index:'partInStockApplyCode',width:100,hidden:true,editable:true, editrules:{edithidden:false}},
			{name:'pCode',index:'partInfo.partCode',width:100,edittype:"text", editable:true,
				formatter:function(cellvalue,options,rowobject)
					{
						if(32 <= rowobject.partInfo.partCode.length)
							return '内部编号';
						else
							return rowobject.partInfo.partCode;
				},editoptions:{value:parts,
					dataEvents:[{
						type:'focus',fn:function(e){
							$("#pCode").attr('readonly',true);
						}
					}]}
			},
			{name:'partInfo.partCode',index:'partInfo.partCode',width:100,edittype:"select", editable:true,editrules:{required:true},
				unformat:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(cellvalue == temp[1])
							{
								return temp[0];
							}
						}
					},
				formatter:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(rowobject.partInfo.partCode == temp[0])
							{
								return temp[1];
							}
						}
				},editoptions:{value:parts
					,dataEvents:[{
						type:'change',
						fn:function(e){
							var partCode=this.value;
							if(32 <= partCode.length)
								partCode = '内部编号';
							changeShowData("pCode",partCode,null);
						}}]
				}
			},
			{name:'inStockLot',index:'inStockLot',width:100, editable:true
				,editoptions:{
					dataEvents:[{
						type:'focus',fn:function(e){
							$("#inStockLot").attr('readonly',true);
						}
					}]}
			},
			{name:'partPrice',index:'partPrice',width:100, editable:true,editrules:{required:true,number:true}},
			{name:'inStockCount',index:'inStockCount',width:100, editable:true,editrules:{required:true,integer:true}},
			{name:'inStockType',index:'inStockType',width:100, editable:true,edittype:"select",editrules:{required:true},
				editoptions:{value:"正常入库:正常入库;问题入库:问题入库;归还入库:归还入库"}
			},
			{name:'productType',index:'productType',width:100, editable:true,edittype:"select",editrules:{required:true},
//				formatter : function(cellvalue,opts, rwd) {
//					if('0' == cellvalue)
//						return '供应商';
//					if('1' == cellvalue)
//						return '生产商';
//					if('2' == cellvalue)
//						return '外协商';
//				},
				editoptions:{value:"自产:自产;外购:外购;外协:外协"}
			},

			{name:'supplierInfo.supplierCode',index:'supplierInfo.supplierCode',width:100,edittype:"select", editable:true,editrules:{required:true},
				unformat:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(cellvalue == temp[1])
							{
								return temp[0];
							}
						}
					},
				formatter:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(rowobject.supplierInfo.supplierCode == temp[0])
							{
								return temp[1];
							}
						}

					}
					,editoptions:{value:suppliers}},

			{name:'deptInfo.deptCode',index:'deptInfo.deptCode',width:100,edittype:"select", editable:true,editrules:{required:true},
				unformat:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(cellvalue == temp[1])
							{
								return temp[0];
							}
						}
					},
				formatter:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(rowobject.deptInfo.deptCode == temp[0])
							{
								return temp[1];
							}
						}

					}
					,editoptions:{value:depts}},

			{name:'isOneManagement',index:'isOneManagement',width:100, editable:true,edittype:"select",
				formatter : function(cellvalue,opts, rwd) {
					if('true' == cellvalue)
						return '是';
					return '否';
				},
				editoptions:{value:"false:否;true:是"}},
			{name:'isFinishInStock',index:'isFinishInStock',width:100, editable:false,edittype:"select",
					formatter : function(cellvalue,opts, rwd) {
						if('true' == cellvalue)
							return '是';
						return '否';
					},
					editoptions:{value:"false:否;true:是"}},
			{name:'applyUserInfo.userCode',index:'applyUserInfo.userCode',width:100,edittype:"select", editable:false,
			unformat:function(cellvalue,options,rowobject)
				{
					var values = new Array();
					var valuestemp = new Array();
					values = options.colModel.editoptions.value.split(";");
					for(var i=0;i<values.length;i++)
					{
						var temp = values[i].split(":");
						if(cellvalue == temp[1])
						{
							return temp[0];
						}
					}
				},
			formatter:function(cellvalue,options,rowobject)
				{
					var values = new Array();
					var valuestemp = new Array();
					values = options.colModel.editoptions.value.split(";");
					for(var i=0;i<values.length;i++)
					{
						var temp = values[i].split(":");
						if(rowobject.applyUserInfo.userCode == temp[0])
						{
							return temp[1];
						}
					}

				}
				,editoptions:{value:persons}},
			{name:'applyDate',index:'applyDate',width:100,editable:false,formatter:'date',edittype:'text',unformat:pickDate,
				formatter : function(cellvalue,opts, rwd) {
					if (cellvalue)
						return $.fn.fmatter.call(this,'date',new Date(cellvalue.time),opts,rwd);
					else
						return '';
				},
				formatoptions:{newformat:'Y/m/d'},
				editoptions:{dataInit:function(element){
								$(element).datepicker({dateFormat:'yy/mm/dd',changeMonth:true,changeYear:true})
							}}
			},

//			{name:'responsorInfo.responsorCode',index:'userCode',width:100,hidden:true,edittype:"select", editable:true,editrules:{edithidden:true},
//				unformat:function(cellvalue,options,rowobject)
//					{
//						var values = new Array();
//						var valuestemp = new Array();
//						values = options.colModel.editoptions.value.split(";");
//						for(var i=0;i<values.length;i++)
//						{
//							var temp = values[i].split(":");
//							if(cellvalue == temp[1])
//							{
//								return temp[0];
//							}
//						}
//					}
//			,editoptions:{value:persons}},
//			
//			{name:'stockBoxCode',index:'stockBoxCode',width:100, editable:true,hidden:true,editrules:{edithidden:true}},
//			
//			{name:'stockKeeperInfo.stockKeeperCode',index:'stockKeeperCode',width:100,hidden:true,edittype:"select", editable:true,editrules:{edithidden:true},
//				unformat:function(cellvalue,options,rowobject)
//					{
//						var values = new Array();
//						var valuestemp = new Array();
//						values = options.colModel.editoptions.value.split(";");
//						for(var i=0;i<values.length;i++)
//						{
//							var temp = values[i].split(":");
//							if(cellvalue == temp[1])
//							{
//								return temp[0];
//							}
//						}
//					}
//			,editoptions:{value:persons}},

			{
	            name: 'partInStock',
	            index: 'partInStock',
	            width: 100,
	            fixed: true,
	            viewable: false,
	            sortable: false,
	            resize: false,
	            formatter: partInStock
	        },

			{name:'operation',index : '',width : 100,fixed : true,sortable : false,resize : false,viewable:false,formatter : 'actions',formatoptions : {
				keys : true,
				delOptions : {
					closeAfterDel: true,
					recreateForm : true,
					beforeShowForm : beforeDeleteCallback,
					afterSubmit:afterSubmitFunc
				},
				editformbutton : true,
				editOptions : {
					closeAfterEdit: true,//useful here!!
					recreateForm : true,
					beforeShowForm : beforeEditCallback,
					afterSubmit:afterSubmitFunc
					}
				}
			}
		]
	var operateStatus = [false,false,false,false,false,false];
	var gridEditUrl = "/editPartInStockApply";

	var jsonReaderObj = {repeatitems:false,id:"partInStockApplyCode"};
	createJQGridTableAndCountByGridUrl(gridUrl,gridTableId,girdPaperId,gridCaption,colNames,colModels,operateStatus,jsonReaderObj,gridEditUrl,afterSubmitFunc)
}

function getProductionInStockApply(){

	var products = findProducts();
	var persons = findPersons();
	var depts = findDepts();
	var suppliers= findSuppliers();
    var productionPlans = findProductPlans();
	var gridUrl = "queryProductionInStockApply?isFinishInStock=false";

	var gridTableId = "#apply_table";
	var girdPaperId = "#table-pager";

	var gridCaption = "产品入库申请";
	var colNames = [ '序号','申请编号','计划名称','产品编号','产品名称','入库批次', '单价', '入库数量','入库类型','生产类型','供应商' ,'部门' ,'是否单件管理' ,'是否完成入库' ,'申请人' ,'申请日期','入库' ,'操作'];

	var productType = []
	var colModels = [
			{name:'num',index:'num', width:30, sorttype:"int", editable: false},
			{name:'productionInStockApplyCode',index:'productionInStockApplyCode',width:100,hidden:true,editable:true, editrules:{edithidden:false}},
		{
			name: 'productionPlanCode',
			index: 'productionPlanCode',
			width: 100,
			hidden: false,
			edittype: "select",
			editable: true,
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
				for(var i=0;i<values.length;i++)
				{
					var temp = values[i].split(":");
					if(rowobject.productionPlanCode == temp[0])
					{
						return temp[1];
					}
				}
				if (null != rowobject.productioinPlan) {
					return rowobject.productioinPlan.productionPlanName;
				} else {
					return "";
				}
			},
			editoptions: {value: productionPlans}
		},
		{name:'pCode',index:'productionInfo.productionCode',width:100,edittype:"text", editable:true,
				formatter:function(cellvalue,options,rowobject)
					{
						if(32 <= rowobject.productionInfo.productionCode.length)
							return '内部编号';
						else
							return rowobject.productionInfo.productionCode;
				},editoptions:{value:products,
					dataEvents:[{
						type:'focus',fn:function(e){
							$("#pCode").attr('readonly',true);
						}
					}]}
			},
			{name:'productionInfo.productionCode',index:'productionInfo.productionCode',width:100,edittype:"select", editable:true,editrules:{required:true},
				unformat:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(cellvalue == temp[1])
							{
								return temp[0];
							}
						}
					},
				formatter:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(rowobject.productionInfo.productionCode == temp[0])
							{
								return temp[1];
							}
						}
				},editoptions:{value:products
					,dataEvents:[{
						type:'change',
						fn:function(e){
							var productionCode=this.value;
							if(32 <= productionCode.length)
								productionCode = '内部编号';
							changeShowData("pCode",productionCode,null);
						}}]
				}
			},
			{name:'inStockLot',index:'inStockLot',width:100, editable:true
				,editoptions:{
					dataEvents:[{
						type:'focus',fn:function(e){
							$("#inStockLot").attr('readonly',true);
						}
					}]}
			},
			{name:'productionPrice',index:'productionPrice',width:100, editable:true,editrules:{required:true,number:true}},
			{name:'inStockCount',index:'inStockCount',width:100, editable:true,editrules:{required:true,integer:true}},
			{name:'inStockType',index:'inStockType',width:100, editable:true,edittype:"select",editrules:{required:true},
				editoptions:{value:"正常入库:正常入库;问题入库:问题入库;归还入库:归还入库"}
			},
			{name:'productType',index:'productType',width:100, editable:true,edittype:"select",editrules:{required:true},
//				formatter : function(cellvalue,opts, rwd) {
//					if('0' == cellvalue)
//						return '供应商';
//					if('1' == cellvalue)
//						return '生产商';
//					if('2' == cellvalue)
//						return '外协商';
//				},
				editoptions:{value:"自产:自产;外购:外购;外协:外协"}
			},

			{name:'supplierInfo.supplierCode',index:'supplierInfo.supplierCode',width:100,edittype:"select", editable:true,editrules:{required:true},
				unformat:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(cellvalue == temp[1])
							{
								return temp[0];
							}
						}
					},
				formatter:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(rowobject.supplierInfo.supplierCode == temp[0])
							{
								return temp[1];
							}
						}

					}
					,editoptions:{value:suppliers}},

			{name:'deptInfo.deptCode',index:'deptInfo.deptCode',width:100,edittype:"select", editable:true,editrules:{required:true},
				unformat:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(cellvalue == temp[1])
							{
								return temp[0];
							}
						}
					},
				formatter:function(cellvalue,options,rowobject)
					{
						var values = new Array();
						var valuestemp = new Array();
						values = options.colModel.editoptions.value.split(";");
						for(var i=0;i<values.length;i++)
						{
							var temp = values[i].split(":");
							if(rowobject.deptInfo.deptCode == temp[0])
							{
								return temp[1];
							}
						}

					}
					,editoptions:{value:depts}},

			{name:'isOneManagement',index:'isOneManagement',width:100, editable:true,edittype:"select",
				formatter : function(cellvalue,opts, rwd) {
					if('true' == cellvalue)
						return '是';
					return '否';
				},
				editoptions:{value:"false:否;true:是"}},

			{name:'isFinishInStock',index:'isFinishInStock',width:100, editable:false,edittype:"select",
				formatter : function(cellvalue,opts, rwd) {
					if('true' == cellvalue)
						return '是';
					return '否';
				},
				editoptions:{value:"false:否;true:是"}},

			{name:'applyUserInfo.userCode',index:'applyUserInfo.userCode',width:100,edittype:"select", editable:false,
			unformat:function(cellvalue,options,rowobject)
				{
					var values = new Array();
					var valuestemp = new Array();
					values = options.colModel.editoptions.value.split(";");
					for(var i=0;i<values.length;i++)
					{
						var temp = values[i].split(":");
						if(cellvalue == temp[1])
						{
							return temp[0];
						}
					}
				},
			formatter:function(cellvalue,options,rowobject)
				{
					var values = new Array();
					var valuestemp = new Array();
					values = options.colModel.editoptions.value.split(";");
					for(var i=0;i<values.length;i++)
					{
						var temp = values[i].split(":");
						if(rowobject.applyUserInfo.userCode == temp[0])
						{
							return temp[1];
						}
					}

				}
				,editoptions:{value:persons}},
			{name:'applyDate',index:'applyDate',width:100,editable:false,formatter:'date',edittype:'text',unformat:pickDate,
				formatter : function(cellvalue,opts, rwd) {
					if (cellvalue)
						return $.fn.fmatter.call(this,'date',new Date(cellvalue.time),opts,rwd);
					else
						return '';
				},
				formatoptions:{newformat:'Y/m/d'},
				editoptions:{dataInit:function(element){
					$(element).datepicker({dateFormat:'yy/mm/dd',changeMonth:true,changeYear:true})
				}}
			},

			{
	            name: 'productionInStock',
	            index: 'productionInStock',
	            width: 100,
	            fixed: true,
	            viewable: false,
	            sortable: false,
	            resize: false,
	            formatter: productionInStock
	        },

			{name:'operation',index : '',width : 100,fixed : true,sortable : false,resize : false,viewable:false,formatter : 'actions',formatoptions : {
					keys : true,
					delOptions : {
						closeAfterDel: true,
						recreateForm : true,
						beforeShowForm : beforeDeleteCallback,
						afterSubmit:afterSubmitFunc
					},
					editformbutton : true,
					editOptions : {
						closeAfterEdit: true,//useful here!!
						recreateForm : true,
						beforeShowForm : beforeEditCallback,
						afterSubmit:afterSubmitFunc
					}
				}
			}
		]
	var operateStatus = [false,false,false,false,false,false];
	var gridEditUrl = "/editProductionInStockApply";

	var jsonReaderObj = {repeatitems:false,id:"productionInStockApplyCode"};
	createJQGridTableAndCountByGridUrl(gridUrl,gridTableId,girdPaperId,gridCaption,colNames,colModels,operateStatus,jsonReaderObj,gridEditUrl,afterSubmitFunc)

}

//function executeOnePartInStock(partInStockCode, partCode, partName, inStockLot) {
//	_iframe('单件部件入库', '/executeOnePartInStockPart?id=' + partInStockCode );
//}

function executePartInStock(partInStockApplyCode) {

	//_iframe('部件入库', '/partInStockSelect?partInStockApplyCode=' + partInStockApplyCode);

	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
        _title: function (title) {
            var $title = this.options.title || '&nbsp;'
            if (("title_html" in this.options) && this.options.title_html == true)
                title.html($title);
            else title.text($title);
        }
    }));

    var dialog = $("#Filter_dialog").removeClass('hide').dialog({
        modal: true,
        width: 400,
        title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-search'></i> 部件入库</h4></div>",
        title_html: true,
        success: initSelect(partInStockApplyCode,"#partInStockApplyCode"),
        open: function () {
    	    var currentUser=$('#currentUser').val();
    	    $("#stockKeeperCode [value="+currentUser+"]").attr("selected",true);
        },
        close:function(){
	    	$("#FormError").hide();
	    	$("#stockBoxCode").val("");
	    	$("#stockKeeperCode").val("");
	    },
        buttons: [
            {
                text: "入库",
                "class": "btn btn-primary btn-xs",
                click: function () {

                	if(checkDialog("#FormError","#stockBoxCode","none") || checkDialog("#FormError","#stockKeeperCode","none")){
          				return;
          			}

                	//var responsorCode=$("#responsorCode").val();
            		var stockBoxCode=$("#stockBoxCode").val();
            		var stockKeeperCode=$("#stockKeeperCode").val();
            		var id=$("#partInStockApplyCode").val();

            		var data='id='+id+'&stockBoxCode='+stockBoxCode+'&stockKeeperCode='+stockKeeperCode;
            		//+'&responsorCode='+responsorCode
            		operationFunc(data,"executePartInStock",function(result){
            			var resultObj = $.parseJSON(result);
        				var resultStr = resultObj.result;
        				var res=afterShow(resultStr,'部件入库');
            		});
                }
            }
        ]
    });
}

function executeProductionInStock(productionInStockApplyCode) {

	//_iframe('部件入库', '/partInStockSelect?partInStockApplyCode=' + partInStockApplyCode);

	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
        _title: function (title) {
            var $title = this.options.title || '&nbsp;'
            if (("title_html" in this.options) && this.options.title_html == true)
                title.html($title);
            else title.text($title);
        }
    }));

    var dialog = $("#Filter_dialog").removeClass('hide').dialog({
        modal: true,
        width: 400,
        title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-search'></i> 产品入库</h4></div>",
        title_html: true,
        success: initSelect(productionInStockApplyCode,"#productionInStockApplyCode"),
        open: function () {
    	    var currentUser=$('#currentUser').val();
    	    $("#stockKeeperCode [value="+currentUser+"]").attr("selected",true);
        },
        close:function(){
	    	$("#FormError").hide();
//	    	$("#productionPlanCode").val("");
	    	$("#stockBoxCode").val("");
	    	$("#stockKeeperCode").val("");
	    },
        buttons: [
            {
                text: "入库",
                "class": "btn btn-primary btn-xs",
                click: function () {

                	if(checkDialog("#FormError","#stockBoxCode","none") || checkDialog("#FormError","#stockKeeperCode","none")){
          				return;
          			}

//                	var productionPlanCode=$("#productionPlanCode").val();
                	//var responsorCode=$("#responsorCode").val();
            		var stockBoxCode=$("#stockBoxCode").val();
            		var stockKeeperCode=$("#stockKeeperCode").val();
            		var id=$("#productionInStockApplyCode").val();

            		var data = 'id='+id
//            					+'&productionPlanCode='+productionPlanCode
            					+'&stockBoxCode='+stockBoxCode
            					+'&stockKeeperCode='+stockKeeperCode;
//            					+'&responsorCode='+responsorCode;

            		operationFunc(data,"executeProductionInStock",function(result){
            			var resultObj = $.parseJSON(result);
        				var resultStr = resultObj.result;
        				var res=afterShow(resultStr,'产品入库');
            		});
                }
            }
        ]
    });
}

function initSelect(inStockApplyCode,inId){
	$(inId).val(inStockApplyCode);
}

function partInStock(cellvalue, options, rowObject) {
//    if (rowObject.isOneManagement == "true") {
//        return ' <a class="ctl" id="onePartInStockApply" onclick="executeOnePartInStock(\'' + rowObject.partInStockApplyCode + '\')"><i class="icon-edit"></i> 单件入库</a>';
//    }else{
//    	return ' <a class="ctl" id="PartInStockApply" onclick="executePartInStock(\'' + rowObject.partInStockApplyCode + '\',\'' + options.rowId +'\')"><i class="icon-edit"></i> 入库</a>';
//    }
//    return '';
    return ' <a class="ctl" id="partInStockApply" onclick="executePartInStock(\'' + rowObject.partInStockApplyCode + '\')"><i class="icon-edit"></i> 入库</a>';
}

function productionInStock(cellvalue, options, rowObject) {
	return ' <a class="ctl" id="productionInStockApply" onclick="executeProductionInStock(\'' + rowObject.productionInStockApplyCode + '\')"><i class="icon-edit"></i> 入库</a>';
}

/*
 * 根据url项创建jqgrid表
 * @author wjp
 * @time 2016-11-30
 */

function createJQGridTableAndCountByGridUrl(gridUrl,gridTableId,girdPaperId,gridCaption,colNames,colModels,operateStatus,jsonReaderObj,gridEditUrl,afterSubmitFn)
{
	var grid_selector = gridTableId;
	var pager_selector = girdPaperId;
	var lastsel;
	jQuery(grid_selector).jqGrid({
		//direction: "rtl",
		url:gridUrl,
		datatype: "json",
		height: 'auto',
		colNames:colNames,
		colModel:colModels,

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30],
		pager : pager_selector,
		altRows: true,
		//toppager: true,

		//multikey: "ctrlKey",
		multiselect:true,
		multiboxonly: true,

		loadComplete : function() {
			setJqgridCss();
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);

				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);

				var rows=jQuery("#apply_table").jqGrid("getGridParam","records");
			 	$("#applyCount").text(rows);
			}, 0);
		},
		beforeSelectRow:function(id)
		{
			jQuery(grid_selector).jqGrid("resetSelection");
			return true;
		},
		onSelectRow: function (id) {
			if(id && id != lastsel)
			{
				//jQuery(grid_selector).restoreRow(lastsel);
				var jsonObj = jQuery(grid_selector).jqGrid("getRowData",id);
				if(jsonObj != null)
				{
					onSelectRowFunc(jsonObj);
				}

				lastsel = id;
			}

		},
		jsonReader:jsonReaderObj,
		editurl: gridEditUrl,
		caption: gridCaption,
		autowidth: true
	});

	//navButtons
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	//navbar options
			edit: operateStatus[0],
			editicon : 'icon-pencil blue',
			add: operateStatus[1],
			addicon : 'icon-plus-sign purple',
			del: operateStatus[2],
			delicon : 'icon-trash red',
			search: operateStatus[3],
			searchicon : 'icon-search orange',
			refresh: operateStatus[4],
			refreshicon : 'icon-refresh green',
			view: operateStatus[5],
			viewicon : 'icon-zoom-in grey',
		},
		{
			//edit record form
			closeAfterEdit: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
			},
			afterSubmit:afterSubmitFn
		},
		{
			//new record form
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
			},
			afterSubmit:afterSubmitFn
		},
		{
			//delete record form
			closeAfterDel: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);

				form.data('styled', true);
			},
			onClick : function(e) {
				alert(1);
			},
			afterSubmit:afterSubmitFn

		},
		{
			//search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,

			//multipleGroup:true,
			//showQuery: true

		},
		{
			//view record form
			recreateForm: true,
			beforeShowForm: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		}
	)
}

function onSelectRowFunc(jsonObj)
{
    var printCode = "";
	var printName = "";
    if(jsonObj.isOneManagement == "否")
    {
		if(jsonObj["productionInfo.productionCode"] == undefined)
		{
			printCode = jsonObj["partInfo.partCode"] + "_"+jsonObj.inStockLot;
			printName = getPartName(jsonObj["partInfo.partCode"]);
		}else{
			printCode = jsonObj["productionInfo.productionCode"] + "_"+jsonObj.inStockLot;
			printName = getProductionName(jsonObj["productionInfo.productionCode"]);
		}

    }else{
		if(jsonObj["productionInfo.productionCode"] == undefined)
		{
			printCode = jsonObj["partInfo.partCode"] + "_"+jsonObj.inStockLot+"_";
			printName = getPartName(jsonObj["partInfo.partCode"]);
		}else{
			printCode = jsonObj["productionInfo.productionCode"] + "_"+jsonObj.inStockLot+"_";
			printName = getProductionName(jsonObj["productionInfo.productionCode"]);
		}
    }

    sessionStorage.setItem("printCode",printCode);
	sessionStorage.setItem("printName",printName);
}

function getPartName(code)
{
	var parts = findParts();
	var val = parts.split(";");
	var name = "";
	for (var i = 0; i < val.length; i++) {
		var codeAndName = val[i].split(":");
		if (codeAndName[0] == code) {
			name = codeAndName[1];
		}
	}
	return name;
}
function getProductionName(code)
{
	var productions = findProducts();
	var val = productions.split(";");
	var name = "";
	for (var i = 0; i < val.length; i++) {
		var codeAndName = val[i].split(":");
		if (codeAndName[0] == code) {
			name = codeAndName[1];
		}
	}
	return name;
}