/*
 * 刷新产品出库分配单
 * @author wjp
 * @time 2016-11-28
 */
function getProductionArrangeForTable() {
	var grid_selector = "#productionArrange_table";
	var gridUrl = "queryProductionLot?isFinish=0";
	jQuery(grid_selector).jqGrid('setGridParam', {
		datatype : "json",
		url : gridUrl
	}).trigger('reloadGrid');
}

/*
 * 获得产品出库分配单 @author wjp @time 2016-11-28
 */
function getProductionArrange() {

	var grid_selector = "#productionArrange_table";
	jQuery(grid_selector)
			.jqGrid(
					{
						datatype : "json",
						url : 'queryArrangeProductionLot?isFinish=0',
						height : 'auto',
						colNames : [ '项目批次', '批次编号','责任人' ],
						colModel : [ {
							name : 'productionLotName',
							index : 'productionLotName',
							width : 100,
							editable : true,
							editoptions : {
								size : "0",
								maxlength : "100"
							}
						}, {
							name : 'productionLotCode',
							index : 'productionLotCode',
							width : 100,
							editable : true,
							editoptions : {
								size : "0",
								maxlength : "100"
							}
						},{
							name:'responsorInfo.responsorCode',
							index:'responsorInfo.userCode',
							width:100,
							edittype:"select", 
							editable:true,
							formatter:function(cellvalue,options,rowobject)
								{
									var values = new Array();
									var valuestemp = new Array();
									values = options.colModel.editoptions.value.split(";");
									for(var i=0;i<values.length;i++)
									{
										var temp = values[i].split(":");
										if(rowobject.responsorInfo.userCode == temp[0])
										{
											return temp[1];
										}
									}
	
								}
								,editoptions:{value:persons}
						}],
						viewrecords : true,
						altRows : true,

						multiselect : false,
						multiboxonly : true,

						loadComplete : function() {
							setJqgridCss();
							var table = this;
							setTimeout(function() {
								styleCheckbox(table);

								updateActionIcons(table);
								updatePagerIcons(table);
								enableTooltips(table);

								var rows = jQuery(grid_selector).jqGrid(
										"getGridParam", "records");
								$("#arrangeCount").text(rows);

							}, 0);
						},
						caption : "产品分配",
						autowidth : true,

						// subgrid开始
						subGrid : true,
						subGridRowExpanded : function(subgrid_id, row_id) {
							var rowData = $(grid_selector).jqGrid('getRowData',
									row_id);// 通过索引获取当前行对象
							getProductionLotComposition("productionArrange",
									rowData.productionLotCode);
							$("#" + subgrid_id).html($("#col-xs-12").html());
						},
					});
}

/*
 * 刷新部件出库分配单 @author wjp @time 2016-11-28
 */
function getPartArrangeForTable() {
	var grid_selector = "#partArrange_table";
	var gridUrl = "queryProductionPlan?isFinish=0";
	jQuery(grid_selector).jqGrid('setGridParam', {
		datatype : "json",
		url : gridUrl
	}).trigger('reloadGrid');
}

/*
 * 获得部件出库分配单 @author wjp @time 2016-11-28
 */
