/*
 * 获取产品入库表
 * @author minsheng.bai
 * @time 2016-11-10
 */

function getProductionInStockForTable_ProductionStockData() {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var startDateCondition = startDate.split("/")[0] + "-" + startDate.split("/")[1] + "-" + startDate.split("/")[2];
    var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1] + "-" + endDate.split("/")[2];

    var condition = "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;
    var gridData = "";
    gridData += "["
    operationFunc(condition, "queryProductionInStock", function (result) {
        var val = $.parseJSON(result);
        for (var i = 0; i < val.rows.length; i++) {
            gridData += "{"
            gridData += '"num":';
            gridData += '"' + val.rows[i].num + '"' + ",";
            gridData += '"productionName":';
            gridData += '"' + val.rows[i].productionInfo.productionName + '"' + ",";
            gridData += '"inStockLot":';
            gridData += '"' + val.rows[i].inStockLot + '"' + ",";
            gridData += '"inStockCount":';
            gridData += '"' + val.rows[i].inStockCount + '"' + ",";
            gridData += '"productionPrice":';
            gridData += '"' + val.rows[i].productionPrice + '"' + ",";
            gridData += '"inStockDate":';
            var date = new Date();
            date.setTime(val.rows[i].inStockDate.time);
            if (date.getFullYear() == '1900') {
                gridData += '"-/-/-"';
            }
            else {
                gridData += '"' + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + '"' + ",";
            }
            gridData += '"productType":';
            gridData += '"' + val.rows[i].productType + '"' + ",";
            gridData += '"supplierName":';
            gridData += '"' + val.rows[i].supplierInfo.supplierName + '"' + ",";
            gridData += '"deptName":';
            gridData += '"' + val.rows[i].deptInfo.deptName + '"' + ",";
            gridData += '"stockBoxCode":';
            gridData += '"' + val.rows[i].stockBoxCode + '"' + ",";
            gridData += '"stockKeeperInfouserName":';
            gridData += '"' + val.rows[i].stockKeeperInfo.userName + '"' + ",";
            gridData += '"isOneManagement":';
            gridData += '"' + val.rows[i].isOneManagement + '"';
            gridData += "}"
            if (i < val.rows.length - 1) {
                gridData += ","
            }
        }
    });
    gridData += "]"
    var girdDataObj = JSON.parse(gridData);
    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "产品入库情况";
    var colNames = ['序号', '产品入库编号', '产品计划编号', '产品名称', '入库批次', '入库数量', '产品批次编码', '单价', '入库日期', '生产类型', '供应商', '部门', '责任人', '货架号', '库管员', '是否单件管理', '单件入库', '操作'];
    var colModels = [
        {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
        {name: 'productionInStockCode', index: 'productionInStockCode', width: 100, hidden: true, editable: false},
        {name: 'productionPlanCode', index: 'productionPlanCode', width: 100, hidden: true, editable: true},
        {
            name: 'productionInfo.productionName',
            index: 'productionName',
            width: 100,
            sorttype: "json",
            edittype: "select",
            editable: true,
            editoptions: {value: products}
        },
        {name: 'inStockLot', index: 'inStockLot', width: 100, editable: true},
        {name: 'inStockCount', index: 'inStockCount', width: 100, editable: true},
        {name: 'productionLotCode', index: 'productionLotCode', width: 100, hidden: true, editable: true},
        {name: 'productionPrice', index: 'productionPrice', width: 100, editable: true},
        {
            name: 'inStockDate', index: 'inStockDate', width: 100, editable: true, formatter: 'date',
            formatoptions: {newformat: 'Y-m-d'},
            editoptions: {
                dataInit: function (element) {
                    $(element).datepicker({dateFormat: 'yy-mm-dd', changeMonth: true, changeYear: true})
                }
            }
        },

        {
            name: 'productType',
            index: 'productType',
            width: 100,
            editable: true,
            editoptions: {size: "0", maxlength: "50"}
        },
        {
            name: 'supplierInfo.supplierName',
            index: 'supplierName',
            width: 100,
            edittype: "select",
            editable: true,
            editoptions: {value: suppliers}
        },
        {
            name: 'deptInfo.deptName',
            index: 'deptName',
            width: 100,
            edittype: "select",
            editable: true,
            editoptions: {value: depts}
        },
        {
            name: 'responsorInfo.userName',
            index: 'userName',
            hidden: true,
            width: 100,
            edittype: "select",
            editable: true,
            editoptions: {value: persons}
        },
        {name: 'stockBoxCode', index: 'stockBoxCode', width: 100, editable: true},
        {
            name: 'stockKeeperInfo.userName',
            index: 'userName1',
            width: 100,
            edittype: "select",
            editable: true,
            editoptions: {value: persons}
        },
        {
            name: 'isOneManagement',
            index: 'isOneManagement',
            width: 100,
            editable: true,
            edittype: "select",
            editoptions: {value: "YES:是;NO:否"}
        },
        {
            name: 'oneProductionInStock',
            index: 'oneProductionInStock',
            width: 100,
            fixed: true,
            viewable: false,
            sortable: false,
            resize: false,
            formatter: oneProductionInStock
        },
        {
            name: 'operation',
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
                    recreateForm: true,
                    beforeShowForm: beforeDeleteCallback
                },
                editformbutton: true,
                editOptions: {
                    closeAfterEdit: true,//useful here!!
                    recreateForm: true,
                    beforeShowForm: beforeEditCallback
                }
            }
        }
    ]

    var operateStatus = [true, true, true, true, true, true];
    var gridEditUrl = "editProductionInfo";
    createJQGridTableByGridData(girdDataObj, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, gridEditUrl)
}
var products = findProducts();
var persons = findPersons();
var depts = findDepts();
var suppliers = findSuppliers();
var productionPlans = findProductPlans();
var inStockCodeAndPCode = new Array();
function getProductionInStockForTable_ProductionStockUrl() {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var startDateCondition = startDate.split("/")[0] + "-" + startDate.split("/")[1] + "-" + startDate.split("/")[2];
    var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1] + "-" + endDate.split("/")[2];
    var gridUrl = "queryProductionInStock?" + "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "产品入库情况";
    var colNames = ['序号', '入库编号', '计划名称' , '产品编号', '产品名称', '入库批次', '入库数量', '入库批次', '单价', '入库日期','入库类型', '生产类型', '供应商', '部门', '货架号', '库管员', '是否单件管理', '单件入库', '操作'];

    var productType = []
    var colModels = [
        {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
        {
            name: 'productionInStockCode',
            index: 'productionInStockCode',
            width: 100,
            hidden: true,
            editable: true,
            editrules: {edithidden: false}
        },
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
        {
            name: 'pCode', index: 'productionInfo.productionCode', width: 100, edittype: "text", editable: true,
            formatter: function (cellvalue, options, rowobject) {
                if (32 <= rowobject.productionInfo.productionCode.length)
                    return '内部编号';
                else
                    return rowobject.productionInfo.productionCode;
            }, editoptions: {
            value: products,
            dataEvents: [{
                type: 'focus', fn: function (e) {
                    $("#pCode").attr('readonly', true);
                }
            }]
        }
        },
        {
            name: 'productionInfo.productionCode',
            index: 'productionInfo.productionCode',
            width: 100,
            sorttype: "json",
            edittype: "select",
            editable: true,
            editrules: {required: true},
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
                    if (rowobject.productionInfo.productionCode == temp[0]) {
                        return temp[1];
                    }
                }
            },
            editoptions: {
                value: products
                , dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        var productionCode = this.value;
                        if (32 <= productionCode.length)
                            productionCode = '内部编号';
                        changeShowData("pCode", productionCode, null);
                    }
                }]
            }
        },
        {
            name: 'inStockLot', index: 'inStockLot', width: 100, editable: true, edittype: "text"
            , editoptions: {
            dataEvents: [{
                type: 'focus', fn: function (e) {
                    $("#inStockLot").attr('readonly', true);
                }
            }]
        }
        },
        {
            name: 'inStockCount',
            index: 'inStockCount',
            width: 100,
            editable: true,
            editrules: {required: true, integer: true}
        },
        {name: 'productionLotCode', index: 'productionLotCode', width: 100, hidden: true, editable: true},
        {
            name: 'productionPrice',
            index: 'productionPrice',
            width: 100,
            editable: true,
            editrules: {required: true, number: true}
        },
        {
            name: 'inStockDate',
            index: 'inStockDate',
            width: 100,
            editable: true,
            formatter: 'date',
            edittype: 'text',
            editrules: {required: true},
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
        {name:'inStockType',index:'inStockType',width:100, editable:true,edittype:"select",editrules:{required:true},
            editoptions:{value:"正常入库:正常入库;问题入库:问题入库;归还入库:归还入库"}
        },
        {
            name: 'productType',
            index: 'productType',
            width: 100,
            editable: true,
            edittype: "select",
            editrules: {required: true},
//			formatter : function(cellvalue,opts, rwd) {
//				if('0' == cellvalue)
//					return '供应商';
//				if('1' == cellvalue)
//					return '生产商';
//				if('2' == cellvalue)
//					return '外协商';
//			},
            editoptions: {value: "自产:自产;外购:外购;外协:外协"}
        },
        {
            name: 'supplierInfo.supplierCode',
            index: 'supplierInfo.supplierCode',
            width: 100,
            edittype: "select",
            editable: true,
            editrules: {required: true},
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
                    if (rowobject.supplierInfo.supplierCode == temp[0]) {
                        return temp[1];
                    }
                }

            }
            ,
            editoptions: {value: suppliers}
        },
        {
            name: 'deptInfo.deptCode',
            index: 'deptInfo.deptCode',
            width: 100,
            edittype: "select",
            editable: true,
            editrules: {required: true},
            editoptions: {value: depts},
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
                    if (rowobject.deptInfo.deptCode == temp[0]) {
                        return temp[1];
                    }
                }

            }
        },
