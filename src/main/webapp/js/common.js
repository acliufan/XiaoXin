function operationFunc(condition, operatePath, callbackFunc) {
    $.ajax({
        async: false,
        type: 'post',
        url: operatePath,
        data: condition,
        error: function (result) {
            callbackFunc(result);
        },
        success: function (result) {
            callbackFunc(result);
        }
    });
}
/*
 * 获取本周一
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getThisMonday() {
    var date = new Date();
    var nowDayofWeek = date.getDay();
    var mondayTime = date.getTime() - (nowDayofWeek - 1) * 24 * 3600 * 1000;
    var mondayDate = new Date(mondayTime);
    var year = mondayDate.getFullYear();
    var month = mondayDate.getMonth() + 1;
    var day = mondayDate.getDate();

    return year + "-" + month + "-" + day;
}
/*
 * 获取本周日
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getThisSunday() {
    var date = new Date();
    var nowDayofWeek = date.getDay();
    var sundayTime = date.getTime() + (7 - nowDayofWeek) * 24 * 3600 * 1000;
    var sundayDate = new Date(sundayTime);
    var year = sundayDate.getFullYear();
    var month = sundayDate.getMonth() + 1;
    var day = sundayDate.getDate();
    return year + "-" + month + "-" + day;
}
/*
 * 获取本月1号
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getThisMonthStart() {
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1;
    return year + "-" + month + "-" + "1";
}
/*
 * 获取本月31号
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getThisMonthEnd() {
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1;
    return year + "-" + month + "-" + "31";
}
/*
 * 获取本季度1号
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getThisQuaterStart() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 4) // 1,2,3
    {
        return year + "-1-1";
    } else if (month > 3 && month < 7)//4,5,6
    {
        return year + "-4-1";
    } else if (month > 6 && month < 10)//7,8,9
    {
        return year + "-7-1";
    } else//10,11,12
    {
        return year + "-10-1";
    }
}
/*
 * 获取本季度31号
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getThisQuaterEnd() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 4) // 1,2,3
    {
        return year + "-3-31";
    } else if (month > 3 && month < 7)//4,5,6
    {
        return year + "-6-30";
    } else if (month > 6 && month < 10)//7,8,9
    {
        return year + "-9-30";
    } else//10,11,12
    {
        return year + "-12-31";
    }
}
/*
 * 获取本年1号
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getThisYearStart() {
    var date = new Date();
    var year = date.getFullYear()
    return year + "-1-1";
}
/*
 * 获取本年31号
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getThisYearEnd() {
    var date = new Date();
    var year = date.getFullYear()
    return year + "-12-31";
}


/*
 * 根据不同的用户角色加载左侧树形窗
 * @author minsheng.bai
 * @time 2016-10-27
 */

/*
 * 根据不同的用户角色加载左侧树形窗
 * @author minsheng.bai
 * @time 2016-10-27
 */
