function getExcelFileName(title) {
    var d = new Date();
    var curYear = d.getFullYear();
    var curMonth = "" + (d.getMonth() + 1);
    var curDate = "" + d.getDate();
    var curHour = "" + d.getHours();
    var curMinute = "" + d.getMinutes();
    var curSecond = "" + d.getSeconds();
    if (curMonth.length == 1) {
        curMonth = "0" + curMonth;
    }
    if (curDate.length == 1) {
        curDate = "0" + curDate;
    }
    if (curHour.length == 1) {
        curHour = "0" + curHour;
    }
    if (curMinute.length == 1) {
        curMinute = "0" + curMinute;
    }
    if (curSecond.length == 1) {
        curSecond = "0" + curSecond;
    }
    var fileName = title + "_" + curYear + curMonth + curDate + "_"
        + curHour + curMinute + curSecond;
    //alert(fileName);
    return fileName;
}

function getAllData(Url, Par) {
    var url = Url;
    var paras = "";
    var results = "";
    var data = "";

    if (Par != undefined) {
        paras = Par;
    }
    operationFunc(paras, url, function (result) {
        data = $.parseJSON(result);
    });

    return data;
}

function getSingleData(Url,code1,password, Par) {
    var url = Url;
    var code = code1;
    var paras = "code="+code+"&password="+password;

    var results = "";
    var data = "";

    if (Par != undefined) {
        paras = Par;
    }
    operationFunc(paras, url, function (result) {
        data = $.parseJSON(result);
    });

    return data;
}




function exportExcel(title, TitleLine) {
    var url = 'export' + title + 'Excel';
    var fileName = getExcelFileName(title);

    var data = getAllData(url);
    if(title == "UserInfo")
    {
        var newData = new Array();
        for (var i = 0; i < data.length; i++) {
            newData[i] = new Array();
            for (var j = 0; j < data[i].length; j++) {
                if (j == 4) {
                    newData[i][j] = data[i][j].deptName;
                } else {
                    newData[i][j] = data[i][j];
                }
            }
        }
        newData.unshift(TitleLine);


        var ranges = [];
        export_table_to_excel(newData, ranges, title, fileName);
    }else{
        data.unshift(TitleLine);
        var ranges = [];
        export_table_to_excel(data, ranges, title, fileName);
    }


}
//GTG
function exportExcelSingle(title,code,password,TitleLine) {
    var url = 'export' + title + 'Excel';
    var fileName = getExcelFileName(title);
    var data = getSingleData(url,code,password);

    if(title == "UserInfo")
    {
        var newData = new Array();
        for (var i = 0; i < data.length; i++) {
            newData[i] = new Array();
            for (var j = 0; j < data[i].length; j++) {
                if (j == 4) {
                    newData[i][j] = data[i][j].deptName;
                } else {
                    newData[i][j] = data[i][j];
                }
            }
        }
        newData.unshift(TitleLine);


        var ranges = [];
        export_table_to_excel(newData, ranges, title, fileName);
    }else{
        data.unshift(TitleLine);
        var ranges = [];
        export_table_to_excel(data, ranges, title, fileName);
    }


}
