/*
 * 生成项目批次完成情况表
 * @author minsheng.bai
 * @time 2016-11-3
 */
var productionLotTable = null;
function generateProductionLot(result, showType, isFinish) {
    var val = $.parseJSON(result);
    if (showType == "table") {
        if (productionLotTable != null) {
            productionLotTable.fnClearTable();
            productionLotTable.fnDestroy();
            productionLotTable = null;
        }
        var treeContent = "";

        treeContent += '<thead><tr>'
        treeContent += '<th>项目批次</th><th>客户名称</th><th>部门名称</th><th>调度员</th><th>计划开始日期</th><th>计划结束日期</th><th>责任人</th>';
        treeContent += '<th>状态</th><th>完成日期</th><th>产品完成详情</th></tr></thead>';
        treeContent += '<tbody>';
        for (var i = 0; i < val.rows.length; i++) {
            var date = new Date();
            treeContent += '<tr>'
            treeContent += '<td>';
            treeContent += val.rows[i].productionLotName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].clientInfo.clientName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].deptInfo.deptName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].schedulerInfo.userName;
            treeContent += '</td>';
            treeContent += '<td>';
            /*date.setTime(val.rows[i].startDate.time);
             if(date.getFullYear() == '1900')
             {
             treeContent += "---";
             }
             else{
             treeContent += date.getFullYear() + "-" + (date.getMonth()+1) + "-" +date.getDate();
             }*/
            if (val.rows[i].startDate == null || val.rows[i].startDate == "" || (val.rows[i].startDate.split("-"))[0] == '1900') {
                treeContent += "---";
            }
            else {
                var v = (val.rows[i].startDate.split(" "))[0];
                treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
            }
            treeContent += '</td>';
            treeContent += '<td>';

            if (val.rows[i].endDate == null || val.rows[i].endDate == "" || (val.rows[i].endDate.split("-"))[0] == '1900') {
                treeContent += "---";
            }
            else {
                var v = (val.rows[i].endDate.split(" "))[0];
                treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
            }
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].responsorInfo.userName;
            treeContent += '</td>'
            treeContent += '<td>';
            if (val.rows[i].isFinish == false) {
                treeContent += "正在进行";
            }
            else {
                var finishDateStr = (val.rows[i].finishDate.split(" "))[0];
                var finishDateArray = finishDateStr.split("-");
                var finishDate = new Date(finishDateArray[0], finishDateArray[1] - 1, finishDateArray[2]);
                var endDateStr = (val.rows[i].endDate.split(" "))[0];
                var endDateArray = endDateStr.split("-");
                var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
                treeContent += judgeFinishStatus(finishDate.getTime(), endDate.getTime());

                //treeContent += judgeFinishStatus(val.rows[i].finishDate.time,val.rows[i].endDate.time);
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
            treeContent += '<td>';
            treeContent += '<a onclick ="viewLotFinishDetail(' + "'" + val.rows[i].productionLotCode + "'" + ')" ';
            treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
            treeContent += '</td>';
            treeContent += '</tr>'
        }
        treeContent += '</tbody>';
        document.getElementById("lot_table").innerHTML = treeContent;

        if (isFinish == '')//以表格的方式显示，如果不为空，则是点击饼图显示详情，则不做分页处理
        {
            productionLotTable = $('#lot_table').dataTable({
                "aoColumns": [
                    null, null, null, null, null, null, null, null, null, {"bSortable": false},
                ]
            });
        }

    }
    else if (showType == "pie") {
        var allCount = val.allCount;
        var finishCount = val.finishCount;
        var finishCountExceedLimite = val.finishCountExceedLimite;
        var unFinishCountExceedLimit = val.unFinishCountExceedLimit;
        var unFinishCount = allCount - finishCount - finishCountExceedLimite - unFinishCountExceedLimit;
        var legend1 = '按时完成(' + finishCount + "个)";
        var legend2 = '延期完成(' + finishCountExceedLimite + "个)";
        var legend3 = '正常进行中(' + unFinishCount + "个)";
        var legend4 = '过期未完成(' + unFinishCountExceedLimit + "个)";
        var option = {
            tooltip: {
                trigger: 'item',
                //formatter: "{a} <br/>{b} : {c}个 ({d}%)",
                formatter: "{a} <br/>{b}    {d}%",
                labelLine: {show: true}
            },

            toolbox: {
                orient: 'vertical',
                x: 'right',
                y: 'top',
                padding: 5,
                itemGap: 10,
                show: true,
                featureImageIcon: {},
                feature: {
                    mark: {},
                    saveAsImage: {},
                    dataView: {},
                    dataZoom: {},
                    magicType: {},
                    restore: {},
                    save: {}
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: [legend1, legend2, legend3, legend4]
            },
            color: ['rgb(102,204,0)', 'rgb(97,160,168)', 'rgb(24,89,153)', 'rgb(221,88,80)'],
            series: [
                {
                    name: '项目批次完成情况',
                    type: 'pie',
                    radius: '90%',
                    center: ['50%', '50%'],
                    data: [
                        {value: finishCount, name: legend1},
                        {value: finishCountExceedLimite, name: legend2},
                        {value: unFinishCount, name: legend3},
                        {value: unFinishCountExceedLimit, name: legend4},
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        var myChart = echarts.init(document.getElementById('productionlot_pie'));
        myChart.setOption(option);

        myChart.on('click', function clickFunc(param) {

            if (param.name == legend1) {
                $("#productionlot_dialog").modal('toggle');
                var timeRange = sessionStorage.lotTimeRangeForPie;
                changeProductionLotByTimeRange_1(timeRange, 'finish');
            } else if (param.name == legend2) {
                $("#productionlot_dialog").modal('toggle');
                var timeRange = sessionStorage.lotTimeRangeForPie;
                changeProductionLotByTimeRange_1(timeRange, 'finishexceed');
            } else if (param.name == legend3) {
                $("#productionlot_dialog").modal('toggle');
                var timeRange = sessionStorage.lotTimeRangeForPie;
                changeProductionLotByTimeRange_1(timeRange, 'unfinish');
            } else if (param.name == legend4) {
                $("#productionlot_dialog").modal('toggle');
                var timeRange = sessionStorage.lotTimeRangeForPie;
                changeProductionLotByTimeRange_1(timeRange, 'unfinishexceed');
            }
        });
        /*
         var placeholder = $('#productionlot_pie').css({
         'width': '90%',
         'min-height': '200px'
         });
         var allCount = val.allCount;
         var finishCount = val.finishCount;
         if(allCount != 0)
         {
         finishRadio = (finishCount/allCount*100).toFixed(2);
         unfinishRadio = 100 - finishRadio;
         }else{
         finishRadio = 0;
         unfinishRadio = 0;
         }
         var data = [{
         label: "已完成数量:" +  finishCount+";占总数量："+ finishRadio +"%",
         data: finishRadio,
         color: "#68BC31"
         }, {
         label: "正在进行" +  (allCount-finishCount)+";占总数量："+ unfinishRadio +"%",
         data: unfinishRadio,
         color: "#2091CF"
         } ]

         drawPieChart(placeholder, data);

         placeholder.data('chart', data);
         placeholder.data('draw', drawPieChart);

         var $tooltip = $("<div class='tooltip top in'><div class='tooltip-inner'></div></div>").hide().appendTo('body');
         var previousPoint = null;

         placeholder.on('plothover', function(event, pos, item) {
         if(item) {
         if(previousPoint != item.seriesIndex) {
         previousPoint = item.seriesIndex;
         var tip = item.series['label'] + " : " + item.series['percent'] + '%';
         $tooltip.show().children(0).text(tip);
         }
         $tooltip.css({
         top: pos.pageY + 10,
         left: pos.pageX + 10
         });
         } else {
         $tooltip.hide();
         previousPoint = null;
         }

         });

         placeholder.on('plotclick', function(event, pos, item) {
         if(item) {
         if(item.seriesIndex == 0) {//已完成
         $("#productionlot_dialog").modal('toggle');
         var timeRange = sessionStorage.lotTimeRangeForPie ;
         changeProductionLotByTimeRange(timeRange,'table','true');

         } else if(item.seriesIndex == 1) {//正在进行
         $("#productionlot_dialog").modal('toggle');
         var timeRange = sessionStorage.lotTimeRangeForPie ;
         changeProductionLotByTimeRange(timeRange,'table','false');
         }
         }
         });
         */
    }


}
function generateProductionLot_1(result, finishType) {
    var val = $.parseJSON(result);

    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>项目批次</th><th>客户名称</th><th>部门名称</th><th>调度员</th><th>计划开始日期</th><th>计划结束日期</th><th>责任人</th>';
    treeContent += '<th>状态</th><th>完成日期</th><th>产品完成详情</th></tr></thead>';
    treeContent += '<tbody>';
    for (var i = 0; i < val.rows.length; i++) {
        var date = new Date();
        if (val.rows[i].isFinish == false) {
            if (finishType == 'unfinish') {

                var endDateStr = (val.rows[i].endDate.split(" "))[0];
                var endDateArray = endDateStr.split("-");
                var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
                if (date.getTime() <= endDate.getTime()) {

                    treeContent += '<tr>'
                    treeContent += '<td>';
                    treeContent += val.rows[i].productionLotName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].clientInfo.clientName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].deptInfo.deptName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].schedulerInfo.userName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    if (val.rows[i].startDate == null || val.rows[i].startDate == "" || (val.rows[i].startDate.split("-"))[0] == '1900') {
                        treeContent += "---";
                    }
                    else {
                        var v = (val.rows[i].startDate.split(" "))[0];
                        treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
                    }
                    treeContent += '</td>';
                    treeContent += '<td>';

                    if (val.rows[i].endDate == null || val.rows[i].endDate == "" || (val.rows[i].endDate.split("-"))[0] == '1900') {
                        treeContent += "---";
                    }
                    else {
                        var v = (val.rows[i].endDate.split(" "))[0];
                        treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
                    }
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].responsorInfo.userName;
                    treeContent += '</td>'
                    treeContent += '<td>';
                    treeContent += "正常进行中";
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
                    treeContent += '<td>';
                    treeContent += '<a onclick ="viewLotFinishDetail(' + "'" + val.rows[i].productionLotCode + "'" + ')" ';
                    treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
                    treeContent += '</td>';
                    treeContent += '</tr>'
                }
            } else if (finishType == 'unfinishexceed') {

                var endDateStr = (val.rows[i].endDate.split(" "))[0];
                var endDateArray = endDateStr.split("-");
                var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
                if (date.getTime() > endDate.getTime()) {

                    treeContent += '<tr>'
                    treeContent += '<td>';
                    treeContent += val.rows[i].productionLotName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].clientInfo.clientName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].deptInfo.deptName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].schedulerInfo.userName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    if (val.rows[i].startDate == null || val.rows[i].startDate == "" || (val.rows[i].startDate.split("-"))[0] == '1900') {
                        treeContent += "---";
                    }
                    else {
                        var v = (val.rows[i].startDate.split(" "))[0];
                        treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
                    }
                    treeContent += '</td>';
                    treeContent += '<td>';

                    if (val.rows[i].endDate == null || val.rows[i].endDate == "" || (val.rows[i].endDate.split("-"))[0] == '1900') {
                        treeContent += "---";
                    }
                    else {
                        var v = (val.rows[i].endDate.split(" "))[0];
                        treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
                    }
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].responsorInfo.userName;
                    treeContent += '</td>'
                    treeContent += '<td>';
                    treeContent += "延期进行中";
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
                    treeContent += '<td>';
                    treeContent += '<a onclick ="viewLotFinishDetail(' + "'" + val.rows[i].productionLotCode + "'" + ')" ';
                    treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
                    treeContent += '</td>';
                    treeContent += '</tr>'
                }
            }
        } else {
            if (finishType == 'finish') {

                var finishDateStr = (val.rows[i].finishDate.split(" "))[0];
                var finishDateArray = finishDateStr.split("-");
                var finishDate = new Date(finishDateArray[0], finishDateArray[1] - 1, finishDateArray[2]);
                var endDateStr = (val.rows[i].endDate.split(" "))[0];
                var endDateArray = endDateStr.split("-");
                var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
                if (finishDate.getTime() <= endDate.getTime()) {
                    treeContent += '<tr>'
                    treeContent += '<td>';
                    treeContent += val.rows[i].productionLotName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].clientInfo.clientName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].deptInfo.deptName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].schedulerInfo.userName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    if (val.rows[i].startDate == null || val.rows[i].startDate == "" || (val.rows[i].startDate.split("-"))[0] == '1900') {
                        treeContent += "---";
                    }
                    else {
                        var v = (val.rows[i].startDate.split(" "))[0];
                        treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
                    }
                    treeContent += '</td>';
                    treeContent += '<td>';

                    if (val.rows[i].endDate == null || val.rows[i].endDate == "" || (val.rows[i].endDate.split("-"))[0] == '1900') {
                        treeContent += "---";
                    }
                    else {
                        var v = (val.rows[i].endDate.split(" "))[0];
                        treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
                    }
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].responsorInfo.userName;
                    treeContent += '</td>'
                    treeContent += '<td>';
                    treeContent += "按时完成";
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
                    treeContent += '<td>';
                    treeContent += '<a onclick ="viewLotFinishDetail(' + "'" + val.rows[i].productionLotCode + "'" + ')" ';
                    treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
                    treeContent += '</td>';
                    treeContent += '</tr>'
                }
            } else if (finishType == 'finishexceed') {

                var finishDateStr = (val.rows[i].finishDate.split(" "))[0];
                var finishDateArray = finishDateStr.split("-");
                var finishDate = new Date(finishDateArray[0], finishDateArray[1] - 1, finishDateArray[2]);
                var endDateStr = (val.rows[i].endDate.split(" "))[0];
                var endDateArray = endDateStr.split("-");
                var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
                if (finishDate.getTime() > endDate.getTime()) {
                    treeContent += '<tr>'
                    treeContent += '<td>';
                    treeContent += val.rows[i].productionLotName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].clientInfo.clientName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].deptInfo.deptName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].schedulerInfo.userName;
                    treeContent += '</td>';
                    treeContent += '<td>';
                    if (val.rows[i].startDate == null || val.rows[i].startDate == "" || (val.rows[i].startDate.split("-"))[0] == '1900') {
                        treeContent += "---";
                    }
                    else {
                        var v = (val.rows[i].startDate.split(" "))[0];
                        treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
                    }
                    treeContent += '</td>';
                    treeContent += '<td>';

                    if (val.rows[i].endDate == null || val.rows[i].endDate == "" || (val.rows[i].endDate.split("-"))[0] == '1900') {
                        treeContent += "---";
                    }
                    else {
                        var v = (val.rows[i].endDate.split(" "))[0];
                        treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
                    }
                    treeContent += '</td>';
                    treeContent += '<td>';
                    treeContent += val.rows[i].responsorInfo.userName;
                    treeContent += '</td>'
                    treeContent += '<td>';
                    treeContent += "延期完成";
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
                    treeContent += '<td>';
                    treeContent += '<a onclick ="viewLotFinishDetail(' + "'" + val.rows[i].productionLotCode + "'" + ')" ';
                    treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
                    treeContent += '</td>';
                    treeContent += '</tr>'
                }

            }
        }
    }
    treeContent += '</tbody>';
    document.getElementById("lot_table").innerHTML = treeContent;
}

