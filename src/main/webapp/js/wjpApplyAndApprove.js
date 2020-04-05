/**
 * 根据人员密级关联查询设备密级下拉选项
 * @param personSecretLevel 人员密级
 * @param deviceSecretLevelId 设备密级下拉框id
 */
function getDeviceLevelOptionByUserLevel(personSecretLevel,deviceSecretLevelId){
    $("#"+deviceSecretLevelId).empty();

    operationFunc("", "findDeviceInfoByPersonSecretLevel?personSecretLevel="+personSecretLevel, function (result) {
        var val = $.parseJSON(result);
        var obj = document.getElementById(deviceSecretLevelId);
        obj.options.add(new Option("", ""));
        $.each(val, function (id, item) {
            obj.options.add(new Option(item, item));
        });
    });
}

/**
 * 根据申请类型查询设备类别（二级分类下拉选项）
 * @param applyType 申请类型
 * @param applySecondTypeId 设备类别下拉框id
 */
function getApplySecondTypeOptionByApplyType(applyType,applySecondTypeId){
    var data="firstTypeCode="+applyType;
    $("#"+applySecondTypeId).empty();
    operationFunc(data,"/getSecondeType",function(result){
        var result = $.parseJSON(result);
        var resultStr=result.resultStr;
        $.each(resultStr,function(key,val){
            $("#"+applySecondTypeId).append("<option value='"+resultStr[key].code+"'>"+resultStr[key].name+"</option>");
        });
    });
}

/**
 * 借用周期选项切换
 */
function changeApplyCycle() {
    var value = $("#applyCycle").val();
    if (value == '长期') {
        document.getElementById("applyCycleText").hidden = true;
        $("#applyCycleText").val("");
    } else if (value == '其他') {
        document.getElementById("applyCycleText").hidden = false;
        $("#applyCycleText").val("");
        document.getElementById("applyCycleText").placeholder = "请输入";
    }
}

/**
 * 审批状态选项查询
 * @param selectId 审批状态下拉框id
 */
function initApplyStatusOptions(selectId){
    $("#"+selectId).empty();
    operationFunc("selStr=APPLY_STATUS", "findPublicCONSENUM", function (result) {
        var val = $.parseJSON(result);
        var obj = document.getElementById(selectId);
        obj.options.add(new Option("", ""));
        $.each(val, function (id, item) {
            obj.options.add(new Option(item.value, item.code));
        });
    });
}

//=====================================================================================================申请流程 增删改查公共方法=====================================

/**
 * 新增申请流程
 * @param type 流程类型
 * @param newTab 跳转新的tab页名称
 * @param oldTab 关闭旧的tab页名称
 */
function addApplyInfo(type,newTab,oldTab){
    parent.showNewTab(newTab, "addApplyInfo?type="+type);
    closeTabByName(oldTab);
}

/**
 * 撤销申请流程
 * @param applyId 申请id
 * @param funName 回调方法名称
 */
function revokeApplyInfo(applyId,funName){
    var url="revokeApplyInfo?applyId="+applyId;
    operationFunc("", url, function(result){
        var resultObj = $.parseJSON(result);
        var resultStr = resultObj.msg;
        showMsgByName(resultStr,funName);
    });
}

/**
 * 查看申请流程
 * @param applyId 申请id
 * @param newTab 跳转新的tab页名称
 * @param oldTab 关闭旧的tab页名称
 */
function lookApplyInfo(applyId,newTab,oldTab){
    parent.showNewTab(newTab, "lookApplyDetail?applyId="+applyId);
    closeTabByName(oldTab);
}

/**
 * 修改申请流程
 * @param applyId 申请id
 * @param type 流程类型
 * @param newTab 跳转新的tab页名称
 * @param oldTab 关闭旧的tab页名称
 */
function updateApplyInfo(applyId,type,newTab,oldTab){
    parent.showNewTab(newTab, "addApplyInfo?applyId="+applyId+"&type="+type);
    closeTabByName(oldTab);
}

/**
 * 删除申请流程
 * @param applyId 申请id
 * @param funName 回调方法名称
 */
function deleteApplyInfo(applyId,funName){
    var url="deleteApplyInfo?applyId="+applyId;
    operationFunc("", url, function(result){
        showMsgByName(result,funName);
    });
}

var dialog;
/**
 * 删除申请流程
 * @param applyId 申请id
 * @param tableId 页面显示数据的表格id
 * @param dialogId 弹出框的id
 */
function lookDisagreeInfo(applyId,tableId,dialogId){
    var url="lookDisagreeInfo";
    var condition = "applyId="+applyId;
    operationFunc(condition, url, function (result) {
        var treeContent = "";
        var val = $.parseJSON(result);
        treeContent += '<thead><tr>'
        treeContent += '<th style="width: 20px;">序号</th><th style="width: 50px;">审批时间</th><th style="width: 50px;">审批节点</th><th style="width: 60px;">审批人</th><th style="width: 150px;">审批意见</th></tr></thead>';
        treeContent += '<tbody>';

        for (var i = 0; i < val.rows.length; i++) {
            treeContent += '<tr>'
            treeContent += '<td>';
            treeContent +=  val.rows[i].num;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].approveDate;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].approveNode;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].approveUser;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].approveRemark;
            treeContent += '</td>';
            treeContent += '</tr>'
        }
        treeContent += '</tbody>';
        document.getElementById(tableId).innerHTML = treeContent;
//            if (dialog != null) {
//                $('#approve_table').dataTable().fnClearTable();
//                $('#approve_table').dataTable().fnDestroy();
//            }
        $('#'+tableId).dataTable(
            {
                aoColumns: [
                    null, null, null, null, null
                ],
                bRetrieve: true,
                paging: false
            }
        );
        //$('#approve_table').removeAttr("style");
    });

    var title = "";
    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
        _title: function (title) {
            var $title = this.options.title || '&nbsp;'
            if (("title_html" in this.options)
                && this.options.title_html == true)
                title.html($title);
            else
                title.text($title);
        }
    }));
    dialog = $('#'+dialogId).removeClass('hide').dialog({
        modal: true,
        width: "800px",
        heigth: "200px",
        title: "",
        title_html: true
    });
}