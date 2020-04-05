/**
 * Created by 706 on 2017/4/13.
 */
function zbDetail(ZBDM) {
    var treeContent = "";
    $("#productionstoragedetail_dialog").modal('toggle');
    var condition = "ZBDM=" + ZBDM;
    operationFunc(condition, "zbDetail", function (result) {
        var val = $.parseJSON(result);
        treeContent += '<thead><tr>'
        treeContent += '<th>装备代码</th><th>装备分类名称</th><th>装备分类代码</th><th>装备名称</th><th>装备简称</th><th>装备型号</th><th>装备代号</th><th>生产厂家</th><th>联系人</th><th>是否有效</th><th>更新日期</th><th>版本号</th><th>旧装备代码</th><th>备注</th>';
        treeContent += '</tr></thead>'
        treeContent += '<tbody>';
        //for (var i = 0; i < val.rows.length; i++) {
        //  var date = new Date();
        treeContent += '<tr>'
        treeContent += '<td>';
        treeContent += val.ZBDM;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.ZBFLMC;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.ZBFLDM;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.ZBMC;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.ZBJC;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.ZBXH;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.ZBDH;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.SCCJ;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.LXR;
        treeContent += '</td>';
        treeContent += '<td>';
        if(val.SFYX.toString()=="true"){
            treeContent += "是";
        }
        else
            treeContent += "否";
        //treeContent += val.SFYX;
        treeContent += '</td>';
        treeContent += '<td>';
       if (val.myGXRQ == null || val.myGXRQ == "" || (val.myGXRQ.split("-"))[0] == '1900') {
            treeContent += "---";
        }
        else {
            var v = (val.myGXRQ.split(" "))[0];
            treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
        }

      //  treeContent += val.GXRQ;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.BBH;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.JZBDM;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.BZ;
        treeContent += '</td>';
        treeContent += '</tr>';
        //}
        treeContent += '</tbody>';
        document.getElementById("productionstoragedetail_table").innerHTML = treeContent;
    });
}