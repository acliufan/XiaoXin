var parts = findParts();
var persons = findPersons();
var depts = findDepts();
var suppliers = findSuppliers();
var partPlans = findProductPlans();

function getPartInStockForTable_PartStockUrl() {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var startDateCondition = startDate.split("/")[0] + "-" + startDate.split("/")[1] + "-" + startDate.split("/")[2];
    var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1] + "-" + endDate.split("/")[2];
    var gridUrl = "queryPartInStock?" + "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "部件入库情况";
    var colNames = ['序号', '入库编号', '部件编号', '部件名称', '入库批次', '入库数量', '单价', '入库日期', '入库类型','生产类型', '供应商', '部门', '货架号', '库管员', '是否单件管理', '单件入库', '操作'];

    var productType = []
    var colModels = [
        {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
        {
            name: 'partInStockCode',
            index: 'partInStockCode',
            width: 100,
            hidden: true,
            editable: true,
            editrules: {edithidden: false}
        },
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
        {
            name: 'partInfo.partCode',
            index: 'partInfo.partCode',
            width: 100,
            sorttype: "json",
            edittype: "select",
            editable: true,
            editrules:{required:true},
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
                    if (rowobject.partInfo.partCode == temp[0]) {
                        return temp[1];
                    }
                }

            },
            editoptions: {value: parts
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
        {name:'inStockLot',index:'inStockLot',width:100, editable:true,edittype:"text"
			,editoptions:{
				dataEvents:[{
					type:'focus',fn:function(e){
						$("#inStockLot").attr('readonly',true);
					}
				}]}
		},
        {name: 'inStockCount', index: 'inStockCount', width: 100, editable: true, editrules:{required:true,integer:true}},
        {name: 'partPrice', index: 'partPrice', width: 100, editable: true, editrules:{required:true,number:true}},
        {
            name: 'inStockDate',
            index: 'inStockDate',
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
        {name:'inStockType',index:'inStockType',width:100, editable:true,edittype:"select",editrules:{required:true},
            editoptions:{value:"正常入库:正常入库;问题入库:问题入库;归还入库:归还入库"}
        },
        {name:'productType',index:'productType',width:100, editable:true,edittype:"select",editrules:{required:true},
//			formatter : function(cellvalue,opts, rwd) {
//				if('0' == cellvalue)
//					return '供应商';
//				if('1' == cellvalue)
//					return '生产商';
//				if('2' == cellvalue)
//					return '外协商';
//			},
			editoptions:{value:"自产:自产;外购:外购;外协:外协"}
		},
        {
            name: 'supplierInfo.supplierCode', index: 'supplierInfo.supplierCode', width: 100, edittype: "select", editable: true,editrules:{required:true},
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
            , editoptions: {value: suppliers}
        },
        {
            name: 'deptInfo.deptCode',
            index: 'deptInfo.deptCode',
            width: 100,
            edittype: "select",
            editable: true,
            editoptions: {value: depts},
            editrules:{required:true},
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
//            hidden: true,
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
        {name: 'stockBoxCode', index: 'stockBoxCode', width: 100, editable: true,editrules:{required:true}},
        {
            name: 'stockKeeperInfo.userCode', index: 'stockKeeperInfo.userCode', width: 100, edittype: "select", editable: true, editrules:{required:true},
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

            }, editoptions: {value: persons}
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
            name: 'onePartInStock',
            index: 'onePartInStock',
            width: 100,
            fixed: true,
            viewable: false,
            sortable: false,
            resize: false,
            formatter: onePartInStock
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
    var gridEditUrl = "/editPartInStock";

    var jsonReaderObj = {repeatitems: false, id: "partInStockCode"};
    createJQGridTableByGridUrl(gridUrl, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl, afterSubmitFunc,true,inStock_InitFunc);
}
function inStock_InitFunc(form)
{
    var input = form.find('input[name=inStockLot]');
    var inStockLot = "In"+getTime();
    input.val(inStockLot);
}

function executeOnePartInStock(partInStockCode, partCode, partName, inStockLot) {
	/**
	 * 向本地发送一个jsonp请求。
	 * */ 
	$.ajax({
		async:false,
		url:'http://127.0.0.1:7066/partInStock?code='+partInStockCode,
		type:'GET',
		dataType:'jsonp',
		jsonp:'jsoncallback', 
		timeout:1000,
		success:function(data){
			
		},
		error:function(xhr){
		},
		/*complete:function(XMLHttpRequest, textStatus){
			
		}*/
	});
	
    _iframe('单件部件入库', '/part_instock_onepart?partInStockCode=' + partInStockCode + '&partCode=' + partCode + '&partName=' + partName + '&inStockLot=' + inStockLot);
}

function onePartInStock(cellvalue, options, rowObject) {
    if (rowObject.isOneManagement == "是") {
        return ' <a class="ctl" id="onePartInStock" onclick="executeOnePartInStock(\'' + rowObject.partInStockCode + '\',\'' + rowObject.partInfo.partCode + '\',\'' + rowObject.partInfo.partName + '\',\'' + rowObject.inStockLot + '\')"><i class="icon-edit"></i> 执行</a>';

    }
    return '';

}

function queryPartInStockWithUrlByTimeRange() {
    var gridTableId = "#grid-table";
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var startDateCondition = startDate.split("/")[0] + "-" + startDate.split("/")[1] + "-" + startDate.split("/")[2];
    var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1] + "-" + endDate.split("/")[2];
    var gridUrl = "queryPartInStock?" + "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;
    jQuery(gridTableId).jqGrid('setGridParam', {
        datatype: "json",
        url: gridUrl
    }).trigger('reloadGrid');

}

function upload(obj) {

    if (obj instanceof HTMLTableRowElement)
        obj = obj.attributes.id['value'];//传输的

    parent.zeroModal.show({
        title: '文件上传',
        iframe: true,
        url: '/toUpload?class=onePartPicPathForPartInStockDetail&id=' + obj,
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
function getOnePartInStockForTableByCode(partInStockCode, partCode, inStockLot) {
    var gridUrl = "queryOnePartInStock?" + "partInStockCode=" + partInStockCode;

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "单件部件入库";
    var colNames = ['序号', '部件入库编号', '单件部件编号', '单件部件图片文件'];

    var colModels = [
        {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
        {
            name: 'partInStock.partInStockCode',
            index: 'partInStock.partInStockCode',
            width: 100,
            hidden: true,
            editable: false
        },
        {name: 'onePartCode', index: 'onePartCode', width: 100, editable: true},
        {name: 'onePartPicPath', index: 'onePartPicPath', width: 100, editable: false, formatter: fileUpLoad}
    ]
    var operateStatus = [true, true, true, false, true, true];
    var gridEditUrl = "editOnePartInStock?" + "partInStockCode=" + partInStockCode + "&partCode=" + partCode + "&inStockLot=" + inStockLot;

    var jsonReaderObj = null;
    createJQGridTableByGridUrl(gridUrl, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl, afterSubmitFunc,false,null);
}

function executeViewStorageDetail(partCode) {
    _iframe('部件库存详情', '/part_stockstorage_detail?partCode=' + partCode);
}

function viewStorageDetail(cellvalue, options, rowObject) {
    return ' <a class="ctl" id="viewStorageDetail" onclick="executeViewStorageDetail(\'' + rowObject.partCode + '\')"><i class="icon-edit"></i> 查看</a>';
}
function getPartStockStorageForTable() {
    //prepare data
    var gridData = "";
    operationFunc("", "queryPartStorage", function (result) {
        var val = $.parseJSON(result);
        var stockCountOfPart = new Array();
        var orderedCountOfPart = new Array();
        var accessCountOfPart = new Array();
        var partCodeArray = new Array();
        //计算某个部件的全部库存数量,预定库存数量和剩余库存数量
        var index = 0;
        for (var i = 0; i < val.rows.length; i++) {
            var allCount = 0;
            var orderCount = 0;
            var accessCount = 0;
            var partCode = val.rows[i].partInfo.partCode;
            var partName = val.rows[i].partInfo.partName;
            var inStockLot = val.rows[i].inStockLot;
            for (var j = 0; j < val.rows.length; j++) {
                var pc = val.rows[j].partInfo.partCode;
                //			var pn = val.rows[j].partInfo.partName;
                if (pc == partCode && judgeNoExist(partCode + ":" + partName, partCodeArray)) {
                    allCount += val.rows[j].stockCount;
                    orderCount += val.rows[j].orderedStockCount;
                    accessCount += val.rows[j].accessStockCount;
                }

            }
            var content = partCode + ":" + partName;
            if (judgeNoExist(content, partCodeArray)) {
                stockCountOfPart[content] = allCount;
                orderedCountOfPart[content] = orderCount;
                accessCountOfPart[content] = accessCount;
                partCodeArray[index] = content;
                index++
            }

        }

        gridData += "["

        for (var i = 0; i < partCodeArray.length; i++) {
            gridData += "{";
            gridData += '"num":';
            gridData += '"' + (i + 1) + '"' + ",";
            gridData += '"partCode":';
            gridData += '"' + (partCodeArray[i].split(":"))[0] + '"' + ",";
            gridData += '"partName":';
            gridData += '"' + (partCodeArray[i].split(":"))[1] + '"' + ",";
            gridData += '"stockCount":';
            gridData += '"' + stockCountOfPart[partCodeArray[i]] + '"' + ",";
            gridData += '"orderedStockCount":';
            gridData += '"' + orderedCountOfPart[partCodeArray[i]] + '"' + ",";
            gridData += '"accessStockCount":';
            gridData += '"' + accessCountOfPart[partCodeArray[i]] + '"' + ",";
            gridData += '"accessStockCount":';
            gridData += '"' + accessCountOfPart[partCodeArray[i]] + '"';
            gridData += "}"
            if (i < partCodeArray.length - 1) {
                gridData += ","
            }
        }
        gridData += "]"
    });

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "部件库存情况";
    var colNames = ['序号', '部件编码', '部件名称', '入库批次', '库存数量', '预定数量', '可用数量', '库管员', '详情'];

    var colModels =
        [
            {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
            {name: 'partCode', index: 'partCode', width: 100, hidden: true, editable: true},
            {
                name: 'partName',
                index: 'partName',
                width: 100,
                hidden: false,
                editable: true,
                editrules: {edithidden: false}
            },
            {name: 'inStockLot', index: 'inStockLot', width: 100, hidden: true, editable: true},
            {name: 'stockCount', index: 'stockCount', width: 100, hidden: false, editable: true},
            {name: 'orderedStockCount', index: 'orderedStockCount', width: 100, hidden: false, editable: true},
            {name: 'accessStockCount', index: 'accessStockCount', width: 100, hidden: false, editable: true},
            {name: 'stockKeeperInfo.userName', index: 'userName', width: 100, hidden: true, editable: true},
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

function refreshPartStockStorageForTable(partCodeParam) {
    //prepare data
    var condition="";
    if(partCodeParam != null && partCodeParam !="")
    {
        condition = "partCode="+partCodeParam;
    }
    var gridData = "";
    operationFunc(condition, "queryPartStorage", function (result) {
        var val = $.parseJSON(result);
        var stockCountOfPart = new Array();
        var orderedCountOfPart = new Array();
        var accessCountOfPart = new Array();
        var partCodeArray = new Array();
        //计算某个部件的全部库存数量,预定库存数量和剩余库存数量
        var index = 0;
        for (var i = 0; i < val.rows.length; i++) {
            var allCount = 0;
            var orderCount = 0;
            var accessCount = 0;
            var partCode = val.rows[i].partInfo.partCode;
            var partName = val.rows[i].partInfo.partName;
            var inStockLot = val.rows[i].inStockLot;
            for (var j = 0; j < val.rows.length; j++) {
                var pc = val.rows[j].partInfo.partCode;
                //			var pn = val.rows[j].partInfo.partName;
                if (pc == partCode && judgeNoExist(partCode + ":" + partName, partCodeArray)) {
                    allCount += val.rows[j].stockCount;
                    orderCount += val.rows[j].orderedStockCount;
                    accessCount += val.rows[j].accessStockCount;
                }

            }
            var content = partCode + ":" + partName;
            if (judgeNoExist(content, partCodeArray)) {
                stockCountOfPart[content] = allCount;
                orderedCountOfPart[content] = orderCount;
                accessCountOfPart[content] = accessCount;
                partCodeArray[index] = content;
                index++
            }

        }

        gridData += "["

        for (var i = 0; i < partCodeArray.length; i++) {
            gridData += "{";
            gridData += '"num":';
            gridData += '"' + (i + 1) + '"' + ",";
            gridData += '"partCode":';
            gridData += '"' + (partCodeArray[i].split(":"))[0] + '"' + ",";
            gridData += '"partName":';
            gridData += '"' + (partCodeArray[i].split(":"))[1] + '"' + ",";
            gridData += '"stockCount":';
            gridData += '"' + stockCountOfPart[partCodeArray[i]] + '"' + ",";
            gridData += '"orderedStockCount":';
            gridData += '"' + orderedCountOfPart[partCodeArray[i]] + '"' + ",";
            gridData += '"accessStockCount":';
            gridData += '"' + accessCountOfPart[partCodeArray[i]] + '"' + ",";
            gridData += '"accessStockCount":';
            gridData += '"' + accessCountOfPart[partCodeArray[i]] + '"';
            gridData += "}"
            if (i < partCodeArray.length - 1) {
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
function getPartStockStorageDetailForTable(partCode) {
    //prepare data
    var gridData = "";
    var condition = "partCode=" + partCode;
    operationFunc(condition, "queryPartStorage", function (result) {
        gridData += "["
        var val = $.parseJSON(result);
        for (var i = 0; i < val.rows.length; i++) {
            gridData += "{";
            gridData += '"num":';
            gridData += '"' + (i + 1) + '"' + ",";
            gridData += '"partName":';
            gridData += '"' + val.rows[i].partInfo.partName + '"' + ",";
            gridData += '"inStockLot":';
            gridData += '"' + val.rows[i].inStockLot + '"' + ",";
            gridData += '"stockCount":';
            gridData += '"' + val.rows[i].stockCount + '"' + ",";
            gridData += '"orderedStockCount":';
            gridData += '"' + val.rows[i].orderedStockCount + '"' + ",";
            gridData += '"accessStockCount":';
            gridData += '"' + val.rows[i].accessStockCount + '"' + ",";
            gridData += '"productType":';
            gridData += '"' + val.rows[i].partInStock.productType + '"' + ",";
            gridData += '"supplierName":';
            gridData += '"' + val.rows[i].partInStock.supplierInfo.supplierName + '"' + ",";
            gridData += '"stockKeeperUserName":';
            gridData += '"' + val.rows[i].stockKeeperInfo.userName + '"' + ",";
            gridData += '"stockBoxCode":';
            gridData += '"' + val.rows[i].partInStock.stockBoxCode + '"';
            gridData += "}";
            if (i < val.rows.length - 1) {
                gridData += ",";
            }
        }
        gridData += "]";
    });

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "部件库存情况";
    var colNames = ['序号', '部件名称', '入库批次', '库存数量', '预定数量', '可用数量', '生产类型', '供应商', '库管员', '货架号'];

    var colModels =
        [
            {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
            {
                name: 'partName',
                index: 'partName',
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

function getPartStockStorageAlarmForTable() {
    var gridData = "";
    //prepare data
    operationFunc("", "queryPartStorage", function (result) {
        var val = $.parseJSON(result);
        var stockCountOfPart = new Array();
        var orderedCountOfPart = new Array();
        var accessCountOfPart = new Array();
        var partCodeArray = new Array();
        var partStorageCountArray = new Array();
        //计算某个产品的全部库存数量,预定库存数量和剩余库存数量
        var index = 0;
        for (var i = 0; i < val.rows.length; i++) {
            var allCount = 0;
            var orderCount = 0;
            var accessCount = 0;
            var partCode = val.rows[i].partInfo.partCode;
            var partName = val.rows[i].partInfo.partName;
            var minStockCount = val.rows[i].partInfo.minStock;
            var maxStockCount = val.rows[i].partInfo.maxStock;
            var inStockLot = val.rows[i].inStockLot;
            for (var j = 0; j < val.rows.length; j++) {
                var pc = val.rows[j].partInfo.partCode;
                if (pc == partCode && judgeNoExist(partCode + ":" + partName, partCodeArray)) {
                    allCount += val.rows[j].stockCount;
                    orderCount += val.rows[j].orderedStockCount;
                    accessCount += val.rows[j].accessStockCount;
                }

            }
            var content = partCode + ":" + partName;
            if (judgeNoExist(content, partCodeArray)) {
                stockCountOfPart[content] = allCount;
                orderedCountOfPart[content] = orderCount;
                accessCountOfPart[content] = accessCount;
                partCodeArray[index] = content;
                partStorageCountArray[index] = minStockCount + ":" + maxStockCount;
                index++
            }

        }

        gridData = "[";
        var index = 0;
        for (var i = 0; i < partCodeArray.length; i++) {
            var minStockCount = partStorageCountArray[i].split(":")[0];
            var maxStockCount = partStorageCountArray[i].split(":")[1];
            var accessStockCount = accessCountOfPart[partCodeArray[i]];

            if (accessStockCount < minStockCount || accessStockCount > maxStockCount) {
                if (index > 0) {
                    gridData += ",";
                }
                index++;
                gridData += "{";
                gridData += '"num":';
                gridData += '"' + (i + 1) + '"' + ",";
                gridData += '"partName":';
                gridData += '"' + (partCodeArray[i].split(":"))[1] + '"' + ",";
                if (accessStockCount < minStockCount) {
                    gridData += '"alarmType":';
                    gridData += '"' + "低库存报警" + '"' + ",";
                    gridData += '"currentStockCount":';
                    gridData += '"' + accessCountOfPart[partCodeArray[i]] + '"' + ",";
                    gridData += '"stockDiffientCount":';
                    gridData += '"' + (minStockCount - accessCountOfPart[partCodeArray[i]]) + '"';
                } else {
                    gridData += '"alarmType":';
                    gridData += '"' + "高库存报警" + '"' + ",";
                    gridData += '"currentStockCount":';
                    gridData += '"' + accessCountOfPart[partCodeArray[i]] + '"' + ",";
                    gridData += '"stockDiffientCount":';
                    gridData += '"' + (accessCountOfPart[partCodeArray[i]] - maxStockCount) + '"';
                }
                gridData += "}";

            }
        }
        gridData += "]";

    });


    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "部件库存报警情况";
    var colNames = ['序号', '部件编码', '部件名称', '报警类型', '当前库存量', '库存偏差量'];

    var colModels =
        [
            {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
            {name: 'partCode', index: 'partCode', width: 100, hidden: true, editable: true},
            {
                name: 'partName',
                index: 'partName',
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

function refreshPartStockStorageAlarmForTable() {
    var gridData = "";
    //prepare data
    operationFunc("", "queryPartStorage", function (result) {
        var val = $.parseJSON(result);
        var stockCountOfPart = new Array();
        var orderedCountOfPart = new Array();
        var accessCountOfPart = new Array();
        var partCodeArray = new Array();
        var partStorageCountArray = new Array();
        //计算某个产品的全部库存数量,预定库存数量和剩余库存数量
        var index = 0;
        for (var i = 0; i < val.rows.length; i++) {
            var allCount = 0;
            var orderCount = 0;
            var accessCount = 0;
            var partCode = val.rows[i].partInfo.partCode;
            var partName = val.rows[i].partInfo.partName;
            var minStockCount = val.rows[i].partInfo.minStock;
            var maxStockCount = val.rows[i].partInfo.maxStock;
            var inStockLot = val.rows[i].inStockLot;
            for (var j = 0; j < val.rows.length; j++) {
                var pc = val.rows[j].partInfo.partCode;
                if (pc == partCode && judgeNoExist(partCode + ":" + partName, partCodeArray)) {
                    allCount += val.rows[j].stockCount;
                    orderCount += val.rows[j].orderedStockCount;
                    accessCount += val.rows[j].accessStockCount;
                }

            }
            var content = partCode + ":" + partName;
            if (judgeNoExist(content, partCodeArray)) {
                stockCountOfPart[content] = allCount;
                orderedCountOfPart[content] = orderCount;
                accessCountOfPart[content] = accessCount;
                partCodeArray[index] = content;
                partStorageCountArray[index] = minStockCount + ":" + maxStockCount;
                index++
            }

        }

        gridData = "[";
        var index = 0;
        for (var i = 0; i < partCodeArray.length; i++) {
            var minStockCount = partStorageCountArray[i].split(":")[0];
            var maxStockCount = partStorageCountArray[i].split(":")[1];
            var accessStockCount = accessCountOfPart[partCodeArray[i]];

            if (accessStockCount < minStockCount || accessStockCount > maxStockCount) {
                if (index > 0) {
                    gridData += ",";
                }
                index++;
                gridData += "{";
                gridData += '"num":';
                gridData += '"' + (i + 1) + '"' + ",";
                gridData += '"partName":';
                gridData += '"' + (partCodeArray[i].split(":"))[1] + '"' + ",";
                if (accessStockCount < minStockCount) {
                    gridData += '"alarmType":';
                    gridData += '"' + "低库存报警" + '"' + ",";
                    gridData += '"currentStockCount":';
                    gridData += '"' + accessCountOfPart[partCodeArray[i]] + '"' + ",";
                    gridData += '"stockDiffientCount":';
                    gridData += '"' + (minStockCount - accessCountOfPart[partCodeArray[i]]) + '"';
                } else {
                    gridData += '"alarmType":';
                    gridData += '"' + "高库存报警" + '"' + ",";
                    gridData += '"currentStockCount":';
                    gridData += '"' + accessCountOfPart[partCodeArray[i]] + '"' + ",";
                    gridData += '"stockDiffientCount":';
                    gridData += '"' + (accessCountOfPart[partCodeArray[i]] - maxStockCount) + '"';
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

///////////////////////////////////////////////////////

var productionPlans = findProductPlans();
var allProductionPlans = findAllProductPlans();
var partOutStockApplys = findPartOutStockApplys();
var partUnFinishOutStockApplys= findUnFinishPartOutStockApplys();
var haveParts = findHaveParts();
function getPartOutStockForTable_PartStockUrl() {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var startDateCondition = startDate.split("/")[0] + "-" + startDate.split("/")[1] + "-" + startDate.split("/")[2];
    var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1] + "-" + endDate.split("/")[2];
    var gridUrl = "queryPartOutStock?" + "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "部件出库情况";
    var colNames = ['序号', '出库编号', '申请名称', '产品生产计划','部件编号', '部件名称','编号', '入库批次', '出库批次', '出库数量',
                    '出库日期', '出库类型', '部门', '货架号', '库管员', '责任人', '是否单件管理','是否是标签', '单件出库'];
                    //, '操作'];

    var productType = []
    var colModels = [
        {name: 'num', index: 'num', width: 40, sorttype: "int", editable: false},
        {
            name: 'partOutStockCode',
            index: 'partOutStockCode',
            width: 100,
            hidden: true,
            editable: true,
            editrules: {edithidden: false}
        },
        {
            name: 'partOutStockApplyCode',
            index: 'partOutStockApplyCode',
            width: 120,
            sorttype: "json",
            edittype: "select",
            editable: true,
            unformat: function (cellvalue, options, rowobject) {
                var values = new Array();
                var valuestemp = new Array();
                values = partOutStockApplys.split(";");
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
                var flag=1;
                values = partOutStockApplys.split(";");
                for (var i = 0; i < values.length; i++) {
                    var temp = values[i].split(":");
                    if (rowobject.partOutStockApplyCode == temp[0]) {
                        return temp[1];
                    }
                }
                
                
                if(flag==1){
                	return "";
                }

            },
            editoptions: {value: partUnFinishOutStockApplys}
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
                var valuestemp = new Array()
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
                var flag=1;
                values = allProductionPlans.split(";");
                for (var i = 0; i < values.length; i++) {
                    var temp = values[i].split(":");
                    if (rowobject.productionPlanCode == temp[0]) {
                        return temp[1];
                    }
                }
                
                if(flag==1){
                	return "";
                }

            },
            editoptions: {value: productionPlans}
        },
        {name:'pCode', index:'partInfo.partCode',width:100, edittype:"text", editable:true,
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
        {
            name: 'partInfo.partCode',
            index: 'partInfo.partCode',
            width: 100,
            sorttype: "json",
            edittype: "select",
            editable: true,
            editrules:{required:true},
            unformat: function (cellvalue, options, rowobject) {
                var values = new Array();
                var valuestemp = new Array();
                values = parts.split(";");
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
                values = parts.split(";");
                for (var i = 0; i < values.length; i++) {
                    var temp = values[i].split(":");
                    if (rowobject.partInfo.partCode == temp[0]) {
                        return temp[1];
                    }
                }

            },
            editoptions: {value: haveParts
            	,dataEvents:[{
					type:'change',
					fn:function(e){
						var itemName=this.id;
						var selNum=itemName.match(/^\d+/);
						var partCode=this.value;
						
						changeSelectData("partCode="+partCode, 'queryPartInStockLotByCode', "inStockLot");
                        
                        changeSelectData("partCode="+partCode, 'queryGoodsBoxByPartCode', "stockBoxCode");
                        
						
						if(32 <= partCode.length)
							partCode = '内部编号';
						changeShowData("pCode",partCode,null);
					}}]	
            }},
        {name:'paramCode', index:'paramCode',width:100,editable:false,hidden:true},
        {name:'inStockLot', index: 'inStockLot', width: 100, editable: true,
        	edittype:'custom',
			editrules:{custom:true,custom_func:checkParam},
			editoptions:{
				custom_element: function(value,options){
                	return getCustomElem(value,options,"partCode","paramCode");
                },
				custom_value:getCustomValue,
				url:'queryPartInStockLotByCode'}},
        {name: 'outStockLot', index: 'outStockLot', width: 100, editable: true
			,editoptions:{
				dataEvents:[{
					type:'focus',fn:function(e){
						$("#outStockLot").attr('readonly',true);
					}
				}]}
        },
        {name: 'outStockCount', index: 'outStockCount', width: 100, editable: true,editrules:{required:true,integer:true}},
        {
            name: 'outStockDate',
            index: 'outStockDate',
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
        {name:'outStockType',index:'outStockType',width:100, editable:true,edittype:"select",
			formatter : function(cellvalue,opts, rwd) {
				if('0' == cellvalue)
					return '正常';
				if('1' == cellvalue)
					return '外借';
				if('2' == cellvalue)
					return '问题';
			},
			editoptions:{value:"0:正常;1:外借;2:问题"}},
        {
            name: 'deptInfo.deptCode',
            index: 'deptInfo.deptCode',
            width: 100,
            edittype: "select",
            editable: true,
            editrules:{required:true},
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
        {
            name: 'stockBoxCode', index: 'stockBoxCode', width: 100, editable: true, edittype: 'custom',
            editrules: {custom: true, custom_func: checkParam},
            editoptions: {
            	custom_element: function(value,options){
            		return getCustomElem(value,options,"partCode","paramCode");
                },
            	custom_value: getCustomValue,
                url: 'queryGoodsBoxByPartCode'
            }
        },
        {
            name: 'stockKeeperInfo.userCode', index: 'stockKeeperInfo.userCode', width: 100, edittype: "select", editable: true,
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

            }, editoptions: {value: persons}
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
            name: 'onePartOutStock',
            index: 'onePartOutStock',
            width: 100,
            fixed: true,
            viewable: false,
            sortable: false,
            resize: false,
            formatter: onePartOutStock
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
    var gridEditUrl = "/editPartOutStock";

    var jsonReaderObj = {repeatitems: false, id: "partOutStockCode"};
    createJQGridTableByGridUrl(gridUrl, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl, afterSubmitFunc,true,outStock_InitFunc);
}
function outStock_InitFunc(form)
{
    var input = form.find('input[name=outStockLot]');
    var outStockLot = "Out"+getTime();
    input.val(outStockLot);
}
function getOnePartOutStockForTableByCode(partOutStockCode, partCode, outStockLot) {
    var gridUrl = "queryOnePartOutStock?" + "partOutStockCode=" + partOutStockCode;

    var gridTableId = "#grid-table";
    var girdPaperId = "#grid-pager";

    var gridCaption = "单件部件出库";
    var colNames = ['序号', '部件出库编号', '单件部件编号'];

    var colModels = [
        {name: 'num', index: 'num', width: 30, sorttype: "int", editable: false},
        {
            name: 'partOutStock.partOutStockCode',
            index: 'partOutStock.partOutStockCode',
            width: 100,
            hidden: true,
            editable: false
        },
        {name: 'onePartCode', index: 'onePartCode', width: 100, editable: true}
    ]
    var operateStatus = [true, true, true, false, true, true];
    var gridEditUrl = "editOnePartOutStock?" + "partOutStockCode=" + partOutStockCode + "&partCode=" + partCode + "&outStockLot=" + outStockLot;

    var jsonReaderObj = null;
    createJQGridTableByGridUrl(gridUrl, gridTableId, girdPaperId, gridCaption, colNames, colModels, operateStatus, jsonReaderObj, gridEditUrl, afterSubmitFunc,false,null);
}

function executeOnePartOutStock(num,partOutStockCode, partCode, partName, outStockLot) {
	var  isCheck="check_"+num+partCode;
    if($("#"+isCheck).is(':checked')){
        showTheMessage("success:请扫描标签","  提示 ");
        onePartOutStockDetail(partOutStockCode, partCode, partName, outStockLot);
    }else {
        //非标签
        $.ajax({
            async: false,
            url: 'http://127.0.0.1:7066/partOutStock?code=' + partOutStockCode,
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
        onePartOutStockDetail(partOutStockCode,partCode,partName,outStockLot);
    }
}

function  onePartOutStockDetail(partOutStockCode,partCode,partName,outStockLot){
        _iframe('单件部件出库', '/part_outstock_onepart?partOutStockCode=' + partOutStockCode + '&partCode=' + partCode + '&partName=' + partName + '&outStockLot=' + outStockLot);
}

function onePartOutStock(cellvalue, options, rowObject) {

    if (rowObject.isOneManagement == "是") {
        return ' <a class="ctl" id="onePartOutStock" onclick="executeOnePartOutStock(\'' + rowObject.num + '\',\'' + rowObject.partOutStockCode + '\',\'' + rowObject.partInfo.partCode + '\',\'' + rowObject.partInfo.partName + '\',\'' + rowObject.outStockLot + '\')"><i class="icon-edit"></i> 执行</a>';
    }
    return '';
}

function isLable(cellvalue, options, rowObject) {
    return '<input type="checkbox" name="check_'+rowObject.partInfo.partCode+'"   id="check_'+rowObject.num+rowObject.partInfo.partCode+'" />';
}


function queryPartOutStockWithUrlByTimeRange() {
    var gridTableId = "#grid-table";
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var startDateCondition = startDate.split("/")[0] + "-" + startDate.split("/")[1] + "-" + startDate.split("/")[2];
    var endDateCondition = endDate.split("/")[0] + "-" + endDate.split("/")[1] + "-" + endDate.split("/")[2];
    var gridUrl = "queryPartOutStock?" + "dateConditionStart=" + startDateCondition + "&dateConditionEnd=" + endDateCondition;
    jQuery(gridTableId).jqGrid('setGridParam', {
        datatype: "json",
        url: gridUrl
    }).trigger('reloadGrid');

}


var partOutStockApplyTable = null;
function getPartOutStockApply() {
    if (partOutStockApplyTable != null) {
        partOutStockApplyTable.fnClearTable();
        partOutStockApplyTable.fnDestroy();
        partOutStockApplyTable = null;
    }
    var condition = "isFinish=false";
    operationFunc(condition, "queryPartOutStockApply", function (result) {
        var treeContent = "";
        var val = $.parseJSON(result);
        treeContent += '<thead><tr>'
        treeContent += '<th>申请单名称</th><th>部件编号</th><th>部件名称</th><th>入库批次</th><th>出库类型</th><th>申请数量</th>'+
        				'<th>已有数量</th><th>部门</th><th>是否单件管理</th><th>货架号</th><th>申请日期</th><th>申请人</th><th>操作</th></tr></thead>';
        treeContent += '<tbody>';

        for (var i = 0; i < val.rows.length; i++) {
            var date = new Date();
            var maxNum= val.rows[i].needPartCount - val.rows[i].havePartCount;
            treeContent += '<tr>'
            treeContent += '<td>';
            treeContent += val.rows[i].partOutStockApplyName;
            treeContent += '</td>';
            treeContent += '<td>';
            if(32 <= val.rows[i].partInfo.partCode.length){
            	treeContent += "内部编号";
            }else{
            	treeContent += val.rows[i].partInfo.partCode;
            }
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].partInfo.partName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].inStockLot;
            treeContent += '</td>';
            treeContent += '<td>';
            if( '0' == val.rows[i].outStockType){
            	treeContent += "正常";
            }
            if('1' == val.rows[i].outStockType){
            	treeContent += "外借";
            }
            if('2' == val.rows[i].outStockType){
            	treeContent += "问题";
            }
            treeContent += '</td>'
            treeContent += '<td>';
            treeContent += val.rows[i].needPartCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].havePartCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].deptInfo.deptName;
            treeContent += '</td>';
            treeContent += '<td>';
            if('true' == val.rows[i].isOneManagement){
            	treeContent += "是";
            }
            if('false' == val.rows[i].isOneManagement){
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
            treeContent += ' <a class="ctl" onclick="executePartOutStock1(\'' + val.rows[i].partOutStockApplyCode 
            + '\',\'' + val.rows[i].partInfo.partCode + '\',\'' + val.rows[i].inStockLot + '\',\''+ maxNum 
            + '\')"><i class="icon-edit"></i> 出库</a>';
            treeContent += '</td>';
            treeContent += '</tr>'
        }
        treeContent += '</tbody>';
        document.getElementById("partApply_table").innerHTML = treeContent;

        document.getElementById("applyCount").innerHTML = val.rows.length + "";
        partOutStockApplyTable = $('#partApply_table').dataTable(
        		{
		            "aoColumns": [
		                          null, null, null, null, null, null, null,null,null,null,null,null,null
					],
//		            "bPaginate": false,
//		            "bFilter": false,
//		            "bLengthChange": false,
		            "paging": false
		        }
        );
    });
}

function executePartOutStock1(partOutStockApplyCode,partCode,inStockLot,maxNum) {
	//_iframe('部件入库', '/partInStockSelect?partInStockApplyCode=' + partInStockApplyCode);
	var outStockLot = "Out" + getTime();
	var data = 'partOutStockApplyCode=' + partOutStockApplyCode + '&outStockLot=' + outStockLot;
	operationFunc(data,"AddPartOutStock",function(result){
		var resultObj = $.parseJSON(result);
		var resultStr = resultObj.result;
		var res=afterShow(resultStr,'部件出库');
	});

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
//         	 var input = $('#outStockLot');
//     	     var outStockLot = "Out"+getTime();
//     	     input.val(outStockLot);
//     	     input.attr("readonly",true);
//     	     
//     	     var outStockCount=$('#outStockCount_tr');
//    	     outStockCount.show();
//
////    	     var isOneManagement=$('#isOneManagement_tr');
////     	     isOneManagement.hide();
//     	    
////     	    operationFunc(("partCode="+partCode+"&inStockLot="+inStockLot), "queryGoodsBoxByPartCode", function(result) {
//// 				$("select#stockBoxCode").empty();
//// 				var str="";
//// 				var val = $.parseJSON(result);
//// 				str+="<option value=''></option>";
//// 				$.each(val.result,function(id,item){
//// 					str+="<option value='"+item.code+"'>"+item.name+"</option>";
//// 				});
//// 				$("select#stockBoxCode").append(str);
//// 			});
//     	    
//     	    var currentUser=$('#currentUser').val();
//     	    $("#stockKeeperInfo [value="+currentUser+"]").attr("selected",true);
//     	    
//     	    var outStockType=$('#outStockType_tr');
//     	    outStockType.hide();
//    	     
//     	     var date = new Date();
//     	     var appdate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
//     	     $('#outStockDate').val(appdate);
//       },
//        close:function(){
//	    	$("#FormError").hide();
//	    	$("#outStockCount").val("");
//	    	$("#outStockLot").val("");
////			$("#outStockDate").val("");
//			$("#outStockType").val("");
////			$("#deptInfo").val("");
////			$("#stockKeeperInfo").val("");
////			$("#stockBoxCode").val("");
//	    },
//        buttons: [
//            {
//                text: "出库",
//                "class": "btn btn-primary btn-xs",
//                click: function () {
//                	var data='partOutStockApplyCode='+partOutStockApplyCode;
//                	
//                	if(checkDialog("#FormError","#outStockCount","none") 
//            				|| checkDialog("#FormError","#outStockCount","integer")
//            				|| checkDialog("#FormError","#outStockCount","max", maxNum)
////            				|| checkDialog("#FormError","#outStockDate","none")
////            				|| checkDialog("#FormError","#outStockType","none")
////            				|| checkDialog("#FormError","#stockBoxCode","none")
//            				|| checkDialog("#FormError","#stockKeeperInfo","none")
//            			){
//            				return;
//            			}
////                	var outStockCount=$("#partInfo").val();
////                	  data=data + '&partInfo.partCode='+partInfo;
////            		var inStockLot=$("#inStockLot").val();
////            		   data=data + '&inStockLot='+inStockLot;
//            		var outStockCount=$("#outStockCount").val();
//            		   data=data + '&outStockCount='+outStockCount;
//            		var outStockLot=$("#outStockLot").val();
//            		   data=data + '&outStockLot='+outStockLot;
//
////            		var outStockDate=$("#outStockDate").val();
////            			data=data + '&outStockDate='+outStockDate;
////            		var outStockType=$("#outStockType").val();
////            			data=data + '&outStockType='+outStockType;
////            		var deptInfo=$("#deptInfo").val();
////            			data=data + '&deptInfo.deptCode='+deptInfo;
////            		var responsorInfo=$("#responsorInfo").val();
////            			data=data + '&responsorInfo.userCode='+responsorInfo;
//
//            		var stockKeeperInfo=$("#stockKeeperInfo").val();
//            		data=data + '&stockKeeperInfo.userCode='+stockKeeperInfo;
////            		var stockBoxCode=$("#stockBoxCode").val();
////            		data=data + '&stockBoxCode='+stockBoxCode;
////            		var isOneManagement=$("#isOneManagement").val();
////            		data=data + '&isOneManagement='+isOneManagement;
//
//            		operationFunc(data,"AddPartOutStock",function(result){
//            			var resultObj = $.parseJSON(result);
//        				var resultStr = resultObj.result;
//        				var res=afterShow(resultStr,'部件出库');
//            		});
//                }
//            }
//        ]
//    });
}