//
// function loadTreeItem(userType) {
//     operationFunc("", "getTreeItem", function (result) {
//         var treeContent = "";
//         var val = $.parseJSON(result);
//         var thirdsubTree_flag = 0;
//
//         if (val.result.treeName == "首页") {
//             treeContent += '</li>';
//             var url = getUrl('' + val.result.treeName + '');
//             treeContent += ' <a id="' + val.result.treeName + '" class="" data-addtab="' + val.result.treeName + '" data-url=""> ';
//
//             // treeContent += '<a onclick="changePage(' + "'" + val.result.treeName + "'" + ')">';
//             treeContent += '<i class=""><img src="images/' + val.result.treeIcon + '.png"' + ' alt=""></i>';
//             treeContent += '<span class="menu-text"> ' + val.result.treeName+'&nbsp&nbsp&nbsp&nbsp' + ' </span>';
//             treeContent += '</a>';
//             treeContent += '</li>';
//             document.getElementById("treeitem").innerHTML = treeContent;
//             return;
//         }
//
//
//         for (var i = 0; i < val.result.treeName.length; i++) {
//             treeContent += '<li>';
//             if (val.result.treeName[i] == "密钥登记") {
//                 var url = getUrl('' + val.result.treeName[i] + '');
//                 treeContent += ' <a  id="sy"  class="" data-addtab="' + val.result.treeName[i] + '" data-url="' + url + '"> ';
//
//                 //treeContent += '<a onclick="changePage(' + "'" + val.result.treeName + "'" + ')">';
//                 treeContent += '<i class=""><img src="images/' + val.result.treeIcon[i] + '.png"' + ' alt=""></i>';
//
//                 treeContent += '<span class="menu-text"> ' + val.result.treeName[i]+'&nbsp&nbsp&nbsp&nbsp' + ' </span>';
//                 treeContent += '</a>';
//             }
//             else if (val.result.subTreeName[i] == "") {
//                 var url = getUrl('' + val.result.treeName[i] + '');
//                 treeContent += ' <a id="' + val.result.treeName[i] + '" class="" data-addtab="' + val.result.treeName[i] + '" data-url="' + url + '"> ';
//
//                 /*   treeContent += '<a onclick="changePage(' + "'" + val.result.treeName[i] + "'" + ')">';*/
//                 treeContent += '<i class=""><img src="images/' + val.result.treeIcon[i] + '.png"' + ' alt=""></i>';
//                 treeContent += '<span class="menu-text"> ' + val.result.treeName[i]+'&nbsp&nbsp&nbsp&nbsp' + ' </span>';
//
//                 treeContent += '</a>';
//             }
//             else {
//                 var subTreeNameVal = val.result.subTreeName[i];
//                 //var subTreeIconVal = val.result.subTreeIcon[i];
//                 var url = getUrl('' + val.result.treeName[i] + '');
//                 treeContent += ' <a class="dropdown-toggle" id="' + val.result.treeName[i] + '" data-addtab="' + val.result.treeName[i] + '" data-url="' + url + '"> ';
//                 // treeContent += '<a onclick="changePage(' + "'" + val.result.treeName[i] + "'" + ')" class="dropdown-toggle">';
//                 treeContent += '<i class=""><img src="images/' + val.result.treeIcon[i] + '.png" ' + ' alt=""></i>';
//                 treeContent += '<span class="menu-text"> ' + val.result.treeName[i]+'&nbsp&nbsp&nbsp&nbsp' + ' </span>';
//                 treeContent += '<b class="arrow icon-angle-down"></b>'
//                 treeContent += '</a>';
//                 treeContent += '<ul class="submenu">';
//
//                 //由于设置单个节点的时候，subTreeNameVal.subTreeItemName不是一个数组，所以导致后面的关于数组的操作有问题
//                 //所以在这里统一转一下，不是数组也给他转成数组obj
//                 var obj = new Array();
//                 if(!(subTreeNameVal.subTreeItemName instanceof Array))
//                 {
//                     obj.push(subTreeNameVal.subTreeItemName);
//                 }else{
//                     obj = subTreeNameVal.subTreeItemName;
//                 }
//                 for (var j = 0; j < obj.length; j++) {
//                     treeContent += '<li id="subtreeitem' + j + '">';
//                     var url = getUrl('' + obj[j] + '');
//
//                     if (url != "") {
//                         treeContent += ' <a id="' + obj[j] + '" class="" data-addtab="' + obj[j] + '" data-url="' + url + '"> ';
//                     } else {
//                         treeContent += ' <a id="' + obj[j] + '" class="dropdown-toggle" data-addtab="' + obj[j] + '" data-url="' + url + '"> ';
//                     }
//                     //treeContent += '<a onclick="changePage(' + "'" + subTreeNameVal.subTreeItemName[j] +  "'" + ')" class="dropdown-toggle">';
//                     //treeContent += '<a onclick="alert(' + "'123" + subTreeNameVal.subTreeItemName[j] +  "'" + ')" class="dropdown-toggle">';
//                     //treeContent += '<a onclick="changePage(' + "'" + ZBQCZbDirectoryAction +  "'" + ')" class="dropdown-toggle">';
//
//                     treeContent += '<img src="images/' + subTreeNameVal.subTreeIcon[j] + '.png"' + ' alt="" width="14" heigth="14"/> &nbsp ';
//
//                     treeContent += obj[j]+'&nbsp&nbsp&nbsp';
//                     treeContent += '</a>';
//                     treeContent += '<ul class="submenu">';
//
//                     if (val.result.thirdsubTreeName[thirdsubTree_flag] == "") {
//                         treeContent += '<li>';
//                         var url = getUrl('' + val.result.thirdsubTreeName[thirdsubTree_flag] + '');
//                         treeContent += ' <a class="" data-addtab="' + val.result.thirdsubTreeName[thirdsubTree_flag] + '" data-url="' + url + '"> ';
//                         // treeContent += '<a onclick="changePage(' + "'" + val.result.thirdsubTreeName[thirdsubTree_flag] + "'" + ')">';
//                         treeContent += '</a>';
//                         treeContent += '</li>';
//                         thirdsubTree_flag++;
//                     }
//                     else {
//                         var k = 0;
//                         if (val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName[k].length == 1) //当只有一个的时候防止被分割
//                         {
//                             treeContent += '<li id="thirdsubtreeitem' + k + '">';
//                             var url = getUrl('' + val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName + '');
//                             treeContent += ' <a class=" dropdown-toggle" data-addtab="' + val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName + '" data-url="' + url + '"> ';
//                             treeContent += '<img src="images/' + subTreeNameVal.subTreeIcon[j] + '.png"' + ' alt="" width="14" heigth="14"/> &nbsp ';
//                             treeContent += val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName;
//                             treeContent += '</a>';
//                             treeContent += '</li>';
//                         }
//                         else {
//                             for (var k = 0; k < val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName.length; k++) {
//                                 treeContent += '<li id="thirdsubtreeitem' + k + '">';
//                                 var url = getUrl('' + val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName[k] + '');
//
//                                 treeContent += ' <a class=" dropdown-toggle" data-addtab="' + val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName[k] + '" data-url="' + url + '"> ';
//                                 treeContent += '<img src="images/' + subTreeNameVal.subTreeIcon[j] + '.png"' + ' alt="" width="14" heigth="14"/> &nbsp ';
//                                 treeContent += val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName[k];
//                                 treeContent += '</a>';
//                                 treeContent += '</li>';
//                             }
//                         }
//                         thirdsubTree_flag++;
//                     }
//
//                     treeContent += '</ul>';
//                     treeContent += '</li>';
//
//                 }
//                 treeContent += '</ul>'
//             }
//             treeContent += '</li>';
//         }
//         document.getElementById("treeitem").innerHTML = treeContent;
//     });
// }
function loadTreeItem(userType) {
    operationFunc("", "getTreeItem", function (result) {
        var treeContent = "";
        var val = $.parseJSON(result);
        var thirdsubTree_flag = 0;

        if (val.result.treeName == "首页") {
            treeContent += '</li>';
            var url = getUrl('' + val.result.treeName + '');
            treeContent += ' <a id="' + val.result.treeName + '" class="" data-addtab="' + val.result.treeName + '" data-url=""> ';

            // treeContent += '<a onclick="changePage(' + "'" + val.result.treeName + "'" + ')">';
            treeContent += '<i class=""><img src="images/' + val.result.treeIcon + '.png"' + ' alt=""></i>';
            treeContent += '<span class="menu-text"> ' + val.result.treeName+'&nbsp&nbsp&nbsp&nbsp' + ' </span>';
            treeContent += '</a>';
            treeContent += '</li>';
            document.getElementById("treeitem").innerHTML = treeContent;
            return;
        }

        for (var i = 0; i < val.result.treeName.length; i++) {
            treeContent += '<li>';

            if (val.result.subTreeName[i] == "") {
                var url = getUrl('' + val.result.treeName[i] + '');
                treeContent += ' <a id="' + val.result.treeName[i] + '" class="" data-addtab="' + val.result.treeName[i] + '" data-url="' + url + '"> ';

                /*   treeContent += '<a onclick="changePage(' + "'" + val.result.treeName[i] + "'" + ')">';*/
                treeContent += '<i class=""><img src="images/' + val.result.treeIcon[i] + '.png"' + ' alt=""></i>';
                treeContent += '<span class="menu-text"> ' + val.result.treeName[i]+'&nbsp&nbsp&nbsp&nbsp' + ' </span>';

                treeContent += '</a>';
            }

            else {
                var subTreeNameVal = val.result.subTreeName[i];
                //var subTreeIconVal = val.result.subTreeIcon[i];
                var url = getUrl('' + val.result.treeName[i] + '');
                treeContent += ' <a class="dropdown-toggle" id="' + val.result.treeName[i] + '" data-addtab="' + val.result.treeName[i] + '" data-url="' + url + '"> ';
                // treeContent += '<a onclick="changePage(' + "'" + val.result.treeName[i] + "'" + ')" class="dropdown-toggle">';
                treeContent += '<i class=""><img src="images/' + val.result.treeIcon[i] + '.png"' + ' alt=""></i>';
                treeContent += '<span class="menu-text"> ' + val.result.treeName[i]+'&nbsp&nbsp&nbsp&nbsp' + ' </span>';
                treeContent += '<b class="arrow icon-angle-down"></b>'
                treeContent += '</a>';
                treeContent += '<ul class="submenu">';

                //由于设置单个节点的时候，subTreeNameVal.subTreeItemName不是一个数组，所以导致后面的关于数组的操作有问题
                //所以在这里统一转一下，不是数组也给他转成数组obj
                var obj = new Array();
                if(!(subTreeNameVal.subTreeItemName instanceof Array))
                {
                    obj.push(subTreeNameVal.subTreeItemName);
                }else{
                    obj = subTreeNameVal.subTreeItemName;
                }
                for (var j = 0; j < obj.length; j++) {
                    treeContent += '<li id="subtreeitem' + j + '">';
                    var url = getUrl('' + obj[j] + '');

                    if (url != "") {
                        treeContent += ' <a id="' + obj[j] + '" class="" data-addtab="' + obj[j] + '" data-url="' + url + '"> ';
                    } else {
                        treeContent += ' <a id="' + obj[j] + '" class="dropdown-toggle" data-addtab="' + obj[j] + '" data-url="' + url + '"> ';
                    }
                    //treeContent += '<a onclick="changePage(' + "'" + subTreeNameVal.subTreeItemName[j] +  "'" + ')" class="dropdown-toggle">';
                    //treeContent += '<a onclick="alert(' + "'123" + subTreeNameVal.subTreeItemName[j] +  "'" + ')" class="dropdown-toggle">';
                    //treeContent += '<a onclick="changePage(' + "'" + ZBQCZbDirectoryAction +  "'" + ')" class="dropdown-toggle">';

                    //treeContent += '<i class="icon-double-angle-right"></i>';
                    treeContent += obj[j]+'&nbsp&nbsp&nbsp';
                    treeContent += '</a>';
                    treeContent += '<ul class="submenu">';

                    if (val.result.thirdsubTreeName[thirdsubTree_flag] == "") {
                        treeContent += '<li>';
                        var url = getUrl('' + val.result.thirdsubTreeName[thirdsubTree_flag] + '');
                        treeContent += ' <a class="" data-addtab="' + val.result.thirdsubTreeName[thirdsubTree_flag] + '" data-url="' + url + '"> ';
                        // treeContent += '<a onclick="changePage(' + "'" + val.result.thirdsubTreeName[thirdsubTree_flag] + "'" + ')">';
                        treeContent += '</a>';
                        treeContent += '</li>';
                        thirdsubTree_flag++;
                    }
                    else {
                        var k = 0;
                        if (val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName[k].length == 1) //当只有一个的时候防止被分割
                        {
                            treeContent += '<li id="thirdsubtreeitem' + k + '">';
                            var url = getUrl('' + val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName + '');
                            treeContent += ' <a class=" dropdown-toggle" data-addtab="' + val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName + '" data-url="' + url + '"> ';
                            treeContent += val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName;
                            treeContent += '</a>';
                            treeContent += '</li>';
                        }
                        else {
                            for (var k = 0; k < val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName.length; k++) {
                                treeContent += '<li id="thirdsubtreeitem' + k + '">';
                                var url = getUrl('' + val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName[k] + '');
                                treeContent += ' <a class=" dropdown-toggle" data-addtab="' + val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName[k] + '" data-url="' + url + '"> ';
                                treeContent += val.result.thirdsubTreeName[thirdsubTree_flag].thirdsubTreeItemName[k];
                                treeContent += '</a>';
                                treeContent += '</li>';
                            }
                        }
                        thirdsubTree_flag++;
                    }

                    treeContent += '</ul>';
                    treeContent += '</li>';

                }
                treeContent += '</ul>'
            }
            treeContent += '</li>';
        }
        document.getElementById("treeitem").innerHTML = treeContent;
    });
}
function setJqgridCss() {
    $("#gbox_grid-table").css('width', '100%');
    $("#gview_grid-table").css('width', '100%');
    $(".ui-jqgrid-hdiv").css('width', '100%');
    $("#grid-table").css('width', '100%');
    $(".ui-jqgrid-htable").css('width', '100%');
    $("#grid-pager").css('width', '100%');
    $(".ui-jqgrid-bdiv").css('width', '100%');
    $(".ui-jqgrid-hbox").css('padding-right', '0px');
}