function getPartArrange() {

	var grid_selector = "#partArrange_table";
	//
	jQuery(grid_selector)
			.jqGrid(
					{
						datatype : "json",
						url : 'queryArrangeProductionPlan?isFinish=0',
						editurl : 'editProductionPlan',// nothing is saved
						height : "auto",
						colNames : [ '产品生产计划', '产品生产计划', '产品名称', '产品编号', '所需个数','责任人' ],
						colModel : [ {
							name : 'productionPlanName',
							index : 'productionPlanName',
							width : 100,
							editable : true,
							editoptions : {
								size : "0",
								maxlength : "100"
							}
						}, {
							name : 'productionPlanCode',
							index : 'productionPlanCode',
							width : 100,
							editable : true,
							hidden : true
						}, {
							name : 'productionInfo.productionName',
							index : 'productionInfo.productionCode',
							width : 100,
							editable : true,
							editoptions : {
								size : "0",
								maxlength : "100"
							}
						}, {
							name : 'productionCode',
							index : 'productionCode',
							width : 100,
							editable : false,
							hidden : true,
							/*formatter:function(cellvalue,options,rowobject)
							{
								if(32 <= rowobject.productionCode.length)
									return '内部编号';
								else
									return rowobject.productionCode;
						   },*/
							editoptions : {
								size : "0",
								maxlength : "100"
							}
						}, {
							name : 'produceCount',
							index : 'produceCount',
							width : 50,
							editable : true,
							sorttype : "int",
						},{
							name:'responsorInfo.responsorCode',
							index:'responsorInfo.userCode',
							width:100,
							edittype:"select", 
							editable:true,
							formatter:function(cellvalue,options,rowobject)
								{
									var values = new Array();
									var valuestemp = new Array();
									values = options.colModel.editoptions.value.split(";");
									for(var i=0;i<values.length;i++)
									{
										var temp = values[i].split(":");
										if(rowobject.responsorInfo.userCode == temp[0])
										{
											return temp[1];
										}
									}
	
								},
							editoptions:{value:persons}
						}],
						viewrecords : true,
						altRows : true,

						multiselect : false,
						multiboxonly : true,

						loadComplete : function() {
							setJqgridCss();
							var table = this;
							setTimeout(function() {
								styleCheckbox(table);
								updateActionIcons(table);
								updatePagerIcons(table);
								enableTooltips(table);

								var rows = jQuery(grid_selector).jqGrid(
										"getGridParam", "records");
								$("#arrangeCount").text(rows);

							}, 0);
						},
						jsonReader : {
							repeatitems : false,
							id : "productionPlanCode"
						},
						caption : "部件分配",
						autowidth : true,

						// subgrid开始
						subGrid : true,
						subGridRowExpanded : function(subgrid_id, row_id) {
							var rowData = $(grid_selector).jqGrid('getRowData',
									row_id);// 通过索引获取当前行对象

							getProductionComposition("partArrange",
									rowData.productionCode,
									rowData.productionPlanCode);
							$("#" + subgrid_id).html($("#col-xs-12").html());
						}
					// subgrid结束

					});
}

/*
 * 获取产品项目批次组成 @author wjp @time 2016-11-28
 */
function getProductionLotComposition(type, productLotCode) {
	var condition = "type=" + type + "&productLotCode=" + productLotCode;
	operationFunc(condition, "queryArrangeProductionLotDefine", function(result) {
		generateLotCompositionDetail(result)
	});
}

/*
 * 获取产品组成 @author wjp @time 2016-11-28
 */
function getProductionComposition(type, productCode, productionPlanCode) {

	var condition = "type=" + type + "&productCode=" + productCode
			+ "&productionPlanCode=" + productionPlanCode;
	operationFunc(condition, "queryArrangeProductionComposition", function(result) {
		generateProductionCompositionDetail(result, productCode,
				productionPlanCode)
	});
}

/*
 * 产品项目批次组成详细情况表
 * @author wjp
 * @time 2016-11-28
 */
function generateLotCompositionDetail(result)
{
	
	var val = $.parseJSON(result);
		var treeContent = ""; 
		treeContent += '<thead><tr>'
		treeContent += '<th>批次编号</th><th>产品名称</th><th>产品编号</th><th>所需产品个数</th><th>已有产品个数</th><th>选择的个数</th><th>部门</th><th>详细</th><th>操作</th>';
		treeContent += '</tr></thead>';
		treeContent += '<tbody>';
		for(var i = 0;i<val.rows.length;i++)
		{
			var date = new Date();
			var maxNum= val.rows[i].needProductionCount - val.rows[i].haveProductionCount;
			treeContent += '<tr>'
			treeContent += '<td>';
			treeContent += val.rows[i].productionLot.productionLotCode;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].productionInfo.productionName;
			treeContent += '</td>';
			treeContent += '<td>';
			if(32 <= val.rows[i].productionInfo.productionCode.length){
            	treeContent += "内部编号";
            }else{
            	treeContent += val.rows[i].productionInfo.productionCode;
            }
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].needProductionCount;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].haveProductionCount;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].choseProductionCount;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].productionLot.deptInfo.deptName;
			treeContent += '</td>';
		
			treeContent += '<td>';
			treeContent += '<a  onclick ="choseProductionDetail('+ "'" +val.rows[i].productionInfo.productionCode+ "'"+ ','+ "'" +val.rows[i].productionLot.productionLotCode+ "'"+')" ';
			treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
			treeContent += '</td>';

			treeContent += '<td>';
			treeContent += '<a onclick ="executeProductionOutStock('+ "'" +val.rows[i].productionInfo.productionCode+ "'"+ ','+ "'" +val.rows[i].productionLot.productionLotCode+ "','"+maxNum+"'"+')" ';
			treeContent += 'class="tooltip-info" data-rel="tooltip" title="操作"><span class="blue"><i class="icon-edit"></i> 出库</span></a>';
			treeContent += '</td>';
			treeContent += '</tr>';			
		}
		treeContent += '</tbody>';
		document.getElementById("productlot_table").innerHTML = treeContent;
}