function drawPieChart(placeholder, data, position) {
    $.plot(placeholder, data, {
        series: {
            pie: {
                show: true,
                tilt: 1,
                highlight: {
                    opacity: 0.25
                },
                stroke: {
                    color: '#fff',
                    width: 2
                },
                startAngle: 2
            }
        },
        legend: {
            show: true,
            position: position || "ne",
            labelBoxBorderColor: null,
            margin: [-30, 15]
        },
        grid: {
            hoverable: true,
            clickable: true
        }
    })
}
/*
 * 获取项目批次完成情况表
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getProductionLotInfoForTable() {

    //var timeRangeContext = document.getElementById("lot_time_range").innerHTML;
    var timeRange = $.trim(timeRangeContext.split("<")[0]);
    changeProductionLotByTimeRange(timeRange, 'table', '');
}

/*
 * 计算机每个部门购入状态
 * @author WBT
 * @time 2017/6/30
 */
function getComputerStateForTable() {

   // var timeRangeContext = document.getElementById("computer_time_range").innerHTML;
   // var timeRange = $.trim(timeRangeContext.split("<")[0]);

    var timeRange = "";
    changeComputerStateByTimeRange(timeRange, "pie", '');
}
/*
 * 判断完成情况
 * @author minsheng.bai
 * @time 2016-11-3
 */
function judgeFinishStatus(finishTime, endTime) {
    var result = "";
    if (Math.abs(finishTime - endTime) < 3 * 24 * 3600 * 1000) //前后三天内的话，属于正常完成
    {
        result = "正常完成";
    } else if (finishTime < endTime)//否则，完成时间小于计划结束时间的话，属于提前完成
    {
        result = "提前完成";
    }
    else if (finishTime > endTime)//否则，完成时间大于计划结束时间的话，属于延期完成
    {
        result = "延期完成";
    }
    return result;
}
/*
 * 查看产品批次完成情况详情
 * @author minsheng.bai
 * @time 2016-11-3
 */
function viewLotFinishDetail(productionLotCode) {
    var treeContent = "";
    $("#modal_lotdetail").modal('toggle');
    operationFunc("productLotCode=" + productionLotCode, "queryProductionLotDefine", function (result) {
        var val = $.parseJSON(result);
        treeContent += '<thead><tr>'
        treeContent += '<th>项目批次</th><th>产品名称</th><th>需要数量</th><th>已有数量</th><th>完成情况</th><th>完成日期</th>';
        treeContent += '<tbody>';
        for (var i = 0; i < val.rows.length; i++) {
            var date = new Date();
            treeContent += '<tr>'
            treeContent += '<td>';
            treeContent += val.rows[i].productionLot.productionLotName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].productionInfo.productionName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].productionCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].haveProductionCount;
            treeContent += '</td>';
            treeContent += '<td>';
            if (val.rows[i].isFinish == false) {
                treeContent += "正在进行";
            }
            else {
                treeContent += "已完成";
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
        document.getElementById("lotdetail_table").innerHTML = treeContent;


    });
}

/*
 * 根据时间范围来重新生成产品批次表
 * @author minsheng.bai
 * @time 2016-11-3
 1.isFinish = '':设计师页面以表格形式显示
 2.isFinish != '':领导界面以饼图显示，并且显示饼图的详细信息
 */
