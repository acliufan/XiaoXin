/**
 * Created by 706 on 2017/4/13.
 */

function filterClick(){


        var dialog = $("#Filter_dialog").removeClass('hide').dialog({
            modal: true,
            width: 400,
            title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-search'></i> 筛选条件</h4></div>",
            title_html: true,
            success: "",
            buttons: [
                {
                    text: "查看",
                    "class": "btn btn-primary btn-xs",
                    click: function () {
                        searchFresh();
                        $(this).dialog("close");
                    }
                }
            ]
        });


}

function checkAndConfig(id){
    if(id instanceof HTMLTableRowElement)
        id=id.attributes.id['value'];//传输的
    gysDetail(id)
    //alert(id);
}

function gysDetail(GYSDM) {
    var treeContent = "";
    $("#gysdetail_dialog").modal('toggle');
    var condition = "GYSDM=" + GYSDM;
    operationFunc(condition, "gysDetail", function (result) {
        var val = $.parseJSON(result);
        treeContent += '<thead><tr>'
        treeContent += '<th>供应商代码</th><th>供应商名称</th><th>供应商地址</th><th>邮政编号</th><th>联系人</th><th>联系电话</th><th>开户银行</th><th>开户名称</th><th>银行帐号</th><th>是否有效</th><th>更新日期</th><th>版本号</th><th>备注</th>';
        treeContent += '</tr></thead>'
        treeContent += '<tbody>';
        //for (var i = 0; i < val.rows.length; i++) {
        //  var date = new Date();
        treeContent += '<tr>'
        treeContent += '<td>';
        treeContent += val.GYSDM;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.GYSMC;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.GYSDZ;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.YZBM;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.LXR;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.LXDH;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.KHYH;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.KHM;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.YHZH;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.SFYX;
        treeContent += '</td>';
        treeContent += '<td>';
        //if (val.GXRQ == null || val.GXRQ == "" || (val.GXRQ.split("-"))[0] == '1900') {
        //    treeContent += "---";
        //}
        //else {
        //    var v = (val.GXRQ.split(" "))[0];
        //    treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
        //}
        treeContent += val.GXRQ;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.BBH;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.BZ;
        treeContent += '</td>';
        treeContent += '</tr>';
        //}
        treeContent += '</tbody>';
        document.getElementById("gysdetail_table").innerHTML = treeContent;
    });
}