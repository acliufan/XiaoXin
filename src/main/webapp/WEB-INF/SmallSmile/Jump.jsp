<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/2/15 0015
  Time: 12:00
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>- Chat </title>
    <link rel="stylesheet" href="/js/love/default.css"/>
    <script src="/js/love/jquery.min.js"></script>
    <script src="/js/love/jscex.min.js"></script>
    <script src="/js/love/jscex-parser.js"></script>
    <script src="/js/love/jscex-jit.js"></script>
    <script src="/js/love/jscex-builderbase.min.js"></script>
    <script src="/js/love/jscex-async.min.js"></script>
    <script src="/js/love/jscex-async-powerpack.min.js"></script>
    <script src="/js/love/functions.js" charset="utf-8"></script>
    <script src="/js/love/jscex-builderbase.min.js"></script>
    <script src="/js/love/love.js" charset="utf-8"></script>
    <%--回调函数的样式afterShow--开始--%>
    <link type="text/css" rel="stylesheet" href="/js/Hplus-v/css/plugins/toastr/toastr.min.css">
    <script type="text/javascript" src="/js/Hplus-v/js/plugins/toastr/toastr.min.js"></script>
    <script type="text/javascript" src="/js/Hplus-v/js/content.js"></script>
    <style>
        particle {
            border-radius: 50%;
            left: 0;
            pointer-events: none;
            position: fixed;
            top: 0;
        }
        /*
        粒子不应与页面布局相互作用，因此我们设置了一个fixed定位，top和left分别为0px。
        我们还将删除指针事件，以避免HTML粒子在屏幕上时与用户的任何交互
        。*/
    </style>
</head>
<body>
<div id="main">
    <div id="error">亲，您使用的浏览器无法支持即将显示的内容，请换成谷歌(<a href="http://www.google.cn/chrome/intl/zh-CN/landing_chrome.html?hl=zh-CN&brand=CHMI">Chrome</a>)或者火狐(<a href="http://firefox.com.cn/download/">Firefox</a>)浏览器哟~</div>
    <div id="wrap">
        <button id="clickTOMe">click on me </button>
    </div>
    <!--<audio src="love.mp3" autoplay="autoplay"></audio>-->
</div>
<script>
    $("#clickTOMe").click(function(){
        <%--var name="${CurrentUser}";--%>
        <%--if(name==""||name==undefined){--%>
            <%--window.location.href="ToLogin";--%>
        <%--}else if(name=="刘帆"){--%>
            <%--setTimeout(function () {--%>
                <%--window.location.href="ToSmileChat?userName="+name;--%>
            <%--}, 1500);--%>
        <%--}else {--%>
            <%--afterShowTips("success:抱歉小刘让你久等了！");--%>
            <%--setTimeout(function () {--%>
                <%--window.location.href="ToSmileChat?userName="+name;--%>
            <%--}, 1500);--%>
        <%--}--%>
    })
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
    /*
    * 这是我们将在JavaScript中执行的六个步骤：
    * 监听按钮上的点击事件
    * 创建30个<particle>元素并将其附加到<body>
    * 为每个粒子设置随机的宽度，高度和背景
    * 使每个粒子淡出时，将其从鼠标位置动画化到随机位置
    * 动画完成后，从DOM中删除<particle>
    * */
    // 步骤1：点击事件

    // 我们首先检查浏览器是否支持Web Animations API
    if (document.body.animate) {
        debugger
        // 如果支持，我们在按钮上添加一个点击监听器
        document.querySelector('#clickTOMe').addEventListener('click', pop);
    }

    // 步骤2：粒子
    // 每次点击都会调用 pop() 函数
    function pop(e) {
        // 循环一次生成30个粒子
        for (let i = 0; i < 30; i++) {
            // 我们将鼠标坐标传递给 createParticle() 函数
            createParticle(e.clientX, e.clientY);
        }
    }
    function createParticle(x, y) {
        // 创建自定义粒子元素
        const particle = document.createElement('particle');
        // 将元素添加道body中
        document.body.appendChild(particle);
    }

    // 步骤3：粒子宽度，高度和背景

    function createParticle (x, y) {
        // [...]
        // 计算从5px到25px的随机大小
        const size = Math.floor(Math.random() * 20 + 5);
        // 将大小应用于每个粒子
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        // 在蓝色/紫色调色板中生成随机颜色
        particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;
    }
    // 步骤4：为每个粒子添加动画

    function createParticle (x, y) {
        // [...]
        // 在距离鼠标75像素的范围内生成随机的x和y目标
        const destinationX = x + (Math.random() - 0.5) * 2 * 75;
        const destinationY = y + (Math.random() - 0.5) * 2 * 75;

        // 将动画存储在变量中，因为稍后我们将需要它
        const animation = particle.animate([
            {
                // 设置粒子的原点位置
                // 我们将粒子偏移一半大小，以使其围绕鼠标居中
                transform: `translate(${x - (size / 2)}px, ${y - (size / 2)}px)`,
                opacity: 1
            },
            {
                // 我们将最终坐标定义为第二个关键帧
                transform: `translate(${destinationX}px, ${destinationY}px)`,
                opacity: 0
            }
        ], {
            // 将随机持续时间设置为500到1500ms
            duration: 500 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            // 将每个粒子延迟从0ms到200ms的随机值
            delay: Math.random() * 200
        });
    }
    /*
    * 因为我们有一个随机的延迟，所以等待开始动画的粒子在屏幕的左上角可见，为了防止这种情况，我们可以在全局CSS中为每个粒子设置零不透明度。
    * particle {
    * 和之前的一样
    * opacity: 0;
    }
      */
    /*步骤5：动画完成后删除粒子
    从DOM中删除粒子元素很重要，
    因为我们每次点击都会创建30个新元素，
    所以浏览器的内存很快就会被填满，
    导致出现问题。我们可以这样做：
    */
    function createParticle(x, y) {
        // 和前面的相同
        // 动画结束后，从DOM中删除元素
        animation.onfinish = () => {
            particle.remove();
        };
    }

</script>
</body>
</html>