//        {
//            name: 'responsorInfo.userCode',
//            index: 'userCode',
//            hidden: false,
//            width: 100,
//            edittype: "select",
//            editable: true,
//            hidden:true,
//            editrules: {edithidden: false},
//            unformat: function (cellvalue, options, rowobject) {
//                var values = new Array();
//                var valuestemp = new Array();
//                values = options.colModel.editoptions.value.split(";");
//                for (var i = 0; i < values.length; i++) {
//                    var temp = values[i].split(":");
//                    if (cellvalue == temp[1]) {
//                        return temp[0];
//                    }
//                }
//            },
//            formatter: function (cellvalue, options, rowobject) {
//                var values = new Array();
//                var valuestemp = new Array();
//                values = options.colModel.editoptions.value.split(";");
//                for (var i = 0; i < values.length; i++) {
//                    var temp = values[i].split(":");
//                    if (rowobject.responsorInfo.userCode == temp[0]) {
//                        return temp[1];
//                    }
//                }
//
//            },
//            editoptions: {value: persons}
//        },
        {name: 'stockBoxCode', index: 'stockBoxCode', width: 100, editable: true, editrules: {required: true}},
        {
            name: 'stockKeeperInfo.userCode',
            index: 'stockKeeperInfo.userCode',
            width: 100,
            edittype: "select",
            editable: true,
            editrules: {required: true},
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
                    if (rowobject.stockKeeperInfo.userCode == temp[0]) {
                        return temp[1];
                    }
                }

            },
            editoptions: {value: persons}
        },
        {
            name: 'isOneManagement',
            index: 'isOneManagement',
            width: 100,
            editable: true,
            edittype: "select",
            editoptions: {value: "否:否;是:是"}
        },
        {
            name: 'oneProductionInStock',
            index: 'oneProductionInStock',
            width: 100,
            fixed: true,
            viewable: false,
            sortable: false,
            resize: false,
            formatter: oneProductionInStock
        },
        {
            name: 'operation',
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
    var gridEditUrl = "/editProductionInStock";

    var jsonReaderObj = {repeatitems: false, id: "productionInStockCode"};
    createJQGridTableByGridUrl(gridUrl, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl, afterSubmitFunc, true, inStock_InitFunc);
}

function inStock_InitFunc(form) {
    var input = form.find('input[name=inStockLot]');
    var inStockLot = "In" + getTime();
    input.val(inStockLot);
}
function executeOneProductionInStock(productionInStockCode, productionCode, productionName, inStockLot) {
    /**
     * 向本地发送一个jsonp请求。
     * */
    $.ajax({
        async: false,
        url: 'http://127.0.0.1:7066/productInStock?code=' + productionInStockCode,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 1000,
        success: function (data) {

        },
        error: function (xhr) {
        },
        /*complete:function(XMLHttpRequest, textStatus){

         }*/
    });
    _iframe('单件产品入库', '/production_instock_oneproduction?productionInStockCode=' + productionInStockCode + '&productionCode=' + productionCode + '&productionName=' + productionName + '&inStockLot=' + inStockLot);
}

function oneProductionInStock(cellvalue, options, rowObject) {
    if (rowObject.isOneManagement == "是") {
        return ' <a class="ctl" id="oneProductionInStock" onclick="executeOneProductionInStock(\'' + rowObject.productionInStockCode + '\',\'' + rowObject.productionInfo.productionCode + '\',\'' + rowObject.productionInfo.productionName + '\',\'' + rowObject.inStockLot + '\')"><i class="icon-edit"></i> 执行</a>';

    }
    return '';

}

function queryProductionInStockWithUrlByTimeRange() {
    var gridTableId = "#grid-table";
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var startDateCondition = startDate.split("/")[0] + "-" + startDate.split("/")[1] + "-" + startDate.split("/")[2];
    var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1] + "-" + endDate.split("/")[2];
    var gridUrl = "queryProductionInStock?" + "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;
    jQuery(gridTableId).jqGrid('setGridParam', {
        datatype: "json",
        url: gridUrl
    }).trigger('reloadGrid');

}