function executeProductionOutStock(productionCode,productionLotCode,maxNum) {
	
	var outStockLot = "Out" + getTime();
	var data='productionCode='+productionCode+'&productionLotCode='+productionLotCode + '&outStockLot=' + outStockLot;
	
	operationFunc(data,"AddProductionOutStockByArrange",function(result){
		var resultObj = $.parseJSON(result);
		var resultStr = resultObj.result;
		var res=afterShow(resultStr,'产品出库');
	});
	
//    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
//        _title: function (title) {
//            var $title = this.options.title || '&nbsp;'
//            if (("title_html" in this.options) && this.options.title_html == true)
//                title.html($title);
//            else title.text($title);
//        }
//    }));
//
//    var dialog = $("#Filter_dialog").removeClass('hide').dialog({
//        modal: true,
//        width: 400,
//        title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-search'></i>产品出库</h4></div>",
//        title_html: true,
//        success: "",
//        open:function(){
//           	 var input = $('#outStockLot');
//       	     var outStockLot = "Out"+getTime();
//       	     input.val(outStockLot);
//       	     input.attr("readonly",true);
//       	     
//       	     var outStockCount=$('#outStockCount_tr');
//       	     outStockCount.hide();
//       	     
//       	     var outStockType=$('#outStockType_tr');
//       	     outStockType.show();
//       	     
//	       	 var currentUser=$('#currentUser').val();
//	  	     $("#stockKeeperInfo [value="+currentUser+"]").attr("selected",true);
//       	     
////			operationFunc(("productionCode="+productionCode), "queryGoodsBoxByProdCode", function(result) {
////				$("select#stockBoxCode").empty();
////				var str="";
////				var val = $.parseJSON(result);
////				str+="<option value=''></option>";
////				$.each(val.result,function(id,item){
////					str+="<option value='"+item.code+"'>"+item.name+"</option>";
////				});
////				$("select#stockBoxCode").append(str);
////			});
//	  	     
//	  	     $("#outStockType [ value = 0 ]").attr("selected",true);
//			  	     
//       	     var date = new Date();
//       	     var appdate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
//       	     $('#outStockDate').val(appdate);
//        },
//        close:function(){
//	    	$("#FormError").hide();
//	    	$("#outStockCount").val("");
//	    	$("#outStockLot").val("");
////			$("#outStockDate").val("");
////			$("#outStockType").val("");
////			$("#deptInfo").val("");
////			$("#stockKeeperInfo").val("");
////			$("#stockBoxCode").val("");
//	    },
//        buttons: [
//            {
//                text: "出库",
//                "class": "btn btn-primary btn-xs",
//                click: function () {
//                	var data='productionCode='+productionCode+'&productionLotCode='+productionLotCode;
//                	
//                	if(
////                			checkDialog("#FormError","#outStockCount","none") 
////              				|| checkDialog("#FormError","#outStockCount","integer")
////              				|| checkDialog("#FormError","#outStockCount","max", maxNum) || 
////              				checkDialog("#FormError","#outStockDate","none") || 
//              				checkDialog("#FormError","#outStockType","none")
////              				|| checkDialog("#FormError","#stockBoxCode","none")
//              				|| checkDialog("#FormError","#stockKeeperInfo","none")
//          			){
//          				return;
//          			}
////                	var outStockCount=$("#partInfo").val();
////                	  data=data + '&partInfo.partCode='+partInfo;
////            		var inStockLot=$("#inStockLot").val();
////            		   data=data + '&inStockLot='+inStockLot;
//                	var outStockLot=$("#outStockLot").val();
//                		data=data + '&outStockLot='+outStockLot;
////            		var outStockCount=$("#outStockCount").val();
////            		   data=data + '&outStockCount='+outStockCount;
////            		var outStockDate=$("#outStockDate").val();
////            			data=data + '&outStockDate='+outStockDate;
//            		var outStockType=$("#outStockType").val();
//            			data=data + '&outStockType='+outStockType;
////            		var deptInfo=$("#deptInfo").val();
////            			data=data + '&deptInfo.deptCode='+deptInfo;
////            		var responsorInfo=$("#responsorInfo").val();
////            			data=data + '&responsorInfo.userCode='+responsorInfo;
//            		var stockKeeperInfo=$("#stockKeeperInfo").val();
//            			data=data + '&stockKeeperInfo.userCode='+stockKeeperInfo;
////            		var stockBoxCode=$("#stockBoxCode").val();
////            			data=data + '&stockBoxCode='+stockBoxCode;
//            		var isOneManagement=$("#isOneManagement").val();
//            			data=data + '&isOneManagement='+isOneManagement;
////            		var isFinishDelivery=$("#isFinishDelivery").val();
////            			data=data + '&isFinishDelivery='+isFinishDelivery;
//    
//            		operationFunc(data,"AddProductionOutStockByArrange",function(result){
//            			var resultObj = $.parseJSON(result);
//        				var resultStr = resultObj.result;
//        				var res=afterShow(resultStr,'产品出库');
//            		});
//                }
//            }
//        ]
//    });
}

