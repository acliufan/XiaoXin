<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/1/27 0027
  Time: 15:48
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>- Smile Zhang</title>
    <script src="/js/jquery-2.0.3.min.js"></script>
    <link type="text/css" rel="stylesheet" href="/js/love/default.css">
    <script type="text/javascript" src="/js/CommonPart/CommonUtil.js"></script>

    <%--回调函数的样式afterShow--开始--%>
    <link type="text/css" rel="stylesheet" href="/js/Hplus-v/css/plugins/toastr/toastr.min.css">
    <script type="text/javascript" src="/js/Hplus-v/js/plugins/toastr/toastr.min.js"></script>
    <script type="text/javascript" src="/js/Hplus-v/js/content.js"></script>
    <%--回调函数的样式afterShow--结束--%>
    <script type="text/javascript" src="/js/love/jquery.min.js"></script>
    <script type="text/javascript" src="/js/love/jscex.min.js"></script>
    <script type="text/javascript" src="/js/love/jscex-parser.js"></script>
    <script type="text/javascript" src="/js/love/jscex-jit.js"></script>
    <script type="text/javascript" src="/js/love/jscex-builderbase.min.js"></script>
    <script type="text/javascript" src="/js/love/jscex-async.min.js"></script>
    <script type="text/javascript" src="/js/love/jscex-async-powerpack.min.js"></script>
    <script type="text/javascript" src="/js/love/functions.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/love/love.js" charset="utf-8"></script>
    <style type="text/css" media=screen>
        body{TEXT-ALIGN: center;}
        #myText{
            /*overflow-y: scroll;*/
            /*overflow-x: hidden;*/
            overflow-y: hidden;
            width:300px;
            height:300px;
            margin:0 auto;
        }
    </style>
</head>
<body>
<div class="center">
    <br/>
    <div style="width:100%;height:100%;display:inline;">
        <%--<span class="say" style="color:deepskyblue">${userName}</span>--%>
        <%--<br/>--%>
        <span class="say" style="color:deeppink">请输入小猪佩奇的姓名，</span>
        <span style="color:deeppink">我告诉你她的信息</span>
            <br/>
        <input id="submitArea"/>
        <button onClick="submitName()">确定</button>
        <span style="margin-left:15px;display:none;" id="callbackShow"></span>
        <br/>
        <textarea id="myText" style="margin-top:10px" placeholder="这里是佩奇的信息"  readonly  disabled>
    </textarea>
    </div>
</div>

<script>
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
    function submitName() {
        debugger
        $("#myText").text("");
        var myArray=new Array("110","120","130");
        var myString=myArray.join(",");
        var myStringTwo=myString.split("0");
        var url ="SmileSubmit";
        var name=$("#submitArea").val();
        var parameter="submitArea="+name;
        operationFuncAsync(parameter,url,function (result) {
            debugger
            $("#callbackShow").attr("style","display:inline;color:blue");
            var callback=hanlderTips(result);
            $("#code").show().typewriter();
            $("#callbackShow").text(callback);
            setTimeout(function () {
                $("#callbackShow").attr("style","display:none");
            },2000);
            $("#myText").text(result.callback[0]);
        },function (result) {
            $("#callbackShow").attr("style","display:inline;color:red");
            var callback=hanlderTips(result);
            $("#callbackShow").text(callback);
            setTimeout(function () {
                $("#callbackShow").attr("style","display:none");
            },2000);
            $("#myText").text(result.callback);
        })
    }
function hanlderTips(result){
    var tips=result.result;
    afterShowInfo(tips);
    if(tips.split(":")[0]=="success"){
        return tips.split(":")[1];
    }
    return tips.split(":")[1];
}
</script>
</body>
</html>