function queryProductionInStockWithDataByTimeRange() {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var startDateCondition = startDate.split("/")[0] + "-" + startDate.split("/")[1] + "-" + startDate.split("/")[2];
    var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1] + "-" + endDate.split("/")[2];

    var condition = "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;
    var gridData = "";
    gridData += "["
    operationFunc(condition, "queryProductionInStock", function (result) {
        var val = $.parseJSON(result);
        for (var i = 0; i < val.rows.length; i++) {
            gridData += "{"
            gridData += '"num":';
            gridData += '"' + val.rows[i].num + '"' + ",";
            gridData += '"productionName":';
            gridData += '"' + val.rows[i].productionInfo.productionName + '"' + ",";
            gridData += '"inStockLot":';
            gridData += '"' + val.rows[i].inStockLot + '"' + ",";
            gridData += '"inStockCount":';
            gridData += '"' + val.rows[i].inStockCount + '"' + ",";
            gridData += '"productionPrice":';
            gridData += '"' + val.rows[i].productionPrice + '"' + ",";
            gridData += '"inStockDate":';
            var date = new Date();
            date.setTime(val.rows[i].inStockDate.time);
            if (date.getFullYear() == '1900') {
                gridData += '"-/-/-"';
            }
            else {
                gridData += '"' + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + '"' + ",";
            }
            gridData += '"productType":';
            gridData += '"' + val.rows[i].productType + '"' + ",";
            gridData += '"supplierName":';
            gridData += '"' + val.rows[i].supplierInfo.supplierName + '"' + ",";
            gridData += '"deptName":';
            gridData += '"' + val.rows[i].deptInfo.deptName + '"' + ",";
            gridData += '"stockBoxCode":';
            gridData += '"' + val.rows[i].stockBoxCode + '"' + ",";
            gridData += '"stockKeeperInfouserName":';
            gridData += '"' + val.rows[i].stockKeeperInfo.userName + '"' + ",";
            gridData += '"isOneManagement":';
            gridData += '"' + val.rows[i].isOneManagement + '"';
            gridData += "}"
            if (i < val.rows.length - 1) {
                gridData += ","
            }
        }
    });
    gridData += "]"
    var girdDataObj = JSON.parse(gridData);

    var gridTableId = "#grid-table";
    jQuery(gridTableId).jqGrid('clearGridData');
    jQuery(gridTableId).jqGrid('setGridParam', {
        data: girdDataObj

    }).trigger('reloadGrid');

}
function upload(obj) {

    if (obj instanceof HTMLTableRowElement)
        obj = obj.attributes.id['value'];//传输的

    parent.zeroModal.show({
        title: '文件上传',
        iframe: true,
        url: '/toUpload?class=oneProductionPicPathForProductionInStockDetail&id=' + obj,
        width: '60%',
        height: '55%',
        ok: true,
        okFn: function () {
            $("#grid-table").trigger("reloadGrid");
        }
    });
}
function fileUpLoad(cellvalue, options, rowObject) {
    var del = '<button class="btn btn-minier btn-purple"  onclick="upload(' + options.rowId + ')"><i class="icon-cloud-upload bigger-120"></i>上传</button> ';
    var url = 'downloadEntry?file=' + cellvalue;
    if (cellvalue != null && cellvalue.length != 0)
        del += '<a href="' + url + '">下载</a>';
    return del;
}
function getOneProductionInStockForTableByCode(productionInStockCode, productionCode, inStockLot) {
    var gridUrl = "queryOneProductionInStock?" + "productionInStockCode=" + productionInStockCode;

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "单件产品入库";
    var colNames = ['序号', '产品入库编号', '单件产品编号', '单件产品图片文件'];

    var colModels = [
        {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
        {
            name: 'productionInStock.productionInStockCode',
            index: 'productionInStock.productionInStockCode',
            width: 100,
            hidden: true,
            editable: false
        },
        {name: 'oneProductionCode', index: 'oneProductionCode', width: 100, editable: true},
        {
            name: 'oneProductionPicPath',
            index: 'oneProductionPicPath',
            width: 100,
            editable: false,
            formatter: fileUpLoad
        }
    ]
    var operateStatus = [true, true, true, false, true, true];
    var gridEditUrl = "editOneProductionInStock?" + "productionInStockCode=" + productionInStockCode + "&productionCode=" + productionCode + "&inStockLot=" + inStockLot;

    var jsonReaderObj = null;
    createJQGridTableByGridUrl(gridUrl, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl, afterSubmitFunc, false, null);
}

function executeViewStorageDetail(productionCode) {
    _iframe('产品库存详情', '/production_stockstorage_detail?productionCode=' + productionCode);
}

function viewStorageDetail(cellvalue, options, rowObject) {
    return ' <a class="ctl" id="viewStorageDetail" onclick="executeViewStorageDetail(\'' + rowObject.productionCode + '\')"><i class="icon-edit"></i> 查看</a>';
}
function getProductionStockStorageForTable(productionCodeParam) {
    //prepare data
    var condition = "";
    if (productionCodeParam != null && productionCodeParam != "") {
        condition = "productionCode=" + productionCodeParam;
    }
    var gridData = "";
    operationFunc(condition, "queryProductionStorage", function (result) {
        var val = $.parseJSON(result);
        var stockCountOfProduction = new Array();
        var orderedCountOfProduction = new Array();
        var accessCountOfProduction = new Array();
        var productionCodeArray = new Array();
        //计算某个产品的全部库存数量,预定库存数量和剩余库存数量
        var index = 0;
        for (var i = 0; i < val.rows.length; i++) {
            var allCount = 0;
            var orderCount = 0;
            var accessCount = 0;
            var productionCode = val.rows[i].productionInfo.productionCode;
            var productionName = val.rows[i].productionInfo.productionName;
            var inStockLot = val.rows[i].inStockLot;
            for (var j = 0; j < val.rows.length; j++) {
                var pc = val.rows[j].productionInfo.productionCode;
                //			var pn = val.rows[j].productionInfo.productionName;
                if (pc == productionCode && judgeNoExist(productionCode + ":" + productionName, productionCodeArray)) {
                    allCount += val.rows[j].stockCount;
                    orderCount += val.rows[j].orderedStockCount;
                    accessCount += val.rows[j].accessStockCount;
                }

            }
            var content = productionCode + ":" + productionName;
            if (judgeNoExist(content, productionCodeArray)) {
                stockCountOfProduction[content] = allCount;
                orderedCountOfProduction[content] = orderCount;
                accessCountOfProduction[content] = accessCount;
                productionCodeArray[index] = content;
                index++
            }

        }

        gridData += "["

        for (var i = 0; i < productionCodeArray.length; i++) {
            gridData += "{";
            gridData += '"num":';
            gridData += '"' + (i + 1) + '"' + ",";
            gridData += '"productionCode":';
            gridData += '"' + (productionCodeArray[i].split(":"))[0] + '"' + ",";
            gridData += '"productionName":';
            gridData += '"' + (productionCodeArray[i].split(":"))[1] + '"' + ",";
            gridData += '"stockCount":';
            gridData += '"' + stockCountOfProduction[productionCodeArray[i]] + '"' + ",";
            gridData += '"orderedStockCount":';
            gridData += '"' + orderedCountOfProduction[productionCodeArray[i]] + '"' + ",";
            gridData += '"accessStockCount":';
            gridData += '"' + accessCountOfProduction[productionCodeArray[i]] + '"' + ",";
            gridData += '"accessStockCount":';
            gridData += '"' + accessCountOfProduction[productionCodeArray[i]] + '"';
            gridData += "}"
            if (i < productionCodeArray.length - 1) {
                gridData += ","
            }
        }
        gridData += "]"
    });

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "产品库存情况";
    var colNames = ['序号', '产品编码', '产品名称', '入库批次', '库存数量', '预定数量', '可用数量', '库管员', '详情'];

    var colModels =
        [
            {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
            {name: 'productionCode', index: 'productionCode', width: 100, hidden: true, editable: true},
            {
                name: 'productionName',
                index: 'productionName',
                width: 100,
                hidden: false,
                editable: true,
                editrules: {edithidden: false}
            },
            {name: 'inStockLot', index: 'inStockLot', width: 100, hidden: true, editable: true},
            {name: 'stockCount', index: 'stockCount', width: 100, hidden: false, editable: true},
            {name: 'orderedStockCount', index: 'orderedStockCount', width: 100, hidden: false, editable: true},
            {name: 'accessStockCount', index: 'accessStockCount', width: 100, hidden: false, editable: true},
            {
                name: 'stockKeeperInfo.userName',
                index: 'stockKeeperInfo.userName',
                width: 100,
                hidden: true,
                editable: true
            },
            {
                name: 'viewStorageDetail',
                index: 'viewStorageDetail',
                width: 200,
                fixed: true,
                viewable: false,
                sortable: false,
                resize: false,
                formatter: viewStorageDetail
            }
        ]
    var operateStatus = [false, false, false, true, true, true];
    var gridEditUrl = "";
    var girdDataObj = JSON.parse(gridData);
    var jsonReaderObj = {repeatitems: false, id: "id"};
    createJQGridTableByGridData(girdDataObj, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl)
}

function refreshProductionStockStorageForTable(productionCodeParam) {
    //prepare data
    var condition = "";
    if (productionCodeParam != null && productionCodeParam != "") {
        condition = "productionCode=" + productionCodeParam;
    }
    var gridData = "";
    operationFunc(condition, "queryProductionStorage", function (result) {
        var val = $.parseJSON(result);
        var stockCountOfProduction = new Array();
        var orderedCountOfProduction = new Array();
        var accessCountOfProduction = new Array();
        var productionCodeArray = new Array();
        //计算某个产品的全部库存数量,预定库存数量和剩余库存数量
        var index = 0;
        for (var i = 0; i < val.rows.length; i++) {
            var allCount = 0;
            var orderCount = 0;
            var accessCount = 0;
            var productionCode = val.rows[i].productionInfo.productionCode;
            var productionName = val.rows[i].productionInfo.productionName;
            var inStockLot = val.rows[i].inStockLot;
            for (var j = 0; j < val.rows.length; j++) {
                var pc = val.rows[j].productionInfo.productionCode;
                //			var pn = val.rows[j].productionInfo.productionName;
                if (pc == productionCode && judgeNoExist(productionCode + ":" + productionName, productionCodeArray)) {
                    allCount += val.rows[j].stockCount;
                    orderCount += val.rows[j].orderedStockCount;
                    accessCount += val.rows[j].accessStockCount;
                }

            }
            var content = productionCode + ":" + productionName;
            if (judgeNoExist(content, productionCodeArray)) {
                stockCountOfProduction[content] = allCount;
                orderedCountOfProduction[content] = orderCount;
                accessCountOfProduction[content] = accessCount;
                productionCodeArray[index] = content;
                index++
            }

        }

        gridData += "["

        for (var i = 0; i < productionCodeArray.length; i++) {
            gridData += "{";
            gridData += '"num":';
            gridData += '"' + (i + 1) + '"' + ",";
            gridData += '"productionCode":';
            gridData += '"' + (productionCodeArray[i].split(":"))[0] + '"' + ",";
            gridData += '"productionName":';
            gridData += '"' + (productionCodeArray[i].split(":"))[1] + '"' + ",";
            gridData += '"stockCount":';
            gridData += '"' + stockCountOfProduction[productionCodeArray[i]] + '"' + ",";
            gridData += '"orderedStockCount":';
            gridData += '"' + orderedCountOfProduction[productionCodeArray[i]] + '"' + ",";
            gridData += '"accessStockCount":';
            gridData += '"' + accessCountOfProduction[productionCodeArray[i]] + '"' + ",";
            gridData += '"accessStockCount":';
            gridData += '"' + accessCountOfProduction[productionCodeArray[i]] + '"';
            gridData += "}"
            if (i < productionCodeArray.length - 1) {
                gridData += ","
            }
        }
        gridData += "]"
    });
    var girdDataObj = JSON.parse(gridData);
    var gridTableId = "#grid-table";
    jQuery(gridTableId).jqGrid('clearGridData');
    jQuery(gridTableId).jqGrid('setGridParam', {
        data: girdDataObj

    }).trigger('reloadGrid');
}
function getProductionStockStorageDetailForTable(productionCode) {
    //prepare data
    var gridData = "";
    var condition = "productionCode=" + productionCode;
    operationFunc(condition, "queryProductionStorage", function (result) {
        gridData += "["
        var val = $.parseJSON(result);
        for (var i = 0; i < val.rows.length; i++) {
            gridData += "{";
            gridData += '"num":';
            gridData += '"' + (i + 1) + '"' + ",";
            gridData += '"productionName":';
            gridData += '"' + val.rows[i].productionInfo.productionName + '"' + ",";
            gridData += '"inStockLot":';
            gridData += '"' + val.rows[i].inStockLot + '"' + ",";
            gridData += '"stockCount":';
            gridData += '"' + val.rows[i].stockCount + '"' + ",";
            gridData += '"orderedStockCount":';
            gridData += '"' + val.rows[i].orderedStockCount + '"' + ",";
            gridData += '"accessStockCount":';
            gridData += '"' + val.rows[i].accessStockCount + '"' + ",";
            gridData += '"productType":';
            gridData += '"' + val.rows[i].productionInStock.productType + '"' + ",";
            gridData += '"supplierName":';
            gridData += '"' + val.rows[i].productionInStock.supplierInfo.supplierName + '"' + ",";
            gridData += '"stockKeeperUserName":';
            gridData += '"' + val.rows[i].stockKeeperInfo.userName + '"' + ",";
            gridData += '"stockBoxCode":';
            gridData += '"' + val.rows[i].productionInStock.stockBoxCode + '"';
            gridData += "}";
            if (i < val.rows.length - 1) {
                gridData += ",";
            }
        }
        gridData += "]";
    });

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "产品库存情况";
    var colNames = ['序号', '产品名称', '入库批次', '库存数量', '预定数量', '可用数量', '生产类型', '供应商', '库管员', '货架号'];

    var colModels =
        [
            {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
            {
                name: 'productionName',
                index: 'productionName',
                width: 100,
                hidden: false,
                editable: true,
                editrules: {edithidden: false}
            },
            {name: 'inStockLot', index: 'inStockLot', width: 100, hidden: false, editable: true},
            {name: 'stockCount', index: 'stockCount', width: 100, hidden: false, editable: true},
            {name: 'orderedStockCount', index: 'orderedStockCount', width: 100, hidden: false, editable: true},
            {name: 'accessStockCount', index: 'accessStockCount', width: 100, hidden: false, editable: true},
            {name: 'productType', index: 'productType', width: 100, hidden: false, editable: true},
            {name: 'supplierName', index: 'supplierName', width: 100, hidden: false, editable: true},
            {name: 'stockKeeperUserName', index: 'stockKeeperUserName', width: 100, hidden: false, editable: true},
            {name: 'stockBoxCode', index: 'stockBoxCode', width: 100, hidden: false, editable: true}
        ]
    var operateStatus = [false, false, false, true, true, true];
    var gridEditUrl = "";
    var girdDataObj = JSON.parse(gridData);
    var jsonReaderObj = {repeatitems: false, id: "id"};
    createJQGridTableByGridData(girdDataObj, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl);
}

function getProductionStockStorageAlarmForTable() {
    //prepare data
    var gridData = "";
    operationFunc("", "queryProductionStorage", function (result) {
        var val = $.parseJSON(result);
        var stockCountOfProduction = new Array();
        var orderedCountOfProduction = new Array();
        var accessCountOfProduction = new Array();
        var productionCodeArray = new Array();
        var productionStorageCountArray = new Array();
        //计算某个产品的全部库存数量,预定库存数量和剩余库存数量
        var index = 0;
        for (var i = 0; i < val.rows.length; i++) {
            var allCount = 0;
            var orderCount = 0;
            var accessCount = 0;
            var productionCode = val.rows[i].productionInfo.productionCode;
            var productionName = val.rows[i].productionInfo.productionName;
            var minStockCount = val.rows[i].productionInfo.minStock;
            var maxStockCount = val.rows[i].productionInfo.maxStock;
            var inStockLot = val.rows[i].inStockLot;
            for (var j = 0; j < val.rows.length; j++) {
                var pc = val.rows[j].productionInfo.productionCode;
                if (pc == productionCode && judgeNoExist(productionCode + ":" + productionName, productionCodeArray)) {
                    allCount += val.rows[j].stockCount;
                    orderCount += val.rows[j].orderedStockCount;
                    accessCount += val.rows[j].accessStockCount;
                }

            }
            var content = productionCode + ":" + productionName;
            if (judgeNoExist(content, productionCodeArray)) {
                stockCountOfProduction[content] = allCount;
                orderedCountOfProduction[content] = orderCount;
                accessCountOfProduction[content] = accessCount;
                productionCodeArray[index] = content;
                productionStorageCountArray[index] = minStockCount + ":" + maxStockCount;
                index++
            }

        }
        gridData = "[";
        var index = 0;
        for (var i = 0; i < productionCodeArray.length; i++) {
            var minStockCount = productionStorageCountArray[i].split(":")[0];
            var maxStockCount = productionStorageCountArray[i].split(":")[1];
            var accessStockCount = accessCountOfProduction[productionCodeArray[i]];

            if (accessStockCount < minStockCount || accessStockCount > maxStockCount) {
                if (index > 0) {
                    gridData += ",";
                }
                index++;
                gridData += "{";
                gridData += '"num":';
                gridData += '"' + (i + 1) + '"' + ",";
                gridData += '"productionName":';
                gridData += '"' + (productionCodeArray[i].split(":"))[1] + '"' + ",";
                if (accessStockCount < minStockCount) {
                    gridData += '"alarmType":';
                    gridData += '"' + "低库存报警" + '"' + ",";
                    gridData += '"currentStockCount":';
                    gridData += '"' + accessCountOfProduction[productionCodeArray[i]] + '"' + ",";
                    gridData += '"stockDiffientCount":';
                    gridData += '"' + (minStockCount - accessCountOfProduction[productionCodeArray[i]]) + '"';
                } else {
                    gridData += '"alarmType":';
                    gridData += '"' + "高库存报警" + '"' + ",";
                    gridData += '"currentStockCount":';
                    gridData += '"' + accessCountOfProduction[productionCodeArray[i]] + '"' + ",";
                    gridData += '"stockDiffientCount":';
                    gridData += '"' + (accessCountOfProduction[productionCodeArray[i]] - maxStockCount) + '"';
                }
                gridData += "}";

            }
        }
        gridData += "]";
    });


    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "产品库存报警情况";
    var colNames = ['序号', '产品编码', '产品名称', '报警类型', '当前库存量', '库存偏差量'];

    var colModels =
        [
            {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
            {name: 'productionCode', index: 'productionCode', width: 100, hidden: true, editable: true},
            {
                name: 'productionName',
                index: 'productionName',
                width: 100,
                hidden: false,
                editable: true,
                editrules: {edithidden: false}
            },
            {name: 'alarmType', index: 'alarmType', width: 100, hidden: false, editable: true},
            {name: 'currentStockCount', index: 'currentStockCount', width: 100, hidden: false, editable: true},
            {name: 'stockDiffientCount', index: 'stockDiffientCount', width: 100, hidden: false, editable: true}
        ]
    var operateStatus = [false, false, false, true, true, true];
    var gridEditUrl = "";
    var girdDataObj = JSON.parse(gridData);
    var jsonReaderObj = {repeatitems: false, id: "id"};
    createJQGridTableByGridData(girdDataObj, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl);
}
function refreshProductionStockStorageAlarmForTable() {
    //prepare data
    var gridData = "";
    operationFunc("", "queryProductionStorage", function (result) {
        var val = $.parseJSON(result);
        var stockCountOfProduction = new Array();
        var orderedCountOfProduction = new Array();
        var accessCountOfProduction = new Array();
        var productionCodeArray = new Array();
        var productionStorageCountArray = new Array();
        //计算某个产品的全部库存数量,预定库存数量和剩余库存数量
        var index = 0;
        for (var i = 0; i < val.rows.length; i++) {
            var allCount = 0;
            var orderCount = 0;
            var accessCount = 0;
            var productionCode = val.rows[i].productionInfo.productionCode;
            var productionName = val.rows[i].productionInfo.productionName;
            var minStockCount = val.rows[i].productionInfo.minStock;
            var maxStockCount = val.rows[i].productionInfo.maxStock;
            var inStockLot = val.rows[i].inStockLot;
            for (var j = 0; j < val.rows.length; j++) {
                var pc = val.rows[j].productionInfo.productionCode;
                if (pc == productionCode && judgeNoExist(productionCode + ":" + productionName, productionCodeArray)) {
                    allCount += val.rows[j].stockCount;
                    orderCount += val.rows[j].orderedStockCount;
                    accessCount += val.rows[j].accessStockCount;
                }

            }
            var content = productionCode + ":" + productionName;
            if (judgeNoExist(content, productionCodeArray)) {
                stockCountOfProduction[content] = allCount;
                orderedCountOfProduction[content] = orderCount;
                accessCountOfProduction[content] = accessCount;
                productionCodeArray[index] = content;
                productionStorageCountArray[index] = minStockCount + ":" + maxStockCount;
                index++
            }

        }
        gridData = "[";
        var index = 0;
        for (var i = 0; i < productionCodeArray.length; i++) {
            var minStockCount = productionStorageCountArray[i].split(":")[0];
            var maxStockCount = productionStorageCountArray[i].split(":")[1];
            var accessStockCount = accessCountOfProduction[productionCodeArray[i]];

            if (accessStockCount < minStockCount || accessStockCount > maxStockCount) {
                if (index > 0) {
                    gridData += ",";
                }
                index++;
                gridData += "{";
                gridData += '"num":';
                gridData += '"' + (i + 1) + '"' + ",";
                gridData += '"productionName":';
                gridData += '"' + (productionCodeArray[i].split(":"))[1] + '"' + ",";
                if (accessStockCount < minStockCount) {
                    gridData += '"alarmType":';
                    gridData += '"' + "低库存报警" + '"' + ",";
                    gridData += '"currentStockCount":';
                    gridData += '"' + accessCountOfProduction[productionCodeArray[i]] + '"' + ",";
                    gridData += '"stockDiffientCount":';
                    gridData += '"' + (minStockCount - accessCountOfProduction[productionCodeArray[i]]) + '"';
                } else {
                    gridData += '"alarmType":';
                    gridData += '"' + "高库存报警" + '"' + ",";
                    gridData += '"currentStockCount":';
                    gridData += '"' + accessCountOfProduction[productionCodeArray[i]] + '"' + ",";
                    gridData += '"stockDiffientCount":';
                    gridData += '"' + (accessCountOfProduction[productionCodeArray[i]] - maxStockCount) + '"';
                }
                gridData += "}";

            }
        }
        gridData += "]";
    });
    var girdDataObj = JSON.parse(gridData);
    var gridTableId = "#grid-table";
    jQuery(gridTableId).jqGrid('clearGridData');
    jQuery(gridTableId).jqGrid('setGridParam', {
        data: girdDataObj

    }).trigger('reloadGrid');
}

///////////////////////////////////

var productionLots = findProductLots();
var allProductLots = findAllProductLots();
var productOutStockApplys = findProductOutStockApplys();
var productUnOutStockApplys = findUnProductOutStockApplys();
var haveProducts = findHaveProducts();
function getProductionOutStockForTable_ProductionStockUrl() {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var startDateCondition = startDate.split("/")[0] + "-" + startDate.split("/")[1] + "-" + startDate.split("/")[2];
    var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1] + "-" + endDate.split("/")[2];
    var gridUrl = "queryProductionOutStock?" + "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "产品出库情况";
    var colNames = ['序号', '出库编号', '申请名称', '项目批次', '产品编号', '产品名称', '编号', '入库批次', '出库批次', '出库数量',
        '出库日期', '出库类型', '部门', '货架号', '库管员','责任人', '是否单件管理', '是否完成发货','是否是标签', '单件出库'];
//                    , '操作'];

    var productType = []
    var colModels = [
        {name: 'num', index: 'num', width: 40, sorttype: "int", editable: false},
        {
            name: 'productionOutStockCode',
            index: 'productionOutStockCode',
            width: 100,
            hidden: true,
            editable: true,
            editrules: {edithidden: false}
        },
        {
            name: 'productionOutStockApplyCode',
            index: 'productionOutStockApplyCode',
            width: 120,
            sorttype: "json",
            edittype: "select",
            editable: true,
            unformat: function (cellvalue, options, rowobject) {
                var values = new Array();
                var valuestemp = new Array();
                values = productOutStockApplys.split(";");
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
                var flag = 1;
                values = productOutStockApplys.split(";");
                for (var i = 0; i < values.length; i++) {
                    var temp = values[i].split(":");
                    if (rowobject.productionOutStockApplyCode == temp[0]) {
                        return temp[1];
                    }
                }
                if (flag == 1) {
                    return "";
                }
            },
            editoptions: {value: productUnOutStockApplys}
        },
        {
            name: 'productionLotCode',
            index: 'productionLotCode',
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
                var flag = 1;
                values = allProductLots.split(";");
                for (var i = 0; i < values.length; i++) {
                    var temp = values[i].split(":");
                    if (rowobject.productionLotCode == temp[0]) {
                        return temp[1];
                    }
                }
                if (flag == 1) {
                    return "";
                }
            },
            editoptions: {value: productionLots}
        },
        {
            name: 'pCode', index: 'productionInfo.productionCode', width: 100, edittype: "text", editable: true,
            formatter: function (cellvalue, options, rowobject) {
                if (32 <= rowobject.productionInfo.productionCode.length)
                    return '内部编号';
                else
                    return rowobject.productionInfo.productionCode;
            }, editoptions: {
            value: products,
            dataEvents: [{
                type: 'focus', fn: function (e) {
                    $("#pCode").attr('readonly', true);
                }
            }]
        }
        },
        {
            name: 'productionInfo.productionCode',
            index: 'productionInfo.productionCode',
            width: 100,
            sorttype: "json",
            edittype: "select",
            editable: true,
            editrules: {required: true},
            unformat: function (cellvalue, options, rowobject) {
                var values = new Array();
                var valuestemp = new Array();
                values = products.split(";");
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
                values = products.split(";");
                for (var i = 0; i < values.length; i++) {
                    var temp = values[i].split(":");
                    if (rowobject.productionInfo.productionCode == temp[0]) {
                        return temp[1];
                    }
                }
            },
            editoptions: {
                value: haveProducts
                , dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        var itemName = this.id;
                        var selNum = itemName.match(/^\d+/);
                        var productCode = this.value;

                        changeSelectData("productionCode=" + productCode, 'queryProductionInStockLotByCode', "inStockLot");

                        changeSelectData("productionCode=" + productCode, 'queryGoodsBoxByProdCode', "stockBoxCode");


                        if (32 <= productCode.length)
                            productCode = '内部编号';
                        changeShowData("pCode", productCode, null);
                    }
                }]
            }
        },
        {name: 'paramCode', index: 'paramCode', width: 100, editable: false, hidden: true},
        {
            name: 'inStockLot', index: 'inStockLot', width: 100, editable: true, edittype: 'custom',
            editrules: {custom: true, custom_func: checkParam},
            editoptions: {
                custom_element: function (value, options) {
                    return getCustomElem(value, options, "productionCode", "paramCode");
                },
                custom_value: getCustomValue,
                url: 'queryProductionInStockLotByCode'
            }
        },
        {
            name: 'outStockLot', index: 'outStockLot', width: 100, editable: true, edittype: "text"
            , editoptions: {
            dataEvents: [{
                type: 'focus', fn: function (e) {
                    $("#outStockLot").attr('readonly', true);
                }
            }]
        }
        },
        {
            name: 'outStockCount',
            index: 'outStockCount',
            width: 100,
            editable: true,
            editrules: {required: true, integer: true}
        },
        {
            name: 'outStockDate',
            index: 'outStockDate',
            width: 100,
            editable: true,
            formatter: 'date',
            edittype: 'text',
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
        {
            name: 'outStockType', index: 'outStockType', width: 100, editable: true, edittype: "select",
            formatter: function (cellvalue, opts, rwd) {
                if ('0' == cellvalue)
                    return '正常';
                if ('1' == cellvalue)
                    return '外借';
                if ('2' == cellvalue)
                    return '问题';
            },
            editoptions: {value: "0:正常;1:外借;2:问题"}
        },
        {
            name: 'deptInfo.deptCode',
            index: 'deptInfo.deptCode',
            width: 100,
            edittype: "select",
            editable: true,
            editoptions: {value: depts},
            editrules: {required: true},
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
                    if (rowobject.deptInfo.deptCode == temp[0]) {
                        return temp[1];
                    }
                }

            }
        },
        {
            name: 'stockBoxCode', index: 'stockBoxCode', width: 100, editable: true, edittype: 'custom',
            editrules: {custom: true, custom_func: checkParam},
            editoptions: {
                custom_element: function (value, options) {
                    return getCustomElem(value, options, "productionCode", "paramCode");
                },
                custom_value: getCustomValue,
                url: 'queryGoodsBoxByProdCode'
            }
        },
        {
            name: 'stockKeeperInfo.userCode',
            index: 'stockKeeperInfo.userCode',
            width: 100,
            edittype: "select",
            editable: true,
            editrules: {required: true},
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
                    if (rowobject.stockKeeperInfo.userCode == temp[0]) {
                        return temp[1];
                    }
                }

            },
            editoptions: {value: persons}
        },
        {
            name: 'responsorInfo.responsorCode',
            index: 'responsorInfo.responsorCode',
            width: 100,
            edittype: "select",
            editable: true,
            editrules: {required: true},
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
                    if (rowobject.responsorInfo.userCode == temp[0]) {
                        return temp[1];
                    }
                }

            },
            editoptions: {value: persons}
        },
        {
            name: 'isOneManagement',
            index: 'isOneManagement',
            width: 100,
            editable: true,
            edittype: "select",
            editoptions: {value: "否:否;是:是"}
        },
        {
            name: 'isFinishDelivery',
            index: 'isFinishDelivery',
            width: 100,
            editable: true,
            edittype: "select",
            editoptions: {value: "否:否;是:是"}
        },{
            name: 'isLable',
            index: 'isLable',
            width: 100,
            fixed: true,
            viewable: false,
            sortable: false,
            resize: false,
            formatter: isLable
        },
        {
            name: 'oneProductionOutStock',
            index: 'oneProductionOutStock',
            width: 100,
            fixed: true,
            viewable: false,
            sortable: false,
            resize: false,
            formatter: oneProductionOutStock
        }
