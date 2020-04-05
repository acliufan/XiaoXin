<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/2/27 0027
  Time: 21:49
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <script type="text/javascript" src="/js/jquery-2.0.3.min.js"></script>
    <style>
        ul li{
            list-style: none;
        }

        #chatSpace {
            background: url('/img/chatBg.jpeg') no-repeat center center fixed;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;//这条一定要
        }
    </style>
</head>
<body>
欢迎,<span id="yourName" style="text-decoration-style: solid"></span>
<br/>
<input id="subject" type="text" placeholder="请输入要发送的人名字"/>
<hr/>
<textarea id="text" name="text" placeholder="请输入聊天内容"></textarea>
<button id="sendText" onclick="send()">发送消息</button>
<hr/>
<button onclick="closeWebSocket()">关闭WebSocket连接</button>
<button onclick="openWebsocket()">打开WebSocket连接</button>
<button onclick="removeLogs()">清空日志</button>
<hr/>
<div id="chatSpace" style="height: 400px;overflow-y: auto">
    <ul id="message" class="marquee" style="width: auto">
    </ul>
</div>
<script>
    var websocket = null;
    var userName="${name}";
    $("#yourName").text(userName);
    $(function () {
        reconnectWebsocket();
    })
    function openWebsocket() {
        websocket.close();
        reconnectWebsocket();
    }
    function reconnectWebsocket() {
//        var websocket = null;
        //判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
            var name = window.location.host;
            websocket = new WebSocket("ws://" + name + "/WebSocket/chat/"+userName);
            //连接发生错误的回调方法
            websocket.onerror = function (evt) {
                setMessageInnerHTML(getCurrentTime()+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+"<span style=\"color:black\">WebSocket连接发生错误</span>");
                setTimeout(function () {
                    reconnectWebsocket();
                }, 5000);//每隔5s去重连
            };
            //连接成功建立的回调方法
            websocket.onopen = function (evt) {
//                setMessageInnerHTML(getCurrentTime()+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+"<span style=\"color:lawngreen\">WebSocket连接成功</span>");
//                //连接产生后，开始定时器10s，实现心跳探测
                alert("websocket建立成功");
//                heartCheck.start();
            }

            //接收到消息的回调方法
            websocket.onmessage = function (event) {
                //发完消息后，开始定时器10s，心跳探测
                $("input[name='text']").val("").focus();
                if ((event.data).indexOf("heartBeat") != -1) {
                    //服务端返回心跳成功响应
                    console.log(event.data);
                }else{
                    var showedMessages;
                    var sendName;
                    var result = JSON.parse(event.data);
                    if (typeof(result.msg) != 'undefined') {
                        showedMessages = result.msg;
                    }
                    if (typeof(result.name) != 'undefined') {
                        sendName = result.name;
                    }
                    debugger
                    if (sendName == "系统提示") {
                        alert("对方不在线");
                    } else {
                        if (sendName != userName) {
                            left_setMessageInnerHTML(sendName + ":" + "<span style=\"color:black;\">" + showedMessages + "</span>");
                        } else {
                            right_setMessageInnerHTML(sendName + ":" + "<span style=\"color:black;\">" + showedMessages + "</span>");
                        }
                    }
                }
//                else {
//                    setMessageInnerHTML(getCurrentTime() + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + "<span style=\"color:#1034fc\">" + event.data);
//                }
//                heartCheck.reset();
            }

            //连接关闭的回调方法
            websocket.onclose = function (evt) {
//                setMessageInnerHTML(getCurrentTime()+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+"WebSocket连接关闭");
                alert("WebSocket连接关闭");
            }


            //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = function () {
                closeWebSocket();
            }
        } else {
            alert(getCurrentTime()+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+'当前浏览器 Not support websocket');
        }
    }
    //发送消息给后端
    function send() {
        var message = new Object();
        var infos= $("#text").val();
        if(infos==""||infos==undefined){
            alert("请输入要发送的消息");
            return false;
        }
        message.msg = $("#text").val();
        message.name = userName;
        var subject= $("#subject").val();
        if(subject==""||subject==undefined){
            alert("接收方不能为空！");
            return false;
        }
        message.subject = $("#subject").val();
//        document.getElementById('message').innerHTML += userName + ':' + infos + '<br/>';
//        setMessageInnerHTML(userName+":"+"<span style=\"color:#1034fc\">" + infos+"</span>");
        right_setMessageInnerHTML(userName+":"+"<span style=\"color:black;\">" + infos+"</span>");
        //如果是JS对象{"key":"value"}则解析为字符串
        websocket.send(JSON.stringify(message));
    }
    //将消息显示在网页上
    function right_setMessageInnerHTML(innerHTML) {
        $("#message").append("<li style=\"margin-bottom:5px;border:5px solid white;float: right;background-color: greenyellow\">"+innerHTML+"</li><br><br>");
    }
    function setMessageInnerHTML(innerHTML) {
        $("#message").append("<li>"+innerHTML+"</li><br>");
    }
    function left_setMessageInnerHTML(innerHTML) {
        $("#message").append("<li style=\"margin-bottom:5px;border:5px solid white;float: left\;background-color: deepskyblue;\">"+innerHTML+"</li><br><br>");
    }
    //关闭WebSocket连接
    function closeWebSocket() {
        websocket.close();
    }


    /*
     websocket是前后端交互的长连接，
     那么前后端就必须有一个反馈提醒，采用心跳重连。
     使用原生websocket的时候，如果设备网络断开，
     不会触发websocket的任何事件函数，
     浏览器便会立刻或者一定短时间后触发onClose函数。
     */

    /*
     后端也可能出现异常，连接断开后前段并没有收到通知，
     因此需要前段定时发送心跳消息ping，
     后端收到Ping，立马返回pong消息，告知前端连接正常，
     否则前端执行重连
     */
    /*
     1. 在chrome中，如果心跳检测 也就是websocket实例执行send之后，15秒内没发送到另一接收端，onclose便会执行。那么超时时间是15秒。
     2. 我又打开了Firefox ，Firefox在断网7秒之后，直接执行onclose。说明在Firefox中不需要心跳检测便能自动onclose。
     3.  同一代码， reconnect方法 在chrome 执行了一次，Firefox执行了两次。当然我们在几处地方（代码逻辑处和websocket事件处）绑定了reconnect()，
     所以保险起见，我们还是给reconnect()方法加上一个锁，保证只执行一次
     */

    //    1、判断前端ws断开
    //    2、判断后端断开：
    var heartCheck = {
        timeout: 10000,//10s
        timeoutObj: null,
        reset: function () {
            clearTimeout(this.timeoutObj);
            this.start();
        },
        start: function () {
            this.timeoutObj = setTimeout(function () {
                websocket.send("heartBeat");
            }, this.timeout)
        }
    }
    //    //函数放在onclose里
    //    websocket.onclose = disConnect;
    function getCurrentTime(){
        var separator1="-";
        var separetor2=":";
        var date=new Date();
        var month=date.getMonth()+1;
        var strDate=date.getDate();
        var hour=date.getHours();
        var minute=date.getMinutes();
        var second=date.getSeconds();
        if(hour>=0&&hour<=9){
            hour="0"+hour;
        }
        if(minute>=0&&minute<=9){
            minute="0"+minute;
        }
        if(second>=0&&second<=9){
            second="0"+second;
        }
        if(month>=1&&month<=9){
            month="0"+month;
        }
        if(strDate>=0&&strDate<=9){
            strDate="0"+strDate;
        }
        var currentdate=date.getFullYear()+separator1+month+separator1+strDate+" "+hour+separetor2+minute+separetor2+second;
        return currentdate;
    }
    function removeLogs(){
        $("#message").find("li").remove();
        $("#message").find("br").remove();
    }
</script>
<script>
    $('div.marquee').each(function () {
        if (this.scrollHeight > this.offsetHeight) $(this).html('<marquee behavior="scroll" direction="up" scrollamount="1" height="140" onmouseover="this.stop()" onmouseout="this.start()">'+this.innerHTML+'</marquee>');
    });
</script>
</body>
</html>
