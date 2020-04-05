
    function afterShowInfo(resultStr,itemName)
    {
        var title = "";
        var arr = resultStr.split(":");
        var successFunction = "success";
        var filedFunction = "error"
        var msg = "";
        if (arr.length > 1) {
            msg = arr[1];
        }
        var title = "";
        toastr.options = {
            closeButton: false,
            debug: false,
            progressBar: false,
            positionClass: "toast-center-center",
            onclick: null
        };
        toastr.options.showDuration = "1000";
        toastr.options.hideDuration = "1000";
        toastr.options.timeOut = 2000;
        toastr.options.extendedTimeOut = "1000";
        toastr.options.showEasing = "swing";
        toastr.options.hideEasing = "linear";
        toastr.options.showMethod = "fadeIn";
        toastr.options.hideMethod = "fadeOut";

        if(arr[0] == "failed") {
            toastr[filedFunction](msg, title);
        }

        else
        {
            toastr[successFunction](msg, title);
        }
        if(null != itemName){
            //window.parent.getUrl(itemName);
            parent. showNewTab(itemName,itemurl);
        }
        if(null != itemName){
            //window.parent.getUrl(itemName);
            parent. showNewTab("单位配置","/getdwpz");
        }

        return [true,''];
    }
    function operationFuncAsync(parameter, operationPath, successCallbackFunc, errorCallbackFunc) {
        $.ajax({
            async: false,
            type: 'get',
            url: operationPath,
            data: parameter,
            dataType: 'json',
            timeout: 1000,
            cache: false,
//            beforeSend: LoadFunction, //加载执行方法
            error: function (result) {
                errorCallbackFunc(result);
            },  //错误执行方法
            success: function (result) {
                successCallbackFunc(result);
            },//成功执行方法
        })
    }
    function afterShowTips(resultStr,itemName)
    {
        var title = "";
        var arr = resultStr.split(":");
        var successFunction = "success";
        var failedFunction = "error"
        var msg = "";
        if (arr.length > 1) {
            msg = arr[1];
        }
        var title = "";
        toastr.options = {
            closeButton: false,
            debug: false,
            progressBar: false,
            positionClass: "toast-center-center",
            onclick: null
        };
        toastr.options.showDuration = "1000";
        toastr.options.hideDuration = "1000";
        toastr.options.timeOut = 2000;
        toastr.options.extendedTimeOut = "1000";
        toastr.options.showEasing = "swing";
        toastr.options.hideEasing = "linear";
        toastr.options.showMethod = "fadeIn";
        toastr.options.hideMethod = "fadeOut";

        if(arr[0] == "failed") {
            toastr[failedFunction](msg, title);
        }
        else
        {
            toastr[successFunction](msg, title);

        }
        return [true,''];
    }
    function operationFunction(parameter, operationPath, successCallbackFunc, errorCallbackFunc) {
        $.ajax({
            async: false,
            type: 'get',
            url: operationPath,
            data: parameter,
            dataType: 'json',
            timeout: 1000,
            cache: false,
            beforeSend:function(){},
//            beforeSend: LoadFunction, //加载执行方法
            error: function (result) {
                errorCallbackFunc(result);
            },  //错误执行方法
            success: function (result) {
                successCallbackFunc(result);
            },//成功执行方法
//            complete:function(XMLHttpRequest,textStatus){
//
//            },
        })
    }