//        ,{
//            name: 'operation',
//            index: '',
//            width: 100,
//            fixed: true,
//            sortable: false,
//            resize: false,
//            viewable: false,
//            formatter: 'actions',
//            formatoptions: {
//                keys: true,
//                delOptions: {
//                    closeAfterDel: true,
//                    recreateForm: true,
//                    beforeShowForm: beforeDeleteCallback,
//                    afterSubmit: afterSubmitFunc
//                },
//                editformbutton: true,
//                editOptions: {
//                    closeAfterEdit: true,//useful here!!
//                    recreateForm: true,
//                    beforeShowForm: beforeEditCallback,
//                    afterSubmit: afterSubmitFunc
//                }
//            }
//        }
    ]
    var operateStatus = [false, false, false, false, true, true];
    var gridEditUrl = "/editProductionOutStock";

    var jsonReaderObj = {repeatitems: false, id: "productionOutStockCode"};
    createJQGridTableByGridUrl(gridUrl, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl, afterSubmitFunc, true, outStock_InitFunc)
}
function outStock_InitFunc(form) {
    var input = form.find('input[name=outStockLot]');
    var outStockLot = "Out" + getTime();
    input.val(outStockLot);
}

function getOneProductionOutStockForTableByCode(productionOutStockCode, productionCode, outStockLot) {
    var gridUrl = "queryOneProductionOutStock?" + "productionOutStockCode=" + productionOutStockCode;

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "单件产品出库";
    var colNames = ['序号', '产品出库编号', '单件产品编号'];

    var colModels = [
        {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
        {
            name: 'productionOutStock.productionOutStockCode',
            index: 'productionOutStock.productionOutStockCode',
            width: 100,
            hidden: true,
            editable: false
        },
        {name: 'oneProductionCode', index: 'oneProductionCode', width: 100, editable: true}
    ]
    var operateStatus = [true, true, true, false, true, true];
    var gridEditUrl = "editOneProductionOutStock?" + "productionOutStockCode=" + productionOutStockCode + "&productionCode=" + productionCode + "&outStockLot=" + outStockLot;

    var jsonReaderObj = null;
    createJQGridTableByGridUrl(gridUrl, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl, afterSubmitFunc, false, null);
}

function executeOneProductionOutStock(num,productionOutStockCode, productionCode, productionName, outStockLot) {
    var isCheck = "check_" +num+ productionCode;
    if ($("#" + isCheck).is(':checked')) {
        showTheMessage("success:请扫描标签","  提示 ");
        oneProductionOutStockDetail(productionOutStockCode, productionCode, productionName, outStockLot);
    } else {
        /**
         * 向本地发送一个jsonp请求。
         * */
        $.ajax({
            async: false,
            url: 'http://127.0.0.1:7066/productOutStock?code=' + productionOutStockCode,
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 1000,
            success: function (data) {

            },
            error: function (xhr) {
            },
            /*complete:function(XMLHttpRequest, textStatus){

             }*/
        });
        oneProductionOutStockDetail(productionOutStockCode,productionCode,productionName,outStockLot);
    }
}

function  oneProductionOutStockDetail(productionOutStockCode,productionCode,productionName,outStockLot){
    _iframe('单件产品出库', '/production_outstock_oneproduction?productionOutStockCode=' + productionOutStockCode + '&productionCode=' + productionCode + '&productionName=' + productionName + '&outStockLot=' + outStockLot);
}

function oneProductionOutStock(cellvalue, options, rowObject) {
    if (rowObject.isOneManagement == "是") {
        return ' <a class="ctl" id="oneProductionOutStock" onclick="executeOneProductionOutStock(\'' + rowObject.num + '\',\'' + rowObject.productionOutStockCode + '\',\'' + rowObject.productionInfo.productionCode + '\',\'' + rowObject.productionInfo.productionName + '\',\'' + rowObject.outStockLot + '\')"><i class="icon-edit"></i> 执行</a>';
    }
    return '';
}

function isLable(cellvalue, options, rowObject) {
    return '<input type="checkbox" name="check_'+rowObject.productionInfo.productionCode+'"   id="check_'+rowObject.num+rowObject.productionInfo.productionCode+'" />';
}


function queryProductionOutStockWithUrlByTimeRange() {
    var gridTableId = "#grid-table";
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var startDateCondition = startDate.split("/")[0] + "-" + startDate.split("/")[1] + "-" + startDate.split("/")[2];
    var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1] + "-" + endDate.split("/")[2];
    var gridUrl = "queryProductionOutStock?" + "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;
    jQuery(gridTableId).jqGrid('setGridParam', {
        datatype: "json",
        url: gridUrl
    }).trigger('reloadGrid');

}

