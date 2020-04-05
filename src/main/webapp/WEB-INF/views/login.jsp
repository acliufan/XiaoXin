<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/7/4 0004
  Time: 22:34
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
欢迎来到聊天室
<br/>
你的名字:
<input id="name" type="text" />
<br />
<button onclick="login();">Login</button>
<br />
<script>
    function login(){
        var name = document.getElementById("name").value;
        if(name == ''){
            alert('Please give me a your name.');
            return false;
        }
//        window.location.href = "/singleChat?name="+name;
        //Window.location.href以post方式传递参数的方法
        document.write("<form action=singleChat method=post name=form1 style='display:none'>");
        document.write("<input type=hidden name=name value='"+name+"'/>");
        document.write("</form>");
        document.form1.submit();
    }

</script>
</body>
</html>