function toPage(page) {
    var test = document.getElementById("mainframe");
    test.src = "/" + page;
}

function closeTabByName(closeId) {
    parent.$.addtabs.close({
        "id": "tab_"+closeId//"tab_非仪器借用申请"
    })
    parent.$.addtabs.drop();
}

function refreshTab(id,url){
    $.addtabs.add({
        'id': id,
        'url': url,
        'refresh': true
    });
}


function getUrl(itemName) {
    var test = document.getElementById("mainframe");
    if (itemName == "首页") {
        return "/home";
    }
    else if (itemName == "待办事项") {
        return "/toPendingItem";
    }
    else if (itemName == "数据分析") {
        return "/warning";
    }
    else if (itemName == "搜索") {
        return "/warning";
    }
    else if (itemName == "人员信息") {
        return "/person_info_sel";
    }
    else if (itemName == "库房信息") {
        return "/warning";
    }
    else if (itemName == "机构信息") {
        return "/org_info_sel";
    }
    else if (itemName == "密钥登记") {
        return "/account_key";
    }
    else if (itemName == "装备登记") {
        return "/warning";
    }
    else if (itemName == "表单编号") {
        return "/queryHJJForm";
    }
    else if (itemName == "载体类型") {
        return "/queryHJJKeyCarrierType";
    }
    else if (itemName == "库房库位") {
        return "/queryHJJStockLocation";
    }
    else if (itemName == "角色权限") {
        return "/role";
    }
    //else if (itemName == "MM注册登记") {
    //    return "/keyAccount";
    //}
    else if (itemName == "台账管理") {
        return "/accountManager";
    }
    else if (itemName == "密码预算计划") {
        return "/budgetPlan";
    }
    else if (itemName == "预算计划审批") {
        return "/budgetPlanCheck"
    }
    else if (itemName == "生产入库计划") {
        return "/planPurchaseIn";
    }
    else if (itemName == "配发入库计划") {
        return "/planDistributeIn";
    }
    else if (itemName == "入库单") {
        return "/toHJJFormIn";
    }
    else if (itemName == "清退入库计划") {
        return "/planDestoryIn";
    }
    else if (itemName == "入库通知单") {
        return "/toHJJFormInNotification";
    }
    else if (itemName == "出库单") {
        return "/toHJJFormOut";
    }


    else if (itemName == "配发出库计划") {
        return "/queryHJJPlanDistributeOut";
    }
    else if (itemName == "清退出库计划") {
        return "/queryHJJPlanDestoryOut";
    }
    else if (itemName == "密码清退计划") {
        return "/queryHJJPlanDestory";
    }
    else if (itemName == "系统日志") {
        return "/toManageLog";
    }
    else if (itemName == "密码信息") {
        return "/toKeyDictionary";
        }
    else if (itemName == "密码库存查询") {
        return "/queryInventory";
    }
    else {
        return "";
    }

}