var productionOutStockApplyTable = null;
function getProductionOutStockApply() {
    if (productionOutStockApplyTable != null) {
        productionOutStockApplyTable.fnClearTable();
        productionOutStockApplyTable.fnDestroy();
        productionOutStockApplyTable = null;
    }
    var condition = "isFinish=false";
    operationFunc(condition, "queryProductionOutStockApply", function (result) {
        var treeContent = "";
        var val = $.parseJSON(result);
        treeContent += '<thead><tr>'
        treeContent += '<th>申请单名称</th><th>产品编号</th><th>产品名称</th><th>入库批次</th><th>出库类型</th><th>申请数量</th>' +
            '<th>已有数量</th><th>部门</th><th>是否单件管理</th><th>货架号</th><th>申请日期</th><th>申请人</th><th>操作</th></tr></thead>';
        treeContent += '<tbody>';
        for (var i = 0; i < val.rows.length; i++) {
            var date = new Date();
            var maxNum = val.rows[i].needProductionCount - val.rows[i].haveProductionCount;
            treeContent += '<tr>'
            treeContent += '<td>';
            treeContent += val.rows[i].productionOutStockApplyName;
            treeContent += '</td>';
            treeContent += '<td>';
            if (32 <= val.rows[i].productionInfo.productionCode.length) {
                treeContent += "内部编号";
            } else {
                treeContent += val.rows[i].productionInfo.productionCode;
            }
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].productionInfo.productionName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].inStockLot;
            treeContent += '</td>';
            treeContent += '<td>';
            if ('0' == val.rows[i].outStockType) {
                treeContent += "正常";
            }
            if ('1' == val.rows[i].outStockType) {
                treeContent += "外借";
            }
            if ('2' == val.rows[i].outStockType) {
                treeContent += "问题";
            }
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].needProductionCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].haveProductionCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].deptInfo.deptName;
            treeContent += '</td>';
            treeContent += '<td>';
            if ('true' == val.rows[i].isOneManagement) {
                treeContent += "是";
            }
            if ('false' == val.rows[i].isOneManagement) {
                treeContent += "否";
            }
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].stockBoxCode;
            treeContent += '</td>';
            treeContent += '<td>';
            date.setTime(val.rows[i].applyDate.time);
            if (date.getFullYear() == '1900') {
                treeContent += "---";
            }
            else {
                treeContent += date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
            }
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].applyUserInfo.userName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += ' <a class="ctl" onclick="executeProductionOutStock1(\'' + val.rows[i].productionOutStockApplyCode + '\',\'' + val.rows[i].productionInfo.productionCode + '\',\'' + maxNum + '\')"><i class="icon-edit"></i> 出库</a>';
            treeContent += '</td>';
            treeContent += '</tr>'
        }
        treeContent += '</tbody>';
        document.getElementById("productionApply_table").innerHTML = treeContent;

        document.getElementById("applyCount").innerHTML = val.rows.length + "";
        productionOutStockApplyTable = $('#productionApply_table').dataTable(
            {
                "aoColumns": [
                    null, null, null, null, null, null, null, null, null, null, null, null, null
                ],
                "paging": false
            }
        );
    });
}