function changeProductionLotByTimeRange(timeRange, showType, isFinish) {
    //document.getElementById("lot_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';

    sessionStorage.lotTimeRangeForPie = timeRange;
    if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionLot", function (result) {
            generateProductionLot(result, showType, isFinish)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionLot", function (result) {
            generateProductionLot(result, showType, isFinish)
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionLot", function (result) {
            generateProductionLot(result, showType, isFinish)
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionLot", function (result) {
            generateProductionLot(result, showType, isFinish)
        });

    }


}
function changeProductionLotByTimeRange_1(timeRange, finishType) {
    document.getElementById("lot_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';
    sessionStorage.lotTimeRangeForPie = timeRange;
    if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate;
        operationFunc(condition, "queryProductionLot", function (result) {
            generateProductionLot_1(result, finishType)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd;
        operationFunc(condition, "queryProductionLot", function (result) {
            generateProductionLot_1(result, finishType);
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd;
        operationFunc(condition, "queryProductionLot", function (result) {
            generateProductionLot_1(result, finishType);
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd;
        operationFunc(condition, "queryProductionLot", function (result) {
            generateProductionLot_1(result, finishType);
        });

    }


}
/*
 * 生成产品计划齐套情况
 * @author minsheng.bai
 * @time 2016-11-3
 */
var planReadyTable = null;
function generateProductionPlanReadyTable(result) {
    if (planReadyTable != null) {
        planReadyTable.fnClearTable();
        planReadyTable.fnDestroy();
        planReadyTable = null;
    }
    var treeContent = "";
    var val = $.parseJSON(result);
    treeContent += '<thead><tr>'
    treeContent += '<th>生产计划</th><th>产品名称</th><th>生产数量</th><th>计划开始日期</th><th>计划结束日期</th><th>部门名称</th><th>责任人</th><th>齐套状态</th><th>齐套日期</th><th>产品齐套详情</th></tr></thead>';
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
        if (val.rows[i].isReady == false) {
            treeContent += "正在进行";
        }
        else {
            treeContent += "已齐套";
        }
        treeContent += '</td>';
        treeContent += '<td>';
        if (val.rows[i].readyDate == null || val.rows[i].readyDate == "" || (val.rows[i].readyDate.split("-"))[0] == '1900') {
            treeContent += "---";
        }
        else {
            var v = (val.rows[i].readyDate.split(" "))[0];
            treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
        }
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += '<a onclick ="viewProductionPlanReadyDetail(' + "'" + val.rows[i].productionPlanCode + "'" + ')" ';
        treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
        treeContent += '</td>';
        treeContent += '</tr>'
    }
    treeContent += '</tbody>';
    document.getElementById("productionplanready_table").innerHTML = treeContent;

    planReadyTable = $('#productionplanready_table').dataTable({
        "aoColumns": [
            null, null, null, null, null, null, null, null, null, {"bSortable": false},
        ]
    });
}

/*
 * 获取产品计划齐套表
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getProductionPlanReadyForTable() {
    var timeRangeContext = document.getElementById("plan_time_range").innerHTML;
    var timeRange = $.trim(timeRangeContext.split("<")[0]);
    changeProductionPlanByTimeRange(timeRange);
}

function viewProductionPlanReadyDetail(productionPlanCode) {
    var treeContent = "";
    $("#modal_planreadydetail").modal('toggle');
    operationFunc("productionPlanCode=" + productionPlanCode, "queryProductionPlanFinish", function (result) {
        var val = $.parseJSON(result);
        treeContent += '<thead><tr>'
        treeContent += '<th>生产计划</th><th>产品名称</th><th>部件名称</th><th>所需数量</th><th>已有数量</th><th>齐套状态</th><th>齐套日期</th></tr></thead>';
        treeContent += '<tbody>';
        for (var i = 0; i < val.rows.length; i++) {
            var date = new Date();
            treeContent += '<tr>'
            treeContent += '<td>';
            treeContent += val.rows[i].productionPlan.productionPlanName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].productionInfo.productionName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].partInfo.partName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].needPartCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].havePartCount;
            treeContent += '</td>';
            treeContent += '<td>';
            if (val.rows[i].isReady == false) {
                treeContent += "正在进行";
            }
            else {
                treeContent += "已齐套";
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
        document.getElementById("planreadydetail_table").innerHTML = treeContent;
    });
}
/*
 * 根据不同的时间段对计划齐套情况进行筛选
 * @author minsheng.bai
 * @time 2016-11-3
 */
function changeProductionPlanByTimeRange(timeRange) {
    document.getElementById("plan_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';
    if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanReadyTable(result)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanReadyTable(result)
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanReadyTable(result)
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanReadyTable(result)
        });
    }
}


/*
 * 计算机每个部门购入状态
 * @author WBT
 * @time 2017-6-30
 */
var planFinishTable = null;
function generateComputerStateTable(result, showType, isFinish) {
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
    else if (showType == 'pie') {
        var allCount = 0;
        var finishCount = 0;
        var finishCountExceedLimite =0;
        var unFinishCountExceedLimit = 0;
        var unFinishCount = 0;

        var legend1 = '';
        var legend2 = '';
        var legend3 ='';
        var legend4 = '';

        var lists =new Array();
        var i=0;
        var val = $.parseJSON(result);
        $.each(val.list,function(id,item){
            lists[i] =item.deptName+":"+item.RMBPrice+"(元)"
            i++;
        });

        var option = {
            tooltip: {
                trigger: 'item',
                //formatter: "{a} <br/>{b} : {c}个 ({d}%)",
                formatter: "{a} <br/>{b}    {d}%",
                labelLine: {show: true}
            },
            toolbox: {
                orient: 'vertical',
                x: 'right',
                y: 'bottom',
                padding: 0,
                itemGap: 10,
                show: true,
                featureImageIcon: {},
                feature: {
                    mark: {},
                    saveAsImage: {},
                    dataView: {},
                    dataZoom: {},
                    magicType: {},
                    restore: {},
                    save: {}
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ["", "", "","", "", "","", "", "",""]
            },
            color: ['rgb(102,204,0)', 'rgb(97,160,168)', 'rgb(24,89,153)', 'rgb(221,88,80)'],
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '90%',
                    center: ['55%', '55%'],//修改文字被遮挡问题
                    data: val.list,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 5,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        var myChart = echarts.init(document.getElementById('computerState_pie'));
        myChart.setOption(option);

        myChart.on('click', function clickFunc(param) {

            /*if (param.name == legend1) {
                $("#productionPlanFinish_dialog").modal('toggle');
                var timeRange = sessionStorage.productionplanTimeRangeForPie;
                changeProductionPlanFinishByTimeRange_1(timeRange, 'finish');
            } else if (param.name == legend2) {
                $("#productionPlanFinish_dialog").modal('toggle');
                var timeRange = sessionStorage.productionplanTimeRangeForPie;
                changeProductionPlanFinishByTimeRange_1(timeRange, 'finishexceed');
            }
            else if (param.name == legend3) {
                $("#productionPlanFinish_dialog").modal('toggle');
                var timeRange = sessionStorage.productionplanTimeRangeForPie;
                changeProductionPlanFinishByTimeRange_1(timeRange, 'unfinish');
            }
            else if (param.name == legend4) {
                $("#productionPlanFinish_dialog").modal('toggle');
                var timeRange = sessionStorage.productionplanTimeRangeForPie;
                changeProductionPlanFinishByTimeRange_1(timeRange, 'unfinishexceed');
            }*/
        });

    }

}





/*
 * 生成产品计划完成情况
 * @author minsheng.bai
 * @time 2016-11-3
 */
var planFinishTable = null;
function generateProductionPlanFinishTable(result, showType, isFinish) {
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
    else if (showType == 'pie') {
        var allCount = val.allCount;
        var finishCount = val.finishCount;
        var finishCountExceedLimite = val.finishCountExceedLimite;
        var unFinishCountExceedLimit = val.unFinishCountExceedLimit;
        var unFinishCount = allCount - finishCount - finishCountExceedLimite - unFinishCountExceedLimit;
        var legend1 = '按时完成(' + finishCount + "个)";
        var legend2 = '延期完成(' + finishCountExceedLimite + "个)";
        var legend3 = '正常进行中(' + unFinishCount + "个)";
        var legend4 = '过期未完成(' + unFinishCountExceedLimit + "个)";
        var option = {
            tooltip: {
                trigger: 'item',
                //formatter: "{a} <br/>{b} : {c}个 ({d}%)",
                formatter: "{a} <br/>{b}    {d}%",
                labelLine: {show: true}
            },

            toolbox: {
                orient: 'vertical',
                x: 'right',
                y: 'top',
                padding: 5,
                itemGap: 10,
                show: true,
                featureImageIcon: {},
                feature: {
                    mark: {},
                    saveAsImage: {},
                    dataView: {},
                    dataZoom: {},
                    magicType: {},
                    restore: {},
                    save: {}
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: [legend1, legend2, legend3, legend4]
            },
            color: ['rgb(102,204,0)', 'rgb(97,160,168)', 'rgb(24,89,153)', 'rgb(221,88,80)'],
            series: [
                {
                    name: '生产计划完成情况',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: ['0', '50%'],
                    data: [
                        {value: finishCount, name: ""},
                        {value: finishCountExceedLimite, name: ""},
                        {value: unFinishCount, name: ""},
                        {value: unFinishCountExceedLimit, name: ""},
                    ],
                    avoidLabelOverlap: false,

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

                },
                {
                    name: '生产计划完成情况',
                    type: 'pie',
                    radius: ['70%', '90%'],
                    data: [
                        {value: finishCount, name: legend1},
                        {value: finishCountExceedLimite, name: legend2},
                        {value: unFinishCount, name: legend3},
                        {value: unFinishCountExceedLimit, name: legend4},
                    ]
                }
            ]
        };

        var myChart = echarts.init(document.getElementById('productionplanFinish_pie'));
        myChart.setOption(option);

        myChart.on('click', function clickFunc(param) {

            if (param.name == legend1) {
                $("#productionPlanFinish_dialog").modal('toggle');
                var timeRange = sessionStorage.productionplanTimeRangeForPie;
                changeProductionPlanFinishByTimeRange_1(timeRange, 'finish');
            } else if (param.name == legend2) {
                $("#productionPlanFinish_dialog").modal('toggle');
                var timeRange = sessionStorage.productionplanTimeRangeForPie;
                changeProductionPlanFinishByTimeRange_1(timeRange, 'finishexceed');
            }
            else if (param.name == legend3) {
                $("#productionPlanFinish_dialog").modal('toggle');
                var timeRange = sessionStorage.productionplanTimeRangeForPie;
                changeProductionPlanFinishByTimeRange_1(timeRange, 'unfinish');
            }
            else if (param.name == legend4) {
                $("#productionPlanFinish_dialog").modal('toggle');
                var timeRange = sessionStorage.productionplanTimeRangeForPie;
                changeProductionPlanFinishByTimeRange_1(timeRange, 'unfinishexceed');
            }
        });

        /*var placeholder = $('#productionplanFinish_pie').css({
         'width': '90%',
         'min-height': '200px'
         });
         var allCount = val.allCount;
         var finishCount = val.finishCount;
         if (allCount != 0) {
         finishRadio = (finishCount / allCount * 100).toFixed(2);
         unfinishRadio = 100 - finishRadio;
         } else {
         finishRadio = 0;
         unfinishRadio = 0;
         }
         var data = [{
         label: "已完成数量:" + finishCount + ";占总数量：" + finishRadio + "%",
         data: finishRadio,
         color: "#68BC31"
         }, {
         label: "正在进行:" + (allCount - finishCount) + ";占总数量：" + unfinishRadio + "%",
         data: unfinishRadio,
         color: "#2091CF"
         }]

         drawPieChart(placeholder, data);

         placeholder.data('chart', data);
         placeholder.data('draw', drawPieChart);

         var $tooltip = $("<div class='tooltip top in'><div class='tooltip-inner'></div></div>").hide().appendTo('body');
         var previousPoint = null;

         placeholder.on('plothover', function (event, pos, item) {
         if (item) {
         if (previousPoint != item.seriesIndex) {
         previousPoint = item.seriesIndex;
         var tip = item.series['label'] + " : " + item.series['percent'] + '%';
         $tooltip.show().children(0).text(tip);
         }
         $tooltip.css({
         top: pos.pageY + 10,
         left: pos.pageX + 10
         });
         } else {
         $tooltip.hide();
         previousPoint = null;
         }

         });

         placeholder.on('plotclick', function (event, pos, item) {
         if (item) {
         if (item.seriesIndex == 0) {//已完成
         $("#productionPlanFinish_dialog").modal('toggle');
         var timeRange = sessionStorage.productionplanTimeRangeForPie;
         changeProductionPlanFinishByTimeRange(timeRange, 'table', 'true');

         } else if (item.seriesIndex == 1) {//正在进行
         $("#productionPlanFinish_dialog").modal('toggle');
         var timeRange = sessionStorage.productionplanTimeRangeForPie;
         changeProductionPlanFinishByTimeRange(timeRange, 'table', 'false');
         }
         }
         });*/


    }

}



function generateProductionPlanFinishTable_1(result, finishType) {
    var val = $.parseJSON(result);

    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>生产计划</th><th>产品名称</th><th>生产数量</th><th>计划开始日期</th><th>计划结束日期</th><th>部门</th><th>责任人</th><th>完成情况</th><th>完成日期</th></tr></thead>';
    treeContent += '<tbody>';
    for (var i = 0; i < val.rows.length; i++) {
        var date = new Date();
        if (val.rows[i].isFinish == "未完成") {
            if (finishType == 'unfinish') {
                var endDateStr = (val.rows[i].planEndDate.split(" "))[0];
                var endDateArray = endDateStr.split("-");
                var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
                if (date.getTime() <= endDate.getTime()) {
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
                    treeContent += "正常进行中";
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

            } else if (finishType == 'unfinishexceed') {
                var endDateStr = (val.rows[i].planEndDate.split(" "))[0];
                var endDateArray = endDateStr.split("-");
                var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
                if (date.getTime() > endDate.getTime()) {
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
                    treeContent += "延期进行中";
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
            }
        } else {
            if (finishType == 'finish') {
                var finishDateStr = (val.rows[i].finishDate.split(" "))[0];
                var finishDateArray = finishDateStr.split("-");
                var finishDate = new Date(finishDateArray[0], finishDateArray[1] - 1, finishDateArray[2]);
                var endDateStr = (val.rows[i].planEndDate.split(" "))[0];
                var endDateArray = endDateStr.split("-");
                var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
                if ((finishDate.getTime() <= endDate.getTime())) {
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
                    treeContent += "正常完成";
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

            } else if (finishType == 'finishexceed') {
                var finishDateStr = (val.rows[i].finishDate.split(" "))[0];
                var finishDateArray = finishDateStr.split("-");
                var finishDate = new Date(finishDateArray[0], finishDateArray[1] - 1, finishDateArray[2]);
                var endDateStr = (val.rows[i].planEndDate.split(" "))[0];
                var endDateArray = endDateStr.split("-");
                var endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);
                if ((finishDate.getTime() > endDate.getTime())) {
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
                    treeContent += "延期完成";
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
            }
        }
    }
    treeContent += '</tbody>';
    document.getElementById("productionplanFinish_table").innerHTML = treeContent;

}
/*
 * 获取产品计划完成情况
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getProductionPlanFinishForTable() {
    var timeRangeContext = document.getElementById("planFinish_time_range").innerHTML;
    var timeRange = $.trim(timeRangeContext.split("<")[0]);
    changeProductionPlanFinishByTimeRange(timeRange, 'table', '');
}



/*
 * 根据不同的时间段对计划完成情况进行筛选
 * @author WBT
 * @time 2017-6-30
 */

function changeComputerStateByTimeRange(timeRange, showType, isFinish) {
    //document.getElementById("planFinish_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';
    //sessionStorage.productionplanTimeRangeForPie = timeRange;

    //var mondayDate = getThisMonday();
    //var sundayDate = getThisSunday();
    //var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate + "&isFinish=" + isFinish;
    var condition = "";
    operationFunc(condition, "getComputerState", function (result) {
        generateComputerStateTable(result, showType, isFinish)
    });

    /*if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable(result, showType, isFinish)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable(result, showType, isFinish)
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable(result, showType, isFinish)
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable(result, showType, isFinish)
        });
    }*/
}




/*
 * 根据不同的时间段对计划完成情况进行筛选
 * @author minsheng.bai
 * @time 2016-11-3
 */

function changeProductionPlanFinishByTimeRange(timeRange, showType, isFinish) {
    document.getElementById("planFinish_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';
    sessionStorage.productionplanTimeRangeForPie = timeRange;
    if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable(result, showType, isFinish)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable(result, showType, isFinish)
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable(result, showType, isFinish)
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd + "&isFinish=" + isFinish;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable(result, showType, isFinish)
        });
    }
}
function changeProductionPlanFinishByTimeRange_1(timeRange, finishType) {
    document.getElementById("planFinish_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';
    sessionStorage.productionplanTimeRangeForPie = timeRange;
    if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable_1(result, finishType)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable_1(result, finishType)
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable_1(result, finishType)
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd;
        operationFunc(condition, "queryProductionPlan", function (result) {
            generateProductionPlanFinishTable_1(result, finishType)
        });
    }
}
/*
 * 获取未完成的售后服务单
 * @author minsheng.bai
 * @time 2016-11-07
 */
function getAfterSaleServiceFinishForTable() {
    var timeRangeContext = document.getElementById("afterservice_time_range").innerHTML;
    var timeRange = $.trim(timeRangeContext.split("<")[0]);
    changeAfterSaleServiceFinishByTimeRange(timeRange);
}

/*
 * 根据不同的时间段获取未完成的售后服务单
 * @author minsheng.bai
 * @time 2016-11-07
 */
function changeAfterSaleServiceFinishByTimeRange(timeRange) {
    document.getElementById("afterservice_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';
    if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate + "&isFinish='false'";
        operationFunc(condition, "queryAfterService", function (result) {
            generateAfterSaleServiceFinishTable(result)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd + "&isFinish='false'";
        operationFunc(condition, "queryAfterService", function (result) {
            generateAfterSaleServiceFinishTable(result)
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd + "&isFinish='false'";
        operationFunc(condition, "queryAfterService", function (result) {
            generateAfterSaleServiceFinishTable(result)
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd + "&isFinish='false'";
        operationFunc(condition, "queryAfterService", function (result) {
            generateAfterSaleServiceFinishTable(result)
        });
    }
}

/*
 * 生成售后服务单完成情况
 * @author minsheng.bai
 * @time 2016-11-07
 */
var afterSaleServiceFinishTable = null;
function generateAfterSaleServiceFinishTable(result) {
    if (afterSaleServiceFinishTable != null) {
        afterSaleServiceFinishTable.fnClearTable();
        afterSaleServiceFinishTable.fnDestroy();
        afterSaleServiceFinishTable = null;
    }
    var treeContent = "";
    var val = $.parseJSON(result);
    treeContent += '<thead><tr>'
    treeContent += '<th>售后服务单名称</th><th>单件产品编号</th><th>客户名称</th><th>客户联系方式</th><th>客户联系人</th><th>登记日期</th><th>登记人</th><th>部门</th><th>故障现象</th><th>初步解决方案</th><th>责任人</th></tr></thead>';
    treeContent += '<tbody>';

    for (var i = 0; i < val.rows.length; i++) {
        var date = new Date();
        treeContent += '<tr>'
        treeContent += '<td>';
        treeContent += val.rows[i].afterSaleServiceName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].oneProductionCode;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].clientInfo.clientName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].clientTelephoneNum;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].clientContact;
        treeContent += '</td>';
        treeContent += '<td>';
        if (val.rows[i].registeDate == null || val.rows[i].registeDate == "" || (val.rows[i].registeDate.split("-"))[0] == '1900') {
            treeContent += "---";
        }
        else {
            var v = (val.rows[i].registeDate.split(" "))[0];
            treeContent += v.split("-")[0]+"/"+v.split("-")[1]+"/"+v.split("-")[2];
        }
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].registerInfo.userName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].deptInfo.deptName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].faultPhenomenon;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].simpleMaintainPlan;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].responsorInfo.userName;
        treeContent += '</td>';
        treeContent += '</tr>'
    }
    treeContent += '</tbody>';
    document.getElementById("afterservice_table").innerHTML = treeContent;

    afterSaleServiceFinishTable = $('#afterservice_table').dataTable();
}
/*
 * 获得项目批次数据，饼图展示
 * @author minsheng.bai
 * @time 2016-11-8
 */
function getProductionLotInfoForPie() {
   /* var timeRangeContext = document.getElementById("lot_time_range").innerHTML;
    var timeRange = $.trim(timeRangeContext.split("<")[0]);
    changeProductionLotByTimeRange(timeRange, "pie", '');*/
}

/*
 * 获得产品生成计划数据，饼图展示
 * @author minsheng.bai
 * @time 2016-11-8
 */
function getProductionPlanFinishForPie() {
    var timeRangeContext = document.getElementById("planFinish_time_range").innerHTML;
    var timeRange = $.trim(timeRangeContext.split("<")[0]);
    changeProductionPlanFinishByTimeRange(timeRange, "pie", '');
}

/*
 * 获得产品库存表
 * @author minsheng.bai
 * @time 2016-11-8
 */
function getProductionStorageForTable() {
    operationFunc("", "queryProductionStorage", function (result) {
        generateProductionStorageTable(result)
    });
}
/*
 * 判断
 * @author minsheng.bai
 * @time 2016-11-8
 */
function judgeNoExist(productionCode, productionCodeArray) {
    for (var i = 0; i < productionCodeArray.length; i++) {
        if (productionCode == productionCodeArray[i]) {
            return false;
        }
    }
    return true;
}
/*
 * 生成产品库存表
 * @author minsheng.bai
 * @time 2016-11-8
 */
var productionStorageTable = null
function generateProductionStorageTable(result) {
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
    if (productionStorageTable != null) {
        productionStorageTable.fnClearTable();
        productionStorageTable.fnDestroy();
        productionStorageTable = null;
    }
    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>产品名称</th><th>库存数量</th><th>预定数量</th><th>可用数量</th><th>详情</th></tr></thead>';
    treeContent += '<tbody>';

    for (var i = 0; i < productionCodeArray.length; i++) {
        treeContent += '<tr>'
        treeContent += '<td>';
        treeContent += (productionCodeArray[i].split(":"))[1];//name
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += stockCountOfProduction[productionCodeArray[i]];
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += orderedCountOfProduction[productionCodeArray[i]];
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += accessCountOfProduction[productionCodeArray[i]];
        treeContent += '</td>';
        treeContent += '<td>';
        var pc = (productionCodeArray[i].split(":"))[0];
//		var insc = (productionCodeArray[i].split(":"))[2];
        treeContent += '<a onclick ="viewProductionStorageDetail(' + "'" + pc + "'" + ')" ';
        treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
        treeContent += '</td>';
        treeContent += '</tr>';
    }

    treeContent += '</tbody>';
    document.getElementById("productionstorage_table").innerHTML = treeContent;
    productionStorageTable = $('#productionstorage_table').dataTable();
}

/*
 * 查看产品库存详细
 * @author minsheng.bai
 * @time 2016-11-8
 */
function viewProductionStorageDetail(productionCode) {
    var treeContent = "";
    $("#productionstoragedetail_dialog").modal('toggle');
    var condition = "productionCode=" + productionCode;
    operationFunc(condition, "queryProductionStorage", function (result) {
        var val = $.parseJSON(result);
        treeContent += '<thead><tr>'
        treeContent += '<th>产品名称</th><th>入库批次</th><th>库存数量</th><th>预定数量</th><th>可用数量</th><th>生产类型</th><th>供应商</th><th>库管员</th><th>货架号</th>';
        treeContent += '</tr></thead>'
        treeContent += '<tbody>';
        for (var i = 0; i < val.rows.length; i++) {
            var date = new Date();
            treeContent += '<tr>'
            treeContent += '<td>';
            treeContent += val.rows[i].productionInfo.productionName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].inStockLot;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].stockCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].orderedStockCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].accessStockCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].productionInStock.productType;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].productionInStock.supplierInfo.supplierName;
            ;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].stockKeeperInfo.userName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].productionInStock.stockBoxCode;
            treeContent += '</td>';
            treeContent += '</tr>';
        }
        treeContent += '</tbody>';
        document.getElementById("productionstoragedetail_table").innerHTML = treeContent;
    });
}

