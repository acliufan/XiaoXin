<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/7/4 0004
  Time: 11:00
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
<div
        style="width: 600px; height: 240px; overflow-y: auto; border: 1px solid #333;"
        id="show"></div>
<input type="text" size="80" id="msg" name="msg" placeholder="输入聊天内容" />
<input type="button" value="发送" id="sendBn" name="sendBn" />
<script type="text/javascript">
    // 创建WebSocket对象

    var webSocket = new WebSocket("ws://localhost:8080/WebSocket1/chat");
    var sendMsg = function() {
        var inputElement = document.getElementById('msg');

        if (inputElement.value == '')
            alert("输入内容不为空");
        else {
            // 发送消息
            webSocket.send(inputElement.value);
            // 清空单行文本框
            inputElement.value = "";
        }
    }
    var send = function(event) {
        //设置回车发送消息
        if (event.keyCode == 13) {
            sendMsg();
        }
    };
    webSocket.onopen = function() {

        n = prompt('请给自己取一个昵称：');

        if (n != '' && n != null)
            webSocket.send(n);
        else
        //设置游客登录
            webSocket.send("游客" + Math.random() * 100000000000000000);
        document.getElementById('msg').onkeydown = send;
        document.getElementById('sendBn').onclick = sendMsg;
    };
    // 为onmessage事件绑定监听器，接收消息
    webSocket.onmessage = function(event) {
        var show = document.getElementById('show')
        // 接收、并显示消息
        show.innerHTML += new Date() + "<br/>" + event.data + "<br/>";
        //让聊天框滚动条始终显示新消息
        show.scrollTop = show.scrollHeight;
    }

    webSocket.onclose = function() {
        document.getElementById('msg').onkeydown = null;
        document.getElementById('sendBn').onclick = null;
        Console.log('WebSocket已经被关闭。');
    };
</script>
</body>
</html>