/*
 * 产品组成详细情况表 @author wjp @time 2016-11-28
 */
function generateProductionCompositionDetail(result, productionCode,
		productionPlanCode) {
	var val = $.parseJSON(result);
	var treeContent = "";
	treeContent += '<thead><tr>'
	// treeContent +=
	// '<th>部件名称</th><th>部件编号</th><th>所需部件个数</th><th>当前部件库存量</th><th>选择的个数</th><th>查看详情</th><th>基本操作</th>';
	treeContent += '<th>部件名称</th><th>部件编号</th><th>所需部件个数</th><th>已有部件个数</th><th>选择的个数</th><th>查看详情</th><th>操作</th>';
	treeContent += '</tr></thead>';
	treeContent += '<tbody>';
	for (var i = 0; i < val.rows.length; i++) {
		var date = new Date();
		var maxNum= val.rows[i].needPartCount - val.rows[i].havePartCount;
		treeContent += '<tr>'
		treeContent += '<td>';
		treeContent += val.rows[i].partInfo.partName;
		treeContent += '</td>';
		treeContent += '<td>';
		if(val.rows[i].partInfo.partCode.length>32){
			treeContent += "内部编号";
		}else{
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
		treeContent += val.rows[i].chosePartCount;
		treeContent += '</td>';

		treeContent += '<td>';
		treeContent += '<a  onclick ="chosePartDetail(' + "'"
				+ val.rows[i].partInfo.partCode + "','" + productionCode
				+ "','" + productionPlanCode + "'" + ')" ';
		treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
		treeContent += '</td>';

		treeContent += '<td>';
		treeContent += '<a onclick ="executePartOutStock('+ "'" +val.rows[i].partInfo.partCode+ "'"+ ','+ "'" +productionPlanCode+ "','" +maxNum + "'" +')" ';
		treeContent += 'class="tooltip-info" data-rel="tooltip" title="操作"><span class="blue"><i class="icon-edit"></i> 出库</span></a>';
		treeContent += '</td>';
		treeContent += '</tr>';	

		treeContent += '</tr>';
	}
	treeContent += '</tbody>';
	document.getElementById("partlot_table").innerHTML = treeContent;
}

function executePartOutStock(partCode,productionPlanCode,maxNum) {
	
	var outStockLot = "Out" + getTime();
	var data='partCode='+partCode+'&productionPlanCode='+productionPlanCode + '&outStockLot=' + outStockLot;
	
	operationFunc(data,"AddPartOutStockByArrange",function(result){
		var resultObj = $.parseJSON(result);
		var resultStr = resultObj.result;
		var res=afterShow(resultStr,'部件出库');
	});
//
//	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
//        _title: function (title) {
//            var $title = this.options.title || '&nbsp;'
//            if (("title_html" in this.options) && this.options.title_html == true)
//                title.html($title);
//            else title.text($title);
//        }
//    }));
//
//    var dialog = $("#Filter_dialog").removeClass('hide').dialog({
//        modal: true,
//        width: 400,
//        title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-search'></i> 部件出库</h4></div>",
//        title_html: true,
//        success: "",
//        open:function(){
//          	 var input = $('#outStockLot');
//      	     var outStockLot = "Out"+getTime();
//      	     input.val(outStockLot);
//      	     input.attr("readonly",true);
//      	     
//      	     var outStockCount=$('#outStockCount_tr');
//     	     outStockCount.hide();
//     	     
//     	     var outStockType=$('#outStockType_tr');
//      	     outStockType.show();
//      	     
//	       	 var currentUser=$('#currentUser').val();
//	  	     $("#stockKeeperInfo [value="+currentUser+"]").attr("selected",true);
//      	     
////			operationFunc(("partCode="+partCode), "queryGoodsBoxByPartCode", function(result) {
////				$("select#stockBoxCode").empty();
////				var str="";
////				var val = $.parseJSON(result);
////				str+="<option value=''></option>";
////				$.each(val.result,function(id,item){
////					str+="<option value='"+item.code+"'>"+item.name+"</option>";
////				});
////				$("select#stockBoxCode").append(str);
////			});
//			  	
//	  	   $("#outStockType [ value = 0 ]").attr("selected",true);
//      	     
//      	     var date = new Date();
//      	     var appdate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
//      	     $('#outStockDate').val(appdate);
//        },
//	    close:function(){
//	    	$("#FormError").hide();
////	    	$("#outStockCount").val("");
//	    	$("#outStockLot").val("");
////			$("#outStockDate").val("");
////			$("#outStockType").val("");
////			$("#deptInfo").val("");
////			$("#stockKeeperInfo").val("");
////			$("#stockBoxCode").val("");
//	    },
//        buttons: [
//            {
//                text: "出库",
//                "class": "btn btn-primary btn-xs",
//                click: function () {
//                	$("#FormError").hide();
//                	var data='partCode='+partCode+'&productionPlanCode='+productionPlanCode;
//
////                	var outStockCount=$("#partInfo").val();
////                	  data=data + '&partInfo.partCode='+partInfo;
////            		var inStockLot=$("#inStockLot").val();
////            		   data=data + '&inStockLot='+inStockLot;
//                	
//        			if(
////        				checkDialog("#FormError","#outStockCount","none") ||
////        				checkDialog("#FormError","#outStockCount","integer") ||
////        				checkDialog("#FormError","#outStockCount","max", maxNum) || 
////        				checkDialog("#FormError","#outStockDate","none") || 
//        				checkDialog("#FormError","#outStockType","none")
////        				|| checkDialog("#FormError","#stockBoxCode","none")
//        				|| checkDialog("#FormError","#stockKeeperInfo","none")
//        			){
//        				return;
//        			}
////            		var outStockCount=$("#outStockCount").val();
////            			data=data + '&outStockCount='+outStockCount;
//            		var outStockLot=$("#outStockLot").val();
//            		    data=data + '&outStockLot='+outStockLot;
////            		var outStockDate=$("#outStockDate").val();
////            			data=data + '&outStockDate='+outStockDate;
//            		var outStockType=$("#outStockType").val();
//            			data=data + '&outStockType='+outStockType;
////            		var deptInfo=$("#deptInfo").val();
////            			data=data + '&deptInfo.deptCode='+deptInfo;
////            		var responsorInfo=$("#responsorInfo").val();
////            			data=data + '&responsorInfo.userCode='+responsorInfo;
//            		var stockKeeperInfo=$("#stockKeeperInfo").val();
//            			data=data + '&stockKeeperInfo.userCode='+stockKeeperInfo;
////            		var stockBoxCoDE=$("#STOCKBOXCODE").VAL();
////            			DATA=DATA + '&STOCKBOXCOde='+stockBoxCode;
//            		var isOneManagement=$("#isOneManagement").val();
//            			data=data + '&isOneManagement='+isOneManagement;
//
//            		operationFunc(data,"AddPartOutStockByArrange",function(result){
//            			var resultObj = $.parseJSON(result);
//        				var resultStr = resultObj.result;
//        				var res=afterShow(resultStr,'部件出库');
//            		});
//                }
//            }
//        ],
//    });
}



function chosePartDetail(code, productionCode, productionPlanCode) {
	_iframe('出库详细', '/part_arrange_chose_detail?partCode=' + code
			+ '&productionCode=' + productionCode + '&productionPlanCode='
			+ productionPlanCode);
}

function choseProductionDetail(code, productionLotCode) {
	_iframe('出库详细', '/product_arrange_chose_detail?productionCode=' + code
			+ '&productionLotCode=' + productionLotCode);
}

function queryTenAccountByType(showTable,showType){
	operationFunc('', "queryTenAccountByType", function (result) {
		getTenAccountByType(result, showType,showTable, ' ')
	});
}

function getComputerStateForTable2(showTable,showType){
	operationFunc('', "queryComputerMoneyAndNumByDept", function (result) {
		getComputerState2(result, showType,showTable, ' ')
	});
}

function getAccountStateForTable2(showTable,showType){
	operationFunc('', "queryAccountNumByTenYear", function (result) {
		getAccountState2(result, showType,showTable, ' ')
	});
}

function getAccountStateForTable3(showTable,showType){
	operationFunc('', "queryAccountMoneyByTenYear", function (result) {
		getAccountState2(result, showType,showTable, ' ')
	});
}

function getAccountStateForTable4(showTable,showType){
	operationFunc('', "queryAccountNumByTenYearLine", function (result) {
		getAccountState3(result, showType,showTable, ' ')
	});
}

function getAccountStateForTable5(showTable,showType){
	operationFunc('', "queryAccountMoneyByTenYearLine", function (result) {
		getAccountState3(result, showType,showTable, ' ')
	});
}



function getTenAccountByType(result, showType,showTable, isFinish) {

	var val = $.parseJSON(result);
	if (showType == 'table') {
		if (planFinishTable != null) {
			planFinishTable.fnClearTable();
			planFinishTable.fnDestroy();
			planFinishTable = null;
		}
		var treeContent = "";

		treeContent += '<thead><tr>'
		treeContent += '<th>生产计划</th><th>产品名称</th><th>生产数量</th><th>计划开始日期</th><th>计划结束日期</th><th>部门</th><th>责任人</th><th>完成情况</th><th>完成日期</th></tr></thead>';
		treeContent += '<tbody>';

		for (var i = 0; i < val.rows.length; i++) {
			var date = new Date();
			treeContent += '<tr>'
			treeContent += '<td>';
			treeContent += val.rows[i].productionPlanName;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].productionInfo.productionName;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].produceCount;
			treeContent += '</td>';
			treeContent += '<td>';
			if (val.rows[i].planStartDate == null || val.rows[i].planStartDate == "" || (val.rows[i].planStartDate.split("-"))[0] == '1900') {
				treeContent += "---";
			}
			else {
				var v = (val.rows[i].planStartDate.split(" "))[0];
				treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
			}
			treeContent += '</td>';
			treeContent += '<td>';
			if (val.rows[i].planEndDate == null || val.rows[i].planEndDate == "" || (val.rows[i].planEndDate.split("-"))[0] == '1900') {
				treeContent += "---";
			}
			else {
				var v = (val.rows[i].planEndDate.split(" "))[0];
				treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
			}
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].deptInfo.deptName;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].responsorInfo.userName;
			treeContent += '</td>';
			treeContent += '<td>';
			if (val.rows[i].isFinish == false) {
				treeContent += "正在进行";
			}
			else {
				var finishDateStr = (val.rows[i].finishDate.split(" "))[0];
				var finishDateArray = finishDateStr.split("-");
				var finishDate = new Date(finishDateArray[0], finishDateArray[1] - 1, finishDateArray[2]);
				var endDateStr = (val.rows[i].planEndDate.split(" "))[0];
				var endDateArray = endDateStr.split("-");
				var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
				treeContent += judgeFinishStatus(finishDate.getTime(), endDate.getTime());
			}
			treeContent += '</td>';
			treeContent += '<td>';
			if (val.rows[i].finishDate == null || val.rows[i].finishDate == "" || (val.rows[i].finishDate.split("-"))[0] == '1900') {
				treeContent += "---";
			}
			else {
				var v = (val.rows[i].finishDate.split(" "))[0];
				treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
			}
			treeContent += '</td>';
			treeContent += '</tr>'
		}
		treeContent += '</tbody>';
		document.getElementById("productionplanFinish_table").innerHTML = treeContent;

		if (isFinish == '') {
			planFinishTable = $('#productionplanFinish_table').dataTable();
		}
	}
	else if (showType == 'echarts') {
		var names = val.nameList;
		var allCount = val.numList;

		//var finishCount = val.finishCount;
		//var finishCountExceedLimite = val.finishCountExceedLimite;
		//var unFinishCountExceedLimit = val.unFinishCountExceedLimit;
		//var unFinishCount = allCount - finishCount - finishCountExceedLimite - unFinishCountExceedLimit;
		//var legend1 = '按时完成(' + finishCount + "个)";
		//var legend2 = '延期完成(' + finishCountExceedLimite + "个)";
		//var legend3 = '正常进行中(' + unFinishCount + "个)";
		//var legend4 = '过期未完成(' + unFinishCountExceedLimit + "个)";
		var option = {
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis:  {
				type: 'value'
			},
			yAxis: {
				type: 'category',
				data: names
			},
			series: [
				{
					name: '借用次数',
					type: 'bar',
					stack: '总量',
					label: {
						normal: {
							show: true,
							position: 'insideRight'
						}
					},
					data: allCount
				}
			]
		};

		var myChart = echarts.init(document.getElementById(showTable));
		myChart.setOption(option);

		//myChart.on('click', function clickFunc(param) {

		//	if (param.name == legend1) {
		//		$("#productionPlanFinish_dialog").modal('toggle');
		//		var timeRange = sessionStorage.productionplanTimeRangeForPie;
		//		changeProductionPlanFinishByTimeRange_1(timeRange, 'finish');
		//	} else if (param.name == legend2) {
		//		$("#productionPlanFinish_dialog").modal('toggle');
		//		var timeRange = sessionStorage.productionplanTimeRangeForPie;
		//		changeProductionPlanFinishByTimeRange_1(timeRange, 'finishexceed');
		//	}
		//	else if (param.name == legend3) {
		//		$("#productionPlanFinish_dialog").modal('toggle');
		//		var timeRange = sessionStorage.productionplanTimeRangeForPie;
		//		changeProductionPlanFinishByTimeRange_1(timeRang	e, 'unfinish');
		//	}
		//	else if (param.name == legend4) {
		//		$("#productionPlanFinish_dialog").modal('toggle');
		//		var timeRange = sessionStorage.productionplanTimeRangeForPie;
		//		changeProductionPlanFinishByTimeRange_1(timeRange, 'unfinishexceed');
		//	}
		//});
	}

}
function getComputerState2(result, showType,showTable, isFinish) {

	var val = $.parseJSON(result);
	var names = val.nameList;
	var deptCount = val.deptNumList;
	var deptPrice = val.deptPriceList;
	var allCount = val.allNumList;

	var option = {
			title: {
				text: '	',
				x: 'left',
				y: 0
			},
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['各部门占用资产金额','各部门占用计算机台数']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			yAxis:  [
				{
					name: '',
					type: 'value',
					axisLabel: {
						formatter: '{value}\n(元)'
					}

				},
				{
					name: '',
					type: 'value',
					axisLabel: {
						formatter: '{value}\n(台)'
					}
				}
			],
			xAxis: {
				name:'',
				type: 'category',
				data: names
			},
			dataZoom: [
				{
					type: 'inside',
					start: 0,
					end: 25
				},
				{
					show: true,
					type: 'slider',
					y: '8%',
					start: 25,
					end: 100
				}
			],
		color: [ 'rgb(24,89,153)', 'rgb(221,88,80)'],
		series: [
				{
					name: '各部门占用资产金额',
					type: 'bar',
					label: {
						normal: {
							//show: true,
							show: false,
							position: 'insideRight'
						}
					},
					data: deptPrice
				},
				{
					name: '各部门占用计算机台数',
					type: 'bar',
					yAxisIndex: 1,
					label: {
						normal: {
							//show: true,
							show: false,
							position: 'insideRight'
						}
					},
					data: deptCount
				}
			]
		};

		var myChart = echarts.init(document.getElementById(showTable));
		myChart.setOption(option);
}