/*
 * 获得产品库存表
 * @author minsheng.bai
 * @time 2016-11-8
 */
function getPartStorageForTable() {
    operationFunc("", "queryPartStorage", function (result) {
        generatePartStorageTable(result)
    });
}
/*
 * 生成部件库存表
 * @author minsheng.bai
 * @time 2016-11-8
 */
var partStorageTable = null
function generatePartStorageTable(result) {
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
    if (partStorageTable != null) {
        partStorageTable.fnClearTable();
        partStorageTable.fnDestroy();
        partStorageTable = null;
    }
    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>部件名称</th><th>库存数量</th><th>预定数量</th><th>可用数量</th><th>详情</th></tr></thead>';
    treeContent += '<tbody>';

    for (var i = 0; i < partCodeArray.length; i++) {
        treeContent += '<tr>'
        treeContent += '<td>';
        treeContent += (partCodeArray[i].split(":"))[1];//name
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += stockCountOfPart[partCodeArray[i]];
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += orderedCountOfPart[partCodeArray[i]];
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += accessCountOfPart[partCodeArray[i]];
        treeContent += '</td>';
        treeContent += '<td>';
        var pc = (partCodeArray[i].split(":"))[0];
//		var insc = (productionCodeArray[i].split(":"))[2];
        treeContent += '<a onclick ="viewPartStorageDetail(' + "'" + pc + "'" + ')" ';
        treeContent += 'class="tooltip-info" data-rel="tooltip" title="查看"><span class="blue"><i class=" icon-eye-open bigger-120"></i>查看</span></a>';
        treeContent += '</td>';
        treeContent += '</tr>';
    }

    treeContent += '</tbody>';
    document.getElementById("partstorage_table").innerHTML = treeContent;
    partStorageTable = $('#partstorage_table').dataTable();
}

