<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/7/4 0004
  Time: 22:34
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--一旦jsp页面出现错误将跳转到error.jsp页面中--%>
<html>
<head>
    <title>- Smile Zhang</title>
</head>
<body>
<span class="say" style="color:deepskyblue">此路是我开，要想此路过------emmmm。。。。。</span>
<br/>
<span class="say" style="color:deepskyblue">雁过拔毛，人过留名，你懂得！</span>
<input id="name" type="text" />
<br />
<button onclick="login();">Login</button>
<br />
<script>
    function login(){
        var name = document.getElementById("name").value;
        if(name == ""){
            alert('报上名来');
            return false;
        }
        else if(name=="小刘同学"){
            document.write("<form action=RainLogin?name="+name+" method=post name=form1 style='display:none'>");
            document.write("<input type=hidden />");
//            document.write("<input type=hidden name=name value='"+name+"'/>");
            document.write("</form>");
            document.form1.submit();
        }else {
            alert('请输入正确的名字');
            return false;
        }
//        window.location.href = "/singleChat?name="+name;
        //Window.location.href以post方式传递参数的方法

    }
</script>
</body>
</html>