//饼图（五年内资产）
function getAccountState2(result, showType,showTable, isFinish) {

	var val = $.parseJSON(result);
	var yearList = val.yearList;
	var inList = val.inList;
	var outList = val.outList;

	option = {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}: {c} ({d}%)",
			labelLine: {show: true}
		},
		legend: {
			orient: 'vertical',
			x: 'left',
			data:yearList
		},
		color: ['rgb(190,155,155)', 'rgb(97,160,168)', 'rgb(24,89,153)', 'rgb(221,88,80)', 'rgb(228,116,255)'],//, 'rgb(255,122,67)', 'rgb(138,128,255)', 'rgb(104,177,255)', 'rgb(255,50,98)', 'rgb(0,0,0)'],
		series: [
			{
				name:showType,
				type:'pie',

				radius: [0, '70%'],

				label: {
					normal: {
						position: 'inner'
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data:inList
			},
			{
				name:showType,
				type:'pie',
				radius: ['80%', '90%'],
				//selectedMode: 'single',
				data:outList
			}
		]
	};

		var myChart = echarts.init(document.getElementById(showTable));
		myChart.setOption(option);

}

//折线图（十年内资产）
function getAccountState3(result, showType,showTable, isFinish) {

	var val = $.parseJSON(result);
	var yearList = val.yearList;
	var dataList = val.dataList;

	var option = {
		title: {
			text: ''
		},
		tooltip: {
			trigger: 'axis'
		},
		//legend: {
		//	data:['邮件营销']
		//},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: yearList
		},
		yAxis: {
			type: 'value',
			name: showType
		},
		series: [
			{
				name:showType,
				type:'line',
				data:dataList
			}
		]
	};


	var myChart = echarts.init(document.getElementById(showTable));
	myChart.setOption(option);

}

