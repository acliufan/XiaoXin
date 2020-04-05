var productionCode = "";
var productionName = "";
var partCode="";
var partName="";
var dialog;
var dialog1;
var productions = findProducts();

function choseProductionInfo() {
    var condition = "";
    if (dialog1 == null) {
        operationFunc(condition, "queryProductionInfo", function (result) {
            var treeContent = "";
            var val = $.parseJSON(result);
            treeContent += '<thead><tr>'
            treeContent += '<th>产品名称</th><th>产品编号</th><th>产品类型</th><th>产品规格</th><th>产品描述</th><th>操作</th></tr></thead>';
            treeContent += '<tbody>';

            for (var i = 0; i < val.rows.length; i++) {
                treeContent += '<tr>'
                treeContent += '<td>';
                treeContent += val.rows[i].productionName;
                treeContent += '</td>';
                treeContent += '<td>';
                if (32 <= val.rows[i].productionCode.length) {
                    treeContent += "内部编号";
                } else {
                    treeContent += val.rows[i].productionCode;
                }
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += val.rows[i].productionType;
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += val.rows[i].productionSpec;
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += val.rows[i].productionDesc;
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += ' <a class="ctl" onclick="chose(\'' + val.rows[i].productionName + '\',\'' + val.rows[i].productionCode + '\',\'' + val.rows[i].productionSpec + '\')"><i class="icon-edit"></i> 选择</a>';
                treeContent += '</td>';
                treeContent += '</tr>'
            }
            treeContent += '</tbody>';
            document.getElementById("productionChoose_table1").innerHTML = treeContent;

            productionChooseTable = $('#productionChoose_table1').dataTable(
                {
                    "aoColumns": [
                        null, null, null, null, null, null
                    ],
                    "paging": false
                }
            );
        });
    }
    var title = "";
    $.widget("ui.dialog1", $.extend({}, $.ui.dialog.prototype, {
        _title: function (title) {
            var $title = this.options.title || '&nbsp;'
            if (("title_html" in this.options)
                && this.options.title_html == true)
                title.html($title);
            else
                title.text($title);
        }
    }));
    dialog = $("#message_dialog2").removeClass('hide').dialog({
        modal: true,
        width: "600px",
        heigth: "200px",
        title: "",
        title_html: true

    });
}

function chose(productionName1, productionCode1,productionSpec1) {
    $("#message_dialog2").dialog("close");
    productionCode = productionCode1;
    productionName = productionName1;
    productionSpec = productionSpec1;
    $("#QRName").val(productionName);
    $("#QRCode").val(productionCode);
    $("#QRType").val(productionSpec);

    changeShowData("pCode", productionCode, null);
}

function chose1(partName1,partCode1,partSpec1){
    $( "#message_dialog1" ).dialog( "close" );
    partCode=partCode1;
    partName=partName1;
    partSpec=partSpec1;

    $("#QRName").val(partName);
    $("#QRCode").val(partCode);
    $("#QRType").val(partSpec);

    changeShowData("pCode",partCode,null);
}

function  chosePartInfo(){
    flag=2;
    var condition = "";
    if(dialog==null) {
        operationFunc(condition, "queryPartInfo", function (result) {
            var treeContent = "";
            var val = $.parseJSON(result);
            treeContent += '<thead><tr>'
            treeContent += '<th>部件名称</th><th>部件编号</th><th>部件类型</th><th>部件规格</th><th>部件描述</th><th>操作</th></tr></thead>';
            treeContent += '<tbody>';

            for (var i = 0; i < val.rows.length; i++) {
                treeContent += '<tr>'
                treeContent += '<td>';
                treeContent += val.rows[i].partName;
                treeContent += '</td>';
                treeContent += '<td>';
                if (32 <= val.rows[i].partCode.length) {
                    treeContent += "内部编号";
                } else {
                    treeContent += val.rows[i].partCode;
                }
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += val.rows[i].partType;
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += val.rows[i].partSpec;
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += val.rows[i].partDesc;
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += ' <a class="ctl" onclick="chose1(\'' + val.rows[i].partName + '\',\'' + val.rows[i].partCode + '\',\'' + val.rows[i].partSpec + '\')"><i class="icon-edit"></i> 选择</a>';
                treeContent += '</td>';
                treeContent += '</tr>'
            }
            treeContent += '</tbody>';
            document.getElementById("partApply_table1").innerHTML = treeContent;

            partOutStockApplyTable = $('#partApply_table1').dataTable(
                {
                    "aoColumns": [
                        null, null, null,null,null,null
                    ],
                    "paging": false
                }
            );
        });
    }
    var title="";
    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
        _title : function(title) {
            var $title = this.options.title || '&nbsp;'
            if (("title_html" in this.options)
                && this.options.title_html == true)
                title.html($title);
            else
                title.text($title);
        }
    }));
    dialog = $( "#message_dialog1" ).removeClass('hide').dialog({
        modal: true,
        width:"600px",
        heigth:"200px",
        title:"",
        title_html: true
        /*buttons: [
         {
         text: "确定",
         "class" : "btn btn-primary btn-xs",
         click: function() {
         $( this ).dialog( "close" );
         }
         }
         ]*/
    });



}