/*
 * 查看部件库存详细
 * @author minsheng.bai
 * @time 2016-11-28
 */
function viewPartStorageDetail(partCode) {
    var treeContent = "";
    $("#partstoragedetail_dialog").modal('toggle');
    var condition = "partCode=" + partCode;
    operationFunc(condition, "queryPartStorage", function (result) {
        var val = $.parseJSON(result);
        treeContent += '<thead><tr>'
        treeContent += '<th>部件名称</th><th>入库批次</th><th>库存数量</th><th>预定数量</th><th>可用数量</th><th>生产类型</th><th>供应商</th><th>库管员</th><th>货架号</th>';
        treeContent += '</tr></thead>'
        treeContent += '<tbody>';
        for (var i = 0; i < val.rows.length; i++) {
            var date = new Date();
            treeContent += '<tr>'
            treeContent += '<td>';
            treeContent += val.rows[i].partInfo.partName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].inStockLot;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].stockCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].orderedStockCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].accessStockCount;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].partInStock.productType;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].partInStock.supplierInfo.supplierName;
            ;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].stockKeeperInfo.userName;
            treeContent += '</td>';
            treeContent += '<td>';
            treeContent += val.rows[i].partInStock.stockBoxCode;
            treeContent += '</td>';
            treeContent += '</tr>';
        }
        treeContent += '</tbody>';
        document.getElementById("partstoragedetail_table").innerHTML = treeContent;
    });
}

/*
 * 获取产品入库表
 * @author minsheng.bai
 * @time 2016-11-9
 */
function getProductionInStockForTable() {
    var timeRangeContext = document.getElementById("productioninstock_time_range").innerHTML;
    var timeRange = $.trim(timeRangeContext.split("<")[0]);
    changeProductionInStockByTimeRange(timeRange);
}
/*
 * 根据不同时间段生成产品入库表
 * @author minsheng.bai
 * @time 2016-11-9
 */
function changeProductionInStockByTimeRange(timeRange) {
    document.getElementById("productioninstock_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';
    if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate;
        operationFunc(condition, "queryProductionInStock", function (result) {
            generateProductionInStockFinishTable(result)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd;
        operationFunc(condition, "queryProductionInStock", function (result) {
            generateProductionInStockFinishTable(result)
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd;
        operationFunc(condition, "queryProductionInStock", function (result) {
            generateProductionInStockFinishTable(result)
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd;
        operationFunc(condition, "queryProductionInStock", function (result) {
            generateProductionInStockFinishTable(result)
        });
    }
}
/*
 * 生成产品入库情况
 * @author minsheng.bai
 * @time 2016-11-9
 */
var productionInstockTable = null;
function generateProductionInStockFinishTable(result) {
    var val = $.parseJSON(result);

    if (productionInstockTable != null) {
        productionInstockTable.fnClearTable();
        productionInstockTable.fnDestroy();
        productionInstockTable = null;
    }
    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>产品名称</th><th>入库批次</th><th>入库数量</th><th>单价</th><th>入库日期</th><th>入库类型</th><th>供应商</th><th>部门</th><th>货架号</th><th>库管员</th></tr></thead>';
    treeContent += '<tbody>';

    for (var i = 0; i < val.rows.length; i++) {
        var date = new Date();
        treeContent += '<tr>'
        treeContent += '<td>';
        treeContent += val.rows[i].productionInfo.productionName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].inStockLot;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].inStockCount;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].productionPrice;
        treeContent += '</td>';
        treeContent += '<td>';
        date.setTime(val.rows[i].inStockDate.time);
        if (date.getFullYear() == '1900') {
            treeContent += "---";
        }
        else {
            treeContent += date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].productType;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].supplierInfo.supplierName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].deptInfo.deptName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].stockBoxCode;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].stockKeeperInfo.userName;
        treeContent += '</td>';
        treeContent += '</tr>'
    }
    treeContent += '</tbody>';
    document.getElementById("productioninstock_table").innerHTML = treeContent;
    productionInstockTable = $('#productioninstock_table').dataTable();
}

//////////

/*
 * 获取产品出库表
 * @author minsheng.bai
 * @time 2016-11-9
 */
function getProductionOutStockForTable() {
    var timeRangeContext = document.getElementById("productionoutstock_time_range").innerHTML;
    var timeRange = $.trim(timeRangeContext.split("<")[0]);
    changeProductionOutStockByTimeRange(timeRange);
}
/*
 * 根据不同时间段生成产品出库表
 * @author minsheng.bai
 * @time 2016-11-9
 */
function changeProductionOutStockByTimeRange(timeRange) {
    document.getElementById("productionoutstock_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';
    if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate;
        operationFunc(condition, "queryProductionOutStock", function (result) {
            generateProductionOutStockFinishTable(result)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd;
        operationFunc(condition, "queryProductionOutStock", function (result) {
            generateProductionOutStockFinishTable(result)
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd;
        operationFunc(condition, "queryProductionOutStock", function (result) {
            generateProductionOutStockFinishTable(result)
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd;
        operationFunc(condition, "queryProductionOutStock", function (result) {
            generateProductionOutStockFinishTable(result)
        });
    }
}
/*
 * 生成产品出库情况
 * @author minsheng.bai
 * @time 2016-11-9
 */
var productionOutstockTable = null;
function generateProductionOutStockFinishTable(result) {
    var val = $.parseJSON(result);

    if (productionOutstockTable != null) {
        productionOutstockTable.fnClearTable();
        productionOutstockTable.fnDestroy();
        productionOutstockTable = null;
    }
    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>产品名称</th><th>入库批次</th><th>出库批次</th><th>出库数量</th><th>出库日期</th><th>出库类型</th><th>部门</th><th>货架号</th><th>库管员</th></tr></thead>';
    treeContent += '<tbody>';

    for (var i = 0; i < val.rows.length; i++) {
        var date = new Date();
        treeContent += '<tr>'
        treeContent += '<td>';
        treeContent += val.rows[i].productionInfo.productionName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].inStockLot;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].outStockLot;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].outStockCount;
        treeContent += '</td>';
        treeContent += '<td>';
        date.setTime(val.rows[i].outStockDate.time);
        if (date.getFullYear() == '1900') {
            treeContent += "---";
        }
        else {
            treeContent += date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].outStockType;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].deptInfo.deptName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].stockBoxCode;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].stockKeeperInfo.userName;
        treeContent += '</td>';
        treeContent += '</tr>'
    }
    treeContent += '</tbody>';
    document.getElementById("productionoutstock_table").innerHTML = treeContent;
    productionOutstockTable = $('#productionoutstock_table').dataTable();
}
/////////////////////////////////////////
/*
 * 获取部件入库表
 * @author minsheng.bai
 * @time 2016-11-9
 */
function getPartInStockForTable() {
    var timeRangeContext = document.getElementById("partinstock_time_range").innerHTML;
    var timeRange = $.trim(timeRangeContext.split("<")[0]);
    changePartInStockByTimeRange(timeRange);
}
/*
 * 根据不同时间段生成部件入库表
 * @author minsheng.bai
 * @time 2016-11-9
 */
function changePartInStockByTimeRange(timeRange) {
    document.getElementById("partinstock_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';
    if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate;
        operationFunc(condition, "queryPartInStock", function (result) {
            generatePartInStockFinishTable(result)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd;
        operationFunc(condition, "queryPartInStock", function (result) {
            generatePartInStockFinishTable(result)
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd;
        operationFunc(condition, "queryPartInStock", function (result) {
            generatePartInStockFinishTable(result)
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd;
        operationFunc(condition, "queryPartInStock", function (result) {
            generatePartInStockFinishTable(result)
        });
    }
}
/*
 * 生成部件入库情况
 * @author minsheng.bai
 * @time 2016-11-9
 */
var partInstockTable = null;
function generatePartInStockFinishTable(result) {
    var val = $.parseJSON(result);

    if (partInstockTable != null) {
        partInstockTable.fnClearTable();
        partInstockTable.fnDestroy();
        partInstockTable = null;
    }
    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>部件名称</th><th>入库批次</th><th>入库数量</th><th>单价</th><th>入库日期</th><th>入库类型</th><th>供应商</th><th>部门</th><th>货架号</th><th>库管员</th></tr></thead>';
    treeContent += '<tbody>';

    for (var i = 0; i < val.rows.length; i++) {
        var date = new Date();
        treeContent += '<tr>'
        treeContent += '<td>';
        treeContent += val.rows[i].partInfo.partName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].inStockLot;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].inStockCount;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].partPrice;
        treeContent += '</td>';
        treeContent += '<td>';
        date.setTime(val.rows[i].inStockDate.time);
        if (date.getFullYear() == '1900') {
            treeContent += "---";
        }
        else {
            treeContent += date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].productType;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].supplierInfo.supplierName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].deptInfo.deptName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].stockBoxCode;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].stockKeeperInfo.userName;
        treeContent += '</td>';
        treeContent += '</tr>'
    }
    treeContent += '</tbody>';
    document.getElementById("partinstock_table").innerHTML = treeContent;
    productionInstockTable = $('#partinstock_table').dataTable();
}
//////////