function queryAllAccountBorrowByYear(showTable,showType){
	operationFunc('', "queryAllAccountBorrowByYear", function (result) {
		getAllAccountBorrowByYear(result, showType,showTable, ' ')
	});
}


function getAllAccountBorrowByYear(result, showType,showTable, isFinish) {

	var val = $.parseJSON(result);
	if (showType == 'table') {
		if (planFinishTable != null) {
			planFinishTable.fnClearTable();
			planFinishTable.fnDestroy();
			planFinishTable = null;
		}
		var treeContent = "";

		treeContent += '<thead><tr>'
		treeContent += '<th>生产计划</th><th>产品名称</th><th>生产数量</th><th>计划开始日期</th><th>计划结束日期</th><th>部门</th><th>责任人</th><th>完成情况</th><th>完成日期</th></tr></thead>';
		treeContent += '<tbody>';

		for (var i = 0; i < val.rows.length; i++) {
			var date = new Date();
			treeContent += '<tr>'
			treeContent += '<td>';
			treeContent += val.rows[i].productionPlanName;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].productionInfo.productionName;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].produceCount;
			treeContent += '</td>';
			treeContent += '<td>';
			if (val.rows[i].planStartDate == null || val.rows[i].planStartDate == "" || (val.rows[i].planStartDate.split("-"))[0] == '1900') {
				treeContent += "---";
			}
			else {
				var v = (val.rows[i].planStartDate.split(" "))[0];
				treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
			}
			treeContent += '</td>';
			treeContent += '<td>';
			if (val.rows[i].planEndDate == null || val.rows[i].planEndDate == "" || (val.rows[i].planEndDate.split("-"))[0] == '1900') {
				treeContent += "---";
			}
			else {
				var v = (val.rows[i].planEndDate.split(" "))[0];
				treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
			}
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].deptInfo.deptName;
			treeContent += '</td>';
			treeContent += '<td>';
			treeContent += val.rows[i].responsorInfo.userName;
			treeContent += '</td>';
			treeContent += '<td>';
			if (val.rows[i].isFinish == false) {
				treeContent += "正在进行";
			}
			else {
				var finishDateStr = (val.rows[i].finishDate.split(" "))[0];
				var finishDateArray = finishDateStr.split("-");
				var finishDate = new Date(finishDateArray[0], finishDateArray[1] - 1, finishDateArray[2]);
				var endDateStr = (val.rows[i].planEndDate.split(" "))[0];
				var endDateArray = endDateStr.split("-");
				var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
				treeContent += judgeFinishStatus(finishDate.getTime(), endDate.getTime());
			}
			treeContent += '</td>';
			treeContent += '<td>';
			if (val.rows[i].finishDate == null || val.rows[i].finishDate == "" || (val.rows[i].finishDate.split("-"))[0] == '1900') {
				treeContent += "---";
			}
			else {
				var v = (val.rows[i].finishDate.split(" "))[0];
				treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
			}
			treeContent += '</td>';
			treeContent += '</tr>'
		}
		treeContent += '</tbody>';
		document.getElementById("productionplanFinish_table").innerHTML = treeContent;

		if (isFinish == '') {
			planFinishTable = $('#productionplanFinish_table').dataTable();
		}
	}
	else if (showType == 'echarts') {
		var lastYearList = val.lastYearList;
		var thisYearList = val.thisYearList;

		//var finishCount = val.finishCount;
		//var finishCountExceedLimite = val.finishCountExceedLimite;
		//var unFinishCountExceedLimit = val.unFinishCountExceedLimit;
		//var unFinishCount = allCount - finishCount - finishCountExceedLimite - unFinishCountExceedLimit;
		//var legend1 = '按时完成(' + finishCount + "个)";
		//var legend2 = '延期完成(' + finishCountExceedLimite + "个)";
		//var legend3 = '正常进行中(' + unFinishCount + "个)";
		//var legend4 = '过期未完成(' + unFinishCountExceedLimit + "个)";
		var option = {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['2016年','2017年']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
			},
			yAxis: {
				name: '个数',
				type: 'value'
			},
			series: [
				{
					name:'2016年',
					type:'line',
					stack: '总量',
					data:lastYearList
				},
				{
					name:'2017年',
					type:'line',
					stack: '总量',
					data:thisYearList
				}
			]
		};

		var myChart = echarts.init(document.getElementById(showTable));
		myChart.setOption(option);

		//myChart.on('click', function clickFunc(param) {

		//	if (param.name == legend1) {
		//		$("#productionPlanFinish_dialog").modal('toggle');
		//		var timeRange = sessionStorage.productionplanTimeRangeForPie;
		//		changeProductionPlanFinishByTimeRange_1(timeRange, 'finish');
		//	} else if (param.name == legend2) {
		//		$("#productionPlanFinish_dialog").modal('toggle');
		//		var timeRange = sessionStorage.productionplanTimeRangeForPie;
		//		changeProductionPlanFinishByTimeRange_1(timeRange, 'finishexceed');
		//	}
		//	else if (param.name == legend3) {
		//		$("#productionPlanFinish_dialog").modal('toggle');
		//		var timeRange = sessionStorage.productionplanTimeRangeForPie;
		//		changeProductionPlanFinishByTimeRange_1(timeRange, 'unfinish');
		//	}
		//	else if (param.name == legend4) {
		//		$("#productionPlanFinish_dialog").modal('toggle');
		//		var timeRange = sessionStorage.productionplanTimeRangeForPie;
		//		changeProductionPlanFinishByTimeRange_1(timeRange, 'unfinishexceed');
		//	}
		//});
	}

}