function initMainFrame() {
    var o1 = document.getElementById('navbar'); //获得元素
    var mainframebody = document.getElementById('mainframebody');
    var height = window.screen.height - o1.offsetHeight - 130;
    sessionStorage.height = height;
    $("#mainframe").css("height", height);
}
function getOperation() {
    return {
        name: 'myac',
        index: '',
        width: 80,
        fixed: true,
        sortable: false,
        resize: false,
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
                closeAfterEdit: true,// useful here!!
                recreateForm: true,
                beforeShowForm: beforeEditCallback
            }
        }
    };
}


function adjustjqGrid() {
    $(window).resize(function () {
        $("#grid_selector").setGridWidth($(window).width());
    });
}


function formAppend(row, colModel, colNames, btn, url) {
    $("#id-btn-dialog1").on('click', function (e) {
            e.preventDefault();

            $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
                _title: function (title) {
                    var $title = this.options.title || '&nbsp;'
                    if (("title_html" in this.options) && this.options.title_html == true)
                        title.html($title);
                    else title.text($title);
                }
            }));

            $("#modal-dialog-filter").removeClass('hide').dialog({
                modal: true,
                width: 600,
                title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-search'></i> 筛选条件</h4></div>",
                title_html: true,
                buttons: [
                    {
                        text: "查看",
                        "class": "btn btn-primary btn-xs",
                        click: function () {
                            var args = "";
                            var length = row.find("input,select").length;
                            row.find("input,select").each(function (i, n) {
                                args += $(n).attr('name') + "=" + $(n).val();
                                if (i < length - 1)args += '&';
                            });//遍历子元素
                            //ajax请求，刷新主菜单
                            var randomNum = Math.floor(Math.random() * 10000);
                            var _url = url + "?" + args + "&randomNum=" + randomNum;
                            jQuery("#grid-table").jqGrid('setGridParam', {
                                datatype: "json",
                                url: _url
                            }).trigger('reloadGrid');
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        }
    );

    var len = colModel.length;
    for (var i = 0; i < len; i++) {
        //判断是否可以添加。。
        var inputName = colNames[i];
        var col = colModel[i];
        if (col.hidedlg == true)continue;
        if (col.name.indexOf('cb') != -1)continue;//第一个是checkbox，跳过。
        if (col.name.indexOf('Path') != -1)continue;//包含path，代表是图片，需要屏蔽。
        if (col.name.indexOf(inputName) != -1)continue;
        if (col.name.indexOf('faultPhenomenon') != -1)continue;
        if (col.name.indexOf('faultCause') != -1)continue;
        if (col.name.indexOf('maintainPlan') != -1)continue;
        //时间 select，就这几样了吧。
        var inner = wrapInnerHtml(inputName, col);
        row.append(inner);
    }
    $('.date-picker').datepicker(
        {
            autoclose: true,
            dateFormat: "yy/mm/dd"
        }
    ).next().on(ace.click_event, function () {
        });


    btn.click(function () {

    });
}
function wrapInnerHtml(inputName, col) {
    var inner = '<div class="form-group">\
		<div class="row"><div class="col-sm-3 control-label no-padding-right"><label for="form-field-username">' + inputName + '</label></div>\
		<div class="col-sm-9">';
    //继续修改。

    if (col.edittype) {//edittype不为空
        if (col.edittype == 'select') {
            var _name = col.name.split(".")[1];
            inner = inner + ('<select class="col-sm-9" id=' + _name + ' name=' + _name + ' data-placeholder="选择...">')
            //获取所有的value
            var value = col.editoptions.value;
            var array = value.split(';');
            inner = inner + ('<option value=""></option>');//默认值
            for (var i = 0; i < array.length; i++) {
                var v0 = array[i].split(':')[0];
                var v1 = array[i].split(':')[1];
                inner = inner + ('<option value="' + v0 + '">' + v1 + '</option>');
            }
            inner = inner + ('</select>');
        }
        if (col.edittype == 'text') {
            inner = inner + '<div class="input-group ">';
            inner = inner + '<span class="input-group-addon "> 起始 </span>';
            inner = inner + '<input class="form-control date-picker" id="' + col.name + 'Begin" name="' + col.name + 'Begin" type="text" data-date-format="Y-M-D" />';
            inner = inner + '<span class="input-group-addon "> 结束 </span>';
            inner = inner + '<input class="form-control date-picker" id="' + col.name + 'End" name="' + col.name + 'End" type="text" data-date-format="yyyy-mm-dd" />';
            inner = inner + '</div>';

        }
    }
    else {

        if (!col.unformat) {
            //普通格式。
            inner = inner + '<input class="col-sm-9" type="text" id="' + col.name + '" placeholder="' + inputName + '" name="' + col.name + '"/>';
        }
    }
    inner = inner + ('</div></div></div>');
    return inner;
}

// 级联查询处理方法======================start
function getCustomElem(value, options, paramName, paramId) {
//		var rowid=options.id.split('_')[0];
//		var rec=$("#grid-table").jqGrid('getCell',rowid,'');
    //var url=options.url+"?paramCode="+rec.paramCode;

    //var rowid=$("#grid-table").jqGrid('getGridParam','selrow');
    var rec = $("#grid-table").jqGrid('getRowData', selRowId);
    var str = "";
    str += "<select>";
//		if(null != paramName && "" != paramName){
//			data= paramName + "=" + rec[paramName];
//		}else{
//			data= "paramCode=" + rec.paramCode;
//		}
    data = paramName + "=" + rec[paramId];
    str += getOptions(options.url, data, rec[options.id]);
    str += "</select>";
    return str;
}

function getCustomValue(elem, operation, value) {
    if (operation === 'get') {
        return elem.find("option:selected").text();
    } else if (operation === 'set') {
        $('input', elem).val(value);
    }
}

function changeSelectData(data, url, selId) {
    $("select#" + selId).empty();
    var str = "";
//	data= "paramCode=" + paramCode;
    str += getOptions(url, data, null);
    $("select#" + selId).append(str);
}

function changeShowData(selId, showData, url) {
    var str = "";

    if (null != url) {
        operationFunc(data, url, function (result) {
            var val = $.parseJSON(result);
            str = val.result;
        });
    } else {
        str = showData;
    }

    $("#" + selId).val(str);
}

function getOptions(url, data, selStr) {
    var str = "<option></option>";
    operationFunc(data, url, function (result) {
        var val = $.parseJSON(result);
        $.each(val.result, function (id, item) {
            if (null != selStr && item.code == selStr) {
                str += "<option value='" + item.code + "' selected='selected'>" + item.name + "</option>";
            } else {
                str += "<option value='" + item.code + "'>" + item.name + "</option>";
            }
        });
    });
    return str;
}
//级联查询处理方法======================end

/**
 * msgId : 显示提示信息的行id
 * colId : 所要校验的输入字段id
 * checkType : 校验类型：none--非空校验(默认)，num--数字校验，integer--整数校验 ,max -- 最大值校验 ， min -- 最小值校验
 * checkData : checkType为max 或为min 时的校验值
 * showMsg : 指定错误提示信息，无则使用默认错误提示信息
 * return 返回值.校验有误，显示校验信息并返回true ; 校验通过返回false。
 */
function checkDialog(msgId, colId, checkType, checkData ,showMsg) {
    if (null == msgId || "" == msgId || null == colId || "" == colId)
        return true;

    var colData = $.trim($(colId).val());
    var colName = $.trim($(colId).parent().prev("td").text());
    var flag = false;
    var msg = "";

    if (null == checkType || "" == checkType || checkType == 'none') {
        if (null == colData || "" == colData) {
            flag = true;
            msg = " 此字段必须";
        }
    }

    if (checkType == 'num') {
        var patten = /^\d+(\.\d+)?$/;
        if (!patten.test(colData)) {
            flag = true;
            msg = " 请输入有效数字";
        }
    }

    if (checkType == 'integer') {
        var patten = /^[0-9]{1,20}$/;
        if (!patten.test(colData)) {
            flag = true;
            msg = " 请输入有效整数";
        }
    }

    if (checkType == 'max') {
        if (null == checkData) {
            flag = true;
            msg = "无法获取最大值";
        } else if (parseInt(colData) > parseInt(checkData)) {
            flag = true;
            msg = " 输值必须小于等于 " + checkData;
        }
    }


    if (checkType == 'min') {
        if (null == checkData) {
            flag = true;
            msg = "无法获取最小值";
        } else if (parseInt(colData) < parseInt(checkData)) {
            flag = true;
            msg = " 输值必须大于等于" + checkData;
        }
    }

    if (flag) {
        if(null == showMsg)
            $(msgId).find("td").html(colName + msg);
        else
            $(msgId).find("td").html(showMsg);
        $(msgId).show();
        return true;
    }


    return false;
}

function dateHandleFunc(value, opts, rwd) {
    if (value == null || value == "") {
        return "---";
    }
    var v = value.split(" ");
    if ((v[0].split("-"))[0] == "1900") {
        return "---";
    }
    var vv = value.split(" ")[0];
    var newValue = vv.split("-")[0] + "/" + vv.split("-")[1] + "/" + vv.split("-")[2];
    return newValue;
}

//数组排序
function quickSort(arr) {
    //排序
    var i = 0;
    var j = arr.length - 1;
    if (j == -1)return arr;
    var sort = function (i, j) {
        if (i == j) {
            return;
        }
        var key = arr[i];
        var stepi = i;
        var stepj = j;
        while (j > i) {
            if (arr[j] >= key) {
                j--;
            }
            else {
                arr[i] = arr[j];
                while (j > ++i) {
                    if (arr[i] > key) {
                        arr[j] = arr[i];
                        break;
                    }
                }
            }
        }
        if (stepi == i) {
            sort(++i, stepj);
            return;
        }
        arr[i] = key;
        sort(stepi, i);
        sort(j, stepj);
    }
    sort(i, j);
    return arr;
}

function sorOptionByTitle(arr) {
    //排序
    var i = 0;
    var j = arr.length - 1;
    if (j == -1)return arr;
    var sort = function (i, j) {
        if (i == j) {
            return;
        }
        var key = arr[i];
        var stepi = i;
        var stepj = j;
        while (j > i) {
            if (arr[j].title >= key.title) {
                j--;
            }else {
                arr[i] = arr[j];
                while (j > ++i) {
                    if (arr[i].title > key.title) {
                        arr[j] = arr[i];
                        break;
                    }
                }
            }
        }
        if (stepi == i) {
            sort(++i, stepj);
            return;
        }
        arr[i] = key;
        sort(stepi, i);
        sort(j, stepj);
    }
    sort(i, j);
    return arr;
}


function arrayToString(arr) {
    if (arr.length == 0) {
        return "";
    }
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        str = str +arr[i];
        if(i != arr.length-1)
            str = str + ",";
    }
    return str;
}