/*
 * 获取部件出库表
 * @author minsheng.bai
 * @time 2016-11-9
 */
function getPartOutStockForTable() {
    var timeRangeContext = document.getElementById("partoutstock_time_range").innerHTML;
    var timeRange = $.trim(timeRangeContext.split("<")[0]);
    changePartOutStockByTimeRange(timeRange);
}
/*
 * 根据不同时间段生成部件出库表
 * @author minsheng.bai
 * @time 2016-11-9
 */
function changePartOutStockByTimeRange(timeRange) {
    document.getElementById("partoutstock_time_range").innerHTML = timeRange + '<i class="icon-angle-down icon-on-right bigger-110"></i>';
    if (timeRange == "本周") {
        var mondayDate = getThisMonday();
        var sundayDate = getThisSunday();
        var condition = "dateConditionStart=" + mondayDate + "&dateConditionEnd=" + sundayDate;
        operationFunc(condition, "queryPartOutStock", function (result) {
            generatePartOutStockFinishTable(result)
        });

    }
    else if (timeRange == "本月") {
        var thisMonthStart = getThisMonthStart();
        var thisMonthEnd = getThisMonthEnd();
        var condition = "dateConditionStart=" + thisMonthStart + "&dateConditionEnd=" + thisMonthEnd;
        operationFunc(condition, "queryPartOutStock", function (result) {
            generatePartOutStockFinishTable(result)
        });

    }
    else if (timeRange == "本季度") {
        var thisQuaterStart = getThisQuaterStart();
        var thisQuaterEnd = getThisQuaterEnd();
        var condition = "dateConditionStart=" + thisQuaterStart + "&dateConditionEnd=" + thisQuaterEnd;
        operationFunc(condition, "queryPartOutStock", function (result) {
            generatePartOutStockFinishTable(result)
        });
    }
    else if (timeRange == "本年") {
        var thisYearStart = getThisYearStart();
        var thisYearEnd = getThisYearEnd();
        var condition = "dateConditionStart=" + thisYearStart + "&dateConditionEnd=" + thisYearEnd;
        operationFunc(condition, "queryPartOutStock", function (result) {
            generatePartOutStockFinishTable(result)
        });
    }
}
/*
 * 生成部件出库情况
 * @author minsheng.bai
 * @time 2016-11-9
 */
var partOutstockTable = null;
function generatePartOutStockFinishTable(result) {
    var val = $.parseJSON(result);

    if (partOutstockTable != null) {
        partOutstockTable.fnClearTable();
        partOutstockTable.fnDestroy();
        partOutstockTable = null;
    }
    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>部件名称</th><th>入库批次</th><th>出库批次</th><th>出库数量</th><th>出库日期</th><th>出库类型</th><th>部门</th><th>货架号</th><th>库管员</th></tr></thead>';
    treeContent += '<tbody>';

    for (var i = 0; i < val.rows.length; i++) {
        var date = new Date();
        treeContent += '<tr>'
        treeContent += '<td>';
        treeContent += val.rows[i].partInfo.partName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].inStockLot;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].outStockLot;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].outStockCount;
        treeContent += '</td>';
        treeContent += '<td>';
        date.setTime(val.rows[i].outStockDate.time);
        if (date.getFullYear() == '1900') {
            treeContent += "---";
        }
        else {
            treeContent += date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].outStockType;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].deptInfo.deptName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].stockBoxCode;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].stockKeeperInfo.userName;
        treeContent += '</td>';
        treeContent += '</tr>'
    }
    treeContent += '</tbody>';
    document.getElementById("partoutstock_table").innerHTML = treeContent;
    partOutstockTable = $('#partoutstock_table').dataTable();
}

////////////////////////
/*
 * 获得产品库存报警情况
 * @author minsheng.bai
 * @time 2016-11-10
 */
function getProductionStorageAlarmForTable() {
    operationFunc("", "queryProductionStorage", function (result) {
        generateProductionStorageAlarmTable(result)
    });
}

/*
 * 生成产品库存报警表
 * @author minsheng.bai
 * @time 2016-11-8
 */
var productionStorageAlarmTable = null
function generateProductionStorageAlarmTable(result) {
    var val = $.parseJSON(result);
    var stockCountOfProduction = new Array();
    var orderedCountOfProduction = new Array();
    var accessCountOfProduction = new Array();
    var productionCodeArray = new Array();
    var productionStorageCountArray = new Array();
    var productionLowAlarmCount = 0;
    var productionHighAlarmCount = 0;
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
            productionStorageCountArray[index] = minStockCount + ":" + maxStockCount;
            index++
        }

    }
    if (productionStorageAlarmTable != null) {
        productionStorageAlarmTable.fnClearTable();
        productionStorageAlarmTable.fnDestroy();
        productionStorageAlarmTable = null;
    }
    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>产品名称</th><th>报警类型</th><th>当前库存量</th><th>库存偏差量</th></tr></thead>';
    treeContent += '<tbody>';

    for (var i = 0; i < productionCodeArray.length; i++) {
        var minStockCount = productionStorageCountArray[i].split(":")[0];
        var maxStockCount = productionStorageCountArray[i].split(":")[1];
        var accessStockCount = accessCountOfProduction[productionCodeArray[i]];
        if (accessStockCount < minStockCount || accessStockCount > maxStockCount) {
            treeContent += '<tr style="color:red">'
            treeContent += '<td>';
            treeContent += (productionCodeArray[i].split(":"))[1];//name
            treeContent += '</td>';
            if (accessStockCount < minStockCount) {
                productionLowAlarmCount++;
                treeContent += '<td>';
                treeContent += "低库存报警";
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += accessCountOfProduction[productionCodeArray[i]];
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += minStockCount - accessCountOfProduction[productionCodeArray[i]];
                treeContent += '</td>';
            } else {
                productionHighAlarmCount++
                treeContent += '<td>';
                treeContent += "高库存报警";
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += accessCountOfProduction[productionCodeArray[i]];
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += accessCountOfProduction[productionCodeArray[i]] - maxStockCount;
                treeContent += '</td>';
            }
            treeContent += '</tr>';
        }
    }
    treeContent += '</tbody>';
    document.getElementById("productionStorageAlarm_table").innerHTML = treeContent;
    productionStorageAlarmTable = $('#productionStorageAlarm_table').dataTable();
    sessionStorage.productionLowAlarmCount = productionLowAlarmCount;
    sessionStorage.productionHighAlarmCount = productionHighAlarmCount;
}

////////////////////////
/*
 * 获得部件库存报警情况
 * @author minsheng.bai
 * @time 2016-11-10
 */
function getPartStorageAlarmForTable() {
    operationFunc("", "queryPartStorage", function (result) {
        generatePartStorageAlarmTable(result)
    });
}

/*
 * 生成部件库存报警表
 * @author minsheng.bai
 * @time 2016-11-8
 */
var partStorageAlarmTable = null
function generatePartStorageAlarmTable(result) {
    var val = $.parseJSON(result);
    var stockCountOfPart = new Array();
    var orderedCountOfPart = new Array();
    var accessCountOfPart = new Array();
    var partCodeArray = new Array();
    var partStorageCountArray = new Array();
    var partLowAlarmCount = 0;
    var partHighAlarmCount = 0;
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
    if (partStorageAlarmTable != null) {
        partStorageAlarmTable.fnClearTable();
        partStorageAlarmTable.fnDestroy();
        partStorageAlarmTable = null;
    }
    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>部件名称</th><th>报警类型</th><th>当前库存量</th><th>库存偏差量</th></tr></thead>';
    treeContent += '<tbody>';

    for (var i = 0; i < partCodeArray.length; i++) {
        var minStockCount = partStorageCountArray[i].split(":")[0];
        var maxStockCount = partStorageCountArray[i].split(":")[1];
        var accessStockCount = accessCountOfPart[partCodeArray[i]];
        if (accessStockCount < minStockCount || accessStockCount > maxStockCount) {
            treeContent += '<tr style="color:red">'
            treeContent += '<td>';
            treeContent += (partCodeArray[i].split(":"))[1];//name
            treeContent += '</td>';
            if (accessStockCount < minStockCount) {
                partLowAlarmCount++;
                treeContent += '<td>';
                treeContent += "低库存报警";
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += accessCountOfPart[partCodeArray[i]];
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += minStockCount - accessCountOfPart[partCodeArray[i]];
                treeContent += '</td>';
            } else {
                partHighAlarmCount++;
                treeContent += '<td>';
                treeContent += "高库存报警";
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += accessCountOfPart[partCodeArray[i]];
                treeContent += '</td>';
                treeContent += '<td>';
                treeContent += accessCountOfPart[partCodeArray[i]] - maxStockCount;
                treeContent += '</td>';
            }
            treeContent += '</tr>';
        }
    }
    treeContent += '</tbody>';
    document.getElementById("partStorageAlarm_table").innerHTML = treeContent;
    partStorageAlarmTable = $('#partStorageAlarm_table').dataTable();
    sessionStorage.partLowAlarmCount = partLowAlarmCount;
    sessionStorage.partHighAlarmCount = partHighAlarmCount;
}
////////////////////////////////////////////////////////