function executeProductionOutStock1(productionOutStockApplyCode, productionCode, maxNum) {
	
	var outStockLot = "Out" + getTime();
	var data = 'productionOutStockApplyCode=' + productionOutStockApplyCode + '&outStockLot=' + outStockLot;
	operationFunc(data, "AddProductionOutStock", function (result) {
		var resultObj = $.parseJSON(result);
		var resultStr = resultObj.result;
		var res = afterShow(resultStr, '产品出库');
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
//        open: function () {
//            var input = $('#outStockLot');
//            var outStockLot = "Out" + getTime();
//            input.val(outStockLot);
//            input.attr("readonly", true);
//
//            var outStockCount = $('#outStockCount_tr');
//            outStockCount.show();
//
////    	    var isOneManagement=$('#isOneManagement_tr');
////    	    isOneManagement.hide();
//
////            operationFunc(("productionCode=" + productionCode), "queryGoodsBoxByProdCode", function (result) {
////                $("select#stockBoxCode").empty();
////                var str = "";
////                var val = $.parseJSON(result);
////                str += "<option value=''></option>";
////                $.each(val.result, function (id, item) {
////                    str += "<option value='" + item.code + "'>" + item.name + "</option>";
////                });
////                $("select#stockBoxCode").append(str);
////            });
//
//            var currentUser = $('#currentUser').val();
//            $("#stockKeeperInfo [value=" + currentUser + "]").attr("selected", true);
//
//            var outStockType = $('#outStockType_tr');
//            outStockType.hide();
//
//            var date = new Date();
//            var appdate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
//            $('#outStockDate').val(appdate);
//        },
//        close: function () {
//            $("#FormError").hide();
//            $("#outStockCount").val("");
//            $("#outStockLot").val("");
//            //$("#outStockDate").val("");
//            $("#outStockType").val("");
//            //$("#deptInfo").val("");
////            $("#stockKeeperInfo").val("");
////            $("#stockBoxCode").val("");
//        },
//        buttons: [
//            {
//                text: "出库",
//                "class": "btn btn-primary btn-xs",
//                click: function () {
//                    var data = 'productionOutStockApplyCode=' + productionOutStockApplyCode;
//
//                    if (checkDialog("#FormError", "#outStockCount", "none")
//                        || checkDialog("#FormError", "#outStockCount", "integer")
//                        || checkDialog("#FormError", "#outStockCount", "max", maxNum)
////                        || checkDialog("#FormError", "#outStockDate", "none")
////                        || checkDialog("#FormError", "#outStockType", "none")
////                        || checkDialog("#FormError", "#stockBoxCode", "none")
//                        || checkDialog("#FormError", "#stockKeeperInfo", "none")
//                    ) {
//                        return;
//                    }
//
////                	var outStockCount=$("#partInfo").val();
////                	  data=data + '&partInfo.partCode='+partInfo;
////            		var inStockLot=$("#inStockLot").val();
////            		   data=data + '&inStockLot='+inStockLot;
//                    var outStockLot = $("#outStockLot").val();
//                    data = data + '&outStockLot=' + outStockLot;
//
//                    var outStockCount = $("#outStockCount").val();
//                    data = data + '&outStockCount=' + outStockCount;
////                    var outStockDate = $("#outStockDate").val();
////                    data = data + '&outStockDate=' + outStockDate;
////                    var outStockType = $("#outStockType").val();
////                    data = data + '&outStockType=' + outStockType;
////                    var deptInfo = $("#deptInfo").val();
////                    data = data + '&deptInfo.deptCode=' + deptInfo;
////            		var responsorInfo=$("#responsorInfo").val();
////            			data=data + '&responsorInfo.userCode='+responsorInfo;
//
//                    var stockKeeperInfo = $("#stockKeeperInfo").val();
//                    data = data + '&stockKeeperInfo.userCode=' + stockKeeperInfo;
////                    var stockBoxCode = $("#stockBoxCode").val();
////                    data = data + '&stockBoxCode=' + stockBoxCode;
////                    var isOneManagement = $("#isOneManagement").val();
////                    data = data + '&isOneManagement=' + isOneManagement;
////                    var isFinishDelivery = $("#isFinishDelivery").val();
////                    data = data + '&isFinishDelivery=' + isFinishDelivery;
//
//                    operationFunc(data, "AddProductionOutStock", function (result) {
//                        var resultObj = $.parseJSON(result);
//                        var resultStr = resultObj.result;
//                        var res = afterShow(resultStr, '产品出库');
//                    });
//                }
//            }
//        ]
//    });
}