function getSaleServiceFinishForColumn() {

    var startDate = getThisYearStart();
    var endDate = getThisYearEnd();
    var condition = "dateConditionStart=" + startDate + "&dateConditionEnd=" + endDate;

    var finishCountArray = new Array();
    var unfinishCountArray = new Array();
    var xAxisName = new Array();
    operationFunc(condition, "queryAfterService", function (result) {
        var val = $.parseJSON(result);

        var date = new Date();
        var month = date.getMonth() + 1;
        for (var i = 1; i <= month; i++) {
            var finishCount = 0;
            var unfinishCount = 0;
            var startDtStr = date.getFullYear() + "-" + i + "-01";
            var endDtStr = date.getFullYear() + "-" + i + "-31";
            var startDt = new Date(Date.parse(startDtStr.replace(/-/g, "/")));
            var endDt = new Date(Date.parse(endDtStr.replace(/-/g, "/")));
            for (var j = 0; j < val.rows.length; j++) {
                var readyDateStr = val.rows[j].registeDate;
                var readyDateStrSplit = readyDateStr.split(" ")[0];//火狐浏览器中不能够用2017-1-1 00:00:00.0的格式进行parse
                var readyDt = new Date(Date.parse(readyDateStrSplit.replace(/-/g, "/")));
                if (readyDt.getTime() >= startDt.getTime() && readyDt.getTime() <= endDt.getTime()) {
                    if (val.rows[j].isFinish) {
                        finishCount++;
                    } else {
                        unfinishCount++;
                    }
                }
            }
            finishCountArray[i - 1] = finishCount;
            unfinishCountArray[i - 1] = unfinishCount;
            xAxisName[i - 1] = i + "月";
        }
    });

    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['累计未完成个数', '本月完成个数']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            orient: 'vertical',
            x: 'right',
            y: 'top',
            padding: 5,
            itemGap: 10,
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        color: ['rgb(221,88,80)', 'rgb(75,139,201)'],
        xAxis: [
            {
                type: 'category',
                data: xAxisName,//['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                axisLabel: {
                    interval: 0,
                    rotate: 0,
                    margin: 2
                    //textStyle:{
                    //    fontWeight:"bolder",
                    //   color:"",
                    //}
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '累计未完成个数',
                type: 'bar',
                data: unfinishCountArray//[10, 12, 15, 4, 2, 7, 5,12, 15, 4, 2, 7]
            },
            {
                name: '本月完成个数',
                type: 'bar',
                data: finishCountArray//[5, 12, 9, 6, 10, 11, 7, 9, 6, 10, 11, 7]
            }
        ]
    };

    //var myChart = echarts.init(document.getElementById('afterSaleInfo_pie'));
    var myChart = echarts.init(document.getElementById('department_borrow_pie'));
    myChart.setOption(option);
}


//营具情况统计

function getToolColumn() {
    var startDate = getThisYearStart();
    var endDate = getThisYearEnd();
    var condition = "dateConditionStart=" + startDate + "&dateConditionEnd=" + endDate;

    var finishCountArray = new Array();
    var unfinishCountArray = new Array();
    var xAxisName = new Array();
    operationFunc(condition, "findDeptTool", function (result) {
        var val = $.parseJSON(result);

        var date = new Date();
        var month = date.getMonth() + 1;
        for (var i = 0; i <=val.list.length; i++) {
            var col1 = val.list[i].col1;
            var col2 = val.list[i].col2;

            finishCountArray[i] = col2;
            unfinishCountArray[i] = col1;
            xAxisName[i] = val.list[i].name;
        }
    });

    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['工位椅', '电脑桌']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            orient: 'vertical',
            x: 'right',
            y: 'top',
            padding: 5,
            itemGap: 10,
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        color: ['rgb(221,88,80)', 'rgb(75,139,201)'],
        xAxis: [
            {
                type: 'category',
                data: xAxisName,//['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                axisLabel: {
                    interval: 0,
                    rotate: 0,
                    margin: 2
                    //textStyle:{
                    //    fontWeight:"bolder",
                    //   color:"",
                    //}
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '工位椅',
                type: 'bar',
                data: unfinishCountArray//[10, 12, 15, 4, 2, 7, 5,12, 15, 4, 2, 7]
            },
            {
                name: '电脑桌',
                type: 'bar',
                data: finishCountArray//[5, 12, 9, 6, 10, 11, 7, 9, 6, 10, 11, 7]
            }
        ]
    };

    //var myChart = echarts.init(document.getElementById('afterSaleInfo_pie'));
    var myChart = echarts.init(document.getElementById('tools_pie'));
    myChart.setOption(option);
}


//部门借用个数
function getDepartMentBorrowCountForColumn(deptCode) {

    var startDate = getThisYearStart();
    var endDate = getThisYearEnd();
    var condition = "dateConditionStart=" + startDate + "&dateConditionEnd=" + endDate+ "&deptCode=" + deptCode;

    var finishCountArray = new Array();
    var unfinishCountArray = new Array();
    var xAxisName = new Array();
    operationFunc(condition, "queryDepartMentBorrowCount", function (result) {
        var val = $.parseJSON(result);

        var date = new Date();
        var month = date.getMonth() + 1;
        for (var i = 1; i <= month; i++) {
            var finishCount = 0;
            var unfinishCount = 0;
            var startDtStr = date.getFullYear() + "-" + i + "-01";
            var endDtStr = date.getFullYear() + "-" + i + "-31";
            var startDt = new Date(Date.parse(startDtStr.replace(/-/g, "/")));
            var endDt = new Date(Date.parse(endDtStr.replace(/-/g, "/")));
            for (var j = 0; j < val.rows.length; j++) {
                var readyDateStr = val.rows[j].registeDate;
                var readyDateStrSplit = readyDateStr.split(" ")[0];//火狐浏览器中不能够用2017-1-1 00:00:00.0的格式进行parse
                var readyDt = new Date(Date.parse(readyDateStrSplit.replace(/-/g, "/")));
                if (readyDt.getTime() >= startDt.getTime() && readyDt.getTime() <= endDt.getTime()) {
                    if (val.rows[j].isFinish) {
                        finishCount++;
                    } else {
                        unfinishCount++;
                    }
                }
            }
            finishCountArray[i - 1] = finishCount;
            unfinishCountArray[i - 1] = unfinishCount;
            xAxisName[i - 1] = i + "月";
        }
    });

    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['累计未完成个数', '本月完成个数']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            orient: 'vertical',
            x: 'right',
            y: 'top',
            padding: 5,
            itemGap: 10,
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        color: ['rgb(221,88,80)', 'rgb(75,139,201)'],
        xAxis: [
            {
                type: 'category',
                data: xAxisName,//['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                axisLabel: {
                    interval: 0,
                    rotate: 0,
                    margin: 2
                    //textStyle:{
                    //    fontWeight:"bolder",
                    //   color:"",
                    //}
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '累计未完成个数',
                type: 'bar',
                data: unfinishCountArray//[10, 12, 15, 4, 2, 7, 5,12, 15, 4, 2, 7]
            },
            {
                name: '本月完成个数',
                type: 'bar',
                data: finishCountArray//[5, 12, 9, 6, 10, 11, 7, 9, 6, 10, 11, 7]
            }
        ]
    };

    //var myChart = echarts.init(document.getElementById('afterSaleInfo_pie'));
    var myChart = echarts.init(document.getElementById('department_borrow_pie'));
    myChart.setOption(option);
}















function getProductonProblemInfoForColumn() {

    var xAxisName = new Array();
    var times = new Array();
    operationFunc("", "getProductionProblemTimes", function (result) {
        var val = $.parseJSON(result);
        for (var i = 0; i < val.result.times.length; i++) {
            xAxisName[i] = (val.result.productionName[i].split(":"))[1];
            times[i] = val.result.times[i];
        }

    });
    if (times.length <= 0) {
        return;
    }
    var temp = 0;
    var xName = "";
    for (var i = 0; i < times.length; i++) {
        for (var j = 0; j < times.length - i; j++) {
            if (times[j] < times[j + 1]) {
                temp = times[j + 1];
                xName = xAxisName[j + 1];
                times[j + 1] = times[j];
                xAxisName[j + 1] = xAxisName[j];
                times[j] = temp;
                xAxisName[j] = xName;
            }
        }
    }
    var xAxisNameNew = new Array();
    var timesNew = new Array();
    if (times.length > 10) {
        for (var i = 0; i < 10; i++) {
            xAxisNameNew[i] = xAxisName[i];
            timesNew[i] = times[i];
        }
    }
    else {
        for (var i = 0; i < times.length; i++) {
            xAxisNameNew[i] = xAxisName[i];
            timesNew[i] = times[i];
        }
    }
    var option = {
        title: {
            text: '次数'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['故障次数']
        },
        toolbox: {
            orient: 'vertical',
            x: 'right',
            y: 'top',
            padding: 5,
            itemGap: 10,
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        color: ['rgb(255,159,0)'],
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: xAxisNameNew
            }
        ],
        axisLabel: {
            interval: 0
        },
        yAxis: [
            {
                type: 'value'
            }
        ],
        dataZoom: [
            {
                show: true,
                start: 0,
                end: 100,
                handleSize: 8
            },
            {
                type: 'inside',
                start: 94,
                end: 100
            },
            {
                show: true,
                yAxisIndex: 0,
                filterMode: 'empty',
                width: 12,
                height: '70%',
                handleSize: 8,
                showDataShadow: false,
                left: '93%'
            }
        ],
        series: [
            {
                name: '故障次数',
                type: 'bar',
                data: timesNew,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };

    var myChart = echarts.init(document.getElementById('productionProblemInfo_pie'));
    myChart.setOption(option);

    myChart.on('click', function clickFunc(param) {

        $("#productionProblem_dialog").modal('toggle');
        var productionName = param.name;
        var productions = findProducts();
        var val = productions.split(";");
        var productionCode = null;
        for (var i = 0; i < val.length; i++) {
            var codeAndName = val[i].split(":");
            if (codeAndName[1] == productionName) {
                productionCode = codeAndName[0];
            }
        }

        var condition = "oneProductionCode=" + productionCode;
        operationFunc(condition, "queryAfterServiceByOneProductionCode", function (result) {
            generateProductionProblemDetail(result, productionName, productionCode);
        });
    });
}
function generateProductionProblemDetail(result, productionName, productionCode) {
    var val = $.parseJSON(result);
    var treeContent = "";

    treeContent += '<thead><tr>'
    treeContent += '<th>产品编号</th><th>产品名称</th><th>入库批次</th><th>生产类型</th><th>供应商名称</th><th>项目批次</th><th>责任人</th>';
    treeContent += '<tbody>';
    for (var i = 0; i < val.rows.length; i++) {
        treeContent += '<tr>'
        treeContent += '<td>';
        if(productionCode.length >= 32)
        {
            treeContent += "内部编号";
        }else{
            treeContent += productionCode;
        }
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += productionName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].inStockLot;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].productType;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += getSupplierName(val.rows[i].supplierCode);
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].productionLot.productionLotName;
        treeContent += '</td>';
        treeContent += '<td>';
        treeContent += val.rows[i].responsorInfo.userName;
        treeContent += '</td>';
        treeContent += '</tr>';
    }

    treeContent += '</tbody>';
    document.getElementById("productionProblem_table").innerHTML = treeContent;
}
function getSupplierName(code)
{
    var suppliers = findSuppliers();
    var val = suppliers.split(";");
    var name = "";
    for (var i = 0; i < val.length; i++) {
        var codeAndName = val[i].split(":");
        if (codeAndName[0] == code) {
            name = codeAndName[1];
        }
    }
    return name;
}
function getNodification(userCode) {
    //根据登录人的名字来查询该登录人是否是某一个未完成的项目批次的责任人
    var condition = "responsorCode=" + userCode;
    var lotVal = null;
    operationFunc(condition, "getUnFinishProductionLot", function (result) {
        lotVal = $.parseJSON(result);
    });

    operationFunc(condition, "getUnFinishProductionPlan", function (result) {
        var planVal = $.parseJSON(result);
        var allCount = lotVal.unFinishCount + planVal.unFinishCount;
        var treeContent = "";

        treeContent += '<li class="dropdown-header"><i class="icon-warning-sign"></i>'
        treeContent += allCount + '个警告</li>';
        for (var i = 0; i < lotVal.rows.length; i++) {
            treeContent += '<li><a onclick="changePageToProductionLot()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-pink icon-comment"></i>';
            treeContent += '项目批次:"' + lotVal.rows[i].productionLotName + '"未完成';
            treeContent += '</span></div></a></li>';
        }
        for (var i = 0; i < planVal.rows.length; i++) {
            treeContent += '<li><a onclick="changePageToProductionPlan()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-pink icon-comment"></i>';
            treeContent += '生产计划:"' + planVal.rows[i].productionPlanName + '"未完成';
            treeContent += '</span></div></a></li>';
        }
        parent.document.getElementById("notificationCount").innerHTML = allCount;
        parent.document.getElementById("notificationInfo").innerHTML = treeContent;

    });
}
function getMessage(userCode) {
    //根据登录人的名字来查询该登录人已经齐套的生产计划
    var condition = "responsorCode=" + userCode;
    operationFunc(condition, "getHaveReadyProductionPlan", function (result) {
        var planVal = $.parseJSON(result);
        var content = "";
        var content1 = "";
        var content2 = "";
        var count = 0;
        for (var i = 0; i < planVal.rows.length; i++) {
            var readyDateStr = planVal.rows[i].readyDate;
            var readyDateStrSplit = readyDateStr.split(" ")[0];//火狐浏览器中不能够用2017-1-1 00:00:00.0的格式进行parse
            var readyDate = new Date(Date.parse(readyDateStrSplit.replace(/-/g, "/")));
            //获取当前的时间
            var currDate = new Date();
            //获取30天前的时间
            var before30DateTime = currDate.getTime() - 30 * 24 * 3600 * 1000;
            var before30Date = new Date(before30DateTime);

            var timecount = readyDate.getTime();
            if (readyDate.getTime() > before30DateTime && readyDate.getTime() < currDate.getTime()) {
                count++;
                content2 += '<li><a onclick="changePageToProductionReady()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-info icon-twitter"></i>';
                content2 += '生产计划:"' + planVal.rows[i].productionPlanName + '"已齐套';
                content2 += '</span></div></a></li>';
            }

        }
        content1 += '<li class="dropdown-header"><i class="icon-envelope-alt"></i>'
        content1 += count + '个信息</li>';
        content = content1 + content2;
        parent.document.getElementById("messageCount").innerHTML = count;
        parent.document.getElementById("messageInfo").innerHTML = content;

    });
}
function changePageToProductionLot() {
    changePage("项目批次完成情况");
}
function changePageToProductionPlan() {
    changePage("产品生产计划完成情况");
}
function changePageToProductionReady() {
    changePage("产品生产计划齐套情况");
}

function getNodificationForStockKeeper() {
    var allCount = 0;
    var productionLowAlarmCount = sessionStorage.productionLowAlarmCount;
    var productionHighAlarmCount = sessionStorage.productionHighAlarmCount;
    var partLowAlarmCount = sessionStorage.partLowAlarmCount;
    var partHighAlarmCount = sessionStorage.partHighAlarmCount;
    allCount = parseInt(productionLowAlarmCount) + parseInt(productionHighAlarmCount) + parseInt(partLowAlarmCount) + parseInt(partHighAlarmCount);
    var content = "";

    content += '<li class="dropdown-header"><i class="icon-warning-sign"></i>'
    content += allCount + '个警告</li>';

    if (productionLowAlarmCount != 0) {
        content += '<li><a onclick="changePageToProductionAlarm()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-pink icon-comment"></i>';
        content += '产品库有低报警</span>';
        content += '<span class="pull-right badge badge-info">' + productionLowAlarmCount + '个</span>';
        content += '</div></a></li>';
    }
    if (productionHighAlarmCount != 0) {
        content += '<li><a onclick="changePageToProductionAlarm()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-pink icon-comment"></i>';
        content += '产品库有高报警</span>';
        content += '<span class="pull-right badge badge-info">' + productionHighAlarmCount + '个</span>';
        content += '</div></a></li>';
    }
    if (partLowAlarmCount != 0) {
        content += '<li><a onclick="changePageToPartAlarm()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-pink icon-comment"></i>';
        content += '部件库有低报警</span>';
        content += '<span class="pull-right badge badge-info">' + partLowAlarmCount + '个</span>';
        content += '</div></a></li>';
    }
    if (partHighAlarmCount != 0) {
        content += '<li><a onclick="changePageToPartAlarm()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-pink icon-comment"></i>';
        content += '部件库有高报警</span>';
        content += '<span class="pull-right badge badge-info">' + partHighAlarmCount + '个</span>';
        content += '</div></a></li>';
    }

    parent.document.getElementById("notificationCount").innerHTML = allCount;
    parent.document.getElementById("notificationInfo").innerHTML = content;
}
function getMessageForStockKeeper() {
//获取未完成的产品入库申请单
    var condition = "isFinishInStock=false";
    var productionInStockVal = null;
    var productionOutStockVal = null;
    var partInStockVal = null;
    var partOutStockVal = null;
    var productionArrangeVal = null;
    var partArrangeVal = null;
    operationFunc(condition, "queryProductionInStockApply", function (result) {
        productionInStockVal = $.parseJSON(result);
    });
//获取未完成的产品出库申请单
    condition = "isFinish=false";
    operationFunc(condition, "queryProductionOutStockApply", function (result) {
        productionOutStockVal = $.parseJSON(result);
    });
//获取未完成的部件入库申请单
    condition = "isFinishInStock=false";
    operationFunc(condition, "queryPartInStockApply", function (result) {
        partInStockVal = $.parseJSON(result);
    });
//获取未完成的部件出库申请单
    condition = "isFinish=false";
    operationFunc(condition, "queryPartOutStockApply", function (result) {
        partOutStockVal = $.parseJSON(result);
    });

    //获取未完成的产品分配
    operationFunc("", "queryUnFinishProductionArrange", function (result) {
        productionArrangeVal = $.parseJSON(result);
    });

    //获取未完成的部件分配
    operationFunc("", "queryUnFinishPartArrange", function (result) {
        partArrangeVal = $.parseJSON(result);
    });

    var count = 0;
    var productionInStockCount = 0;
    var productionOutStockCount = 0;
    var partInStockCount = 0;
    var partOutStockCount = 0;
    var productionArrangeCount = 0;
    var partArrangeCount = 0;
    if (productionInStockVal != null) {
        count += productionInStockVal.rows.length;
        productionInStockCount = productionInStockVal.rows.length;
    }
    if (productionOutStockVal != null) {
        count += productionOutStockVal.rows.length;
        productionOutStockCount = productionOutStockVal.rows.length;
    }
    if (partInStockVal != null) {
        count += partInStockVal.rows.length;
        partInStockCount = partInStockVal.rows.length;
    }
    if (partOutStockVal != null) {
        count += partOutStockVal.rows.length;
        partOutStockCount = partOutStockVal.rows.length;
    }
    if (productionArrangeVal != null) {
        count += productionArrangeVal.rows.length;
        productionArrangeCount = productionArrangeVal.rows.length;
    }
    if (partArrangeVal != null) {
        count += partArrangeVal.rows.length;
        partArrangeCount = partArrangeVal.rows.length;
    }

    var content = "";
    content += '<li class="dropdown-header"><i class="icon-envelope-alt"></i>'
    content += count + '个信息</li>';

    if (productionInStockCount != 0) {
        content += '<li><a onclick="changePageToProductionInStock()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-info icon-twitter"></i>';
        content += '产品入库申请:</span>';
        content += '<span class="pull-right badge badge-info">' + productionInStockCount + '个</span>';
        content += '</div></a></li>';
    }

    if (productionOutStockCount != 0) {
        content += '<li><a onclick="changePageToProductionOutStock()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-info icon-twitter"></i>';
        content += '产品出库申请:</span>';
        content += '<span class="pull-right badge badge-info">' + productionOutStockCount + '个</span>';
        content += '</div></a></li>';
    }

    if (partInStockCount != 0) {
        content += '<li><a onclick="changePageToPartInStock()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-info icon-twitter"></i>';
        content += '部件入库申请:</span>';
        content += '<span class="pull-right badge badge-info">' + partInStockCount + '个</span>';
        content += '</div></a></li>';
    }

    if (partOutStockCount != 0) {
        content += '<li><a onclick="changePageToPartOutStock()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-info icon-twitter"></i>';
        content += '部件出库申请:</span>';
        content += '<span class="pull-right badge badge-info">' + partOutStockCount + '个</span>';
        content += '</div></a></li>';
    }

    if (productionArrangeCount != 0) {
        content += '<li><a onclick="changePageToProductionOutStock()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-info icon-twitter"></i>';
        content += '产品分配申请:</span>';
        content += '<span class="pull-right badge badge-info">' + productionArrangeCount + '个</span>';
        content += '</div></a></li>';
    }

    if (partArrangeCount != 0) {
        content += '<li><a onclick="changePageToPartOutStock()"><div class="clearfix"><span class="pull-left"><i class="btn btn-xs no-hover btn-info icon-twitter"></i>';
        content += '部件分配申请:</span>';
        content += '<span class="pull-right badge badge-info">' + partArrangeCount + '个</span>';
        content += '</div></a></li>';
    }

    parent.document.getElementById("messageCount").innerHTML = count;
    parent.document.getElementById("messageInfo").innerHTML = content;
}

function changePageToProductionAlarm() {
    changePage("产品库存报警查询");
}

function changePageToPartAlarm() {
    changePage("部件库存报警查询");
}

function changePageToProductionInStock() {
    changePage("产品入库");
}
function changePageToProductionOutStock() {
    changePage("产品出库");
}
function changePageToPartInStock() {
    changePage("部件入库");
}
function changePageToPartOutStock() {
    changePage("部件出库");
}