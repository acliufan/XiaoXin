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
</head>
<body>
<div id="main">
    <div id="error">亲，您使用的浏览器无法支持即将显示的内容，请换成谷歌(<a href="http://www.google.cn/chrome/intl/zh-CN/landing_chrome.html?hl=zh-CN&brand=CHMI">Chrome</a>)或者火狐(<a href="http://firefox.com.cn/download/">Firefox</a>)浏览器哟~</div>
    <div id="wrap">
        <div id="text">
            <div id="code">
                <span class="say" ><b style="color:pink"></b></span><br>
                <span class="say">。</span><br>
                <span class="say"></span><br>
                <span class="say"></span><br>
                <span class="say"></span><br>
                <span class="say"></span><br>
                <span class="say"></span><br>
                <span class="say"></span><br>
                <span class="say"></span><br>
                <span class="say"></span><br>
                <span class="say"></span><br>
                <br>
                <span class="say"></span><br>
                <br>
                <span class="say"><span class="space"></span> -- Yours, .</span>
            </div>
        </div>
        <div id="clock-box">
            <a href="" target="_blank">@A</a> 与 <a href="" target="_blank">@B</a> 在一起的
            <div id="clock"></div>
        </div>
        <canvas id="canvas"></canvas>
    </div>
    <!--<audio src="love.mp3" autoplay="autoplay"></audio>-->
</div>
<script>
    (function(){
        var canvas = $('#canvas');
        if (!canvas[0].getContext) {
            $("#error").show();
            return false;
        }
        var width = canvas.width();
        var height = canvas.height();
        canvas.attr("width", width);
        canvas.attr("height", height);

        var opts = {
            seed: {
                x: width / 2 - 20,
                color: "rgb(190, 26, 37)",
                scale: 2
            },
            branch: [
                [535, 680, 570, 250, 500, 200, 30, 100, [
                    [540, 500, 455, 417, 340, 400, 13, 100, [
                        [450, 435, 434, 430, 394, 395, 2, 40]
                    ]],
                    [550, 445, 600, 356, 680, 345, 12, 100, [
                        [578, 400, 648, 409, 661, 426, 3, 80]
                    ]],
                    [539, 281, 537, 248, 534, 217, 3, 40],
                    [546, 397, 413, 247, 328, 244, 9, 80, [
                        [427, 286, 383, 253, 371, 205, 2, 40],
                        [498, 345, 435, 315, 395, 330, 4, 60]
                    ]],
                    [546, 357, 608, 252, 678, 221, 6, 100, [
                        [590, 293, 646, 277, 648, 271, 2, 80]
                    ]]
                ]]
            ],
            bloom: {
                num: 700,
                width: 1080,
                height: 650,
            },
            footer: {
                width: 1200,
                height: 5,
                speed: 10,
            }
        }
        var tree = new Tree(canvas[0], width, height, opts);
        var seed = tree.seed;
        var foot = tree.footer;
        var hold = 1;
        canvas.click(function(e) {
//            var offset = canvas.offset(), x, y;
//            x = e.pageX - offset.left;
//            y = e.pageY - offset.top;
//            if (seed.hover(x, y)) {
//                hold = 0;
//                canvas.unbind("click");
//                canvas.unbind("mousemove");
//                canvas.removeClass('hand');
//            }
            var name="${CurrentUser}";
            if(name==""||name==undefined){
                window.location.href="ToLogin";
            }else if(name=="小刘"){
                afterShowTips("success:welcome to wechat");
                setTimeout(function () {
                    window.location.href="ToSmileChat?userName="+name;
                }, 1500);

            }else {
                afterShowTips("success:welcome to wechat");
                setTimeout(function () {
                    window.location.href="ToSmileChat?userName="+name;
                }, 1500);
            }
        }).mousemove(function(e){
            var offset = canvas.offset(), x, y;
            x = e.pageX - offset.left;
            y = e.pageY - offset.top;
            canvas.toggleClass('hand', seed.hover(x, y));
        });
        var seedAnimate = eval(Jscex.compile("async", function () {
            seed.draw();
            while (hold) {
                $await(Jscex.Async.sleep(10));
            }
            while (seed.canScale()) {
                seed.scale(0.95);
                $await(Jscex.Async.sleep(10));
            }
            while (seed.canMove()) {
                seed.move(0, 2);
                foot.draw();
                $await(Jscex.Async.sleep(10));
            }
        }));
        var growAnimate = eval(Jscex.compile("async", function () {
            do {
                tree.grow();
                $await(Jscex.Async.sleep(10));
            } while (tree.canGrow());
        }));
        var flowAnimate = eval(Jscex.compile("async", function () {
            do {
                tree.flower(2);
                $await(Jscex.Async.sleep(10));
            } while (tree.canFlower());
        }));
        var moveAnimate = eval(Jscex.compile("async", function () {
            tree.snapshot("p1", 240, 0, 610, 680);
            while (tree.move("p1", 500, 0)) {
                foot.draw();
                $await(Jscex.Async.sleep(10));
            }
            foot.draw();
            tree.snapshot("p2", 500, 0, 610, 680);
            // 会有闪烁不得意这样做, (＞﹏＜)
            canvas.parent().css("background", "url(" + tree.toDataURL('image/png') + ")");
            canvas.css("background", "#ffe");
            $await(Jscex.Async.sleep(300));
            canvas.css("background", "none");
        }));
        var jumpAnimate = eval(Jscex.compile("async", function () {
            var ctx = tree.ctx;
            while (true) {
                tree.ctx.clearRect(0, 0, width, height);
                tree.jump();
                foot.draw();
                $await(Jscex.Async.sleep(25));
            }
        }));

        var textAnimate = eval(Jscex.compile("async", function () {
            var together0 = new Date();
            //setFullYear月份从0开始算的
            together0.setFullYear(2019,1,14);//实际为2019.2.14
            together0.setHours(5);
            together0.setMinutes(20);
            together0.setSeconds(0);
            together0.setMilliseconds(0);
            $("#code").show().typewriter();
            $("#clock-box").fadeIn(500);
            while (true) {
                timeElapse(together0);
                $await(Jscex.Async.sleep(1000));
            }
        }));
        var runAsync = eval(Jscex.compile("async", function () {
            $await(seedAnimate());
            $await(growAnimate());
            $await(flowAnimate());
            $await(moveAnimate());
            textAnimate().start();
            $await(jumpAnimate());
        }));
        runAsync().start();
    })();
    function compute(faultDate){
        var stime = Date.parse(new Date(faultDat));
        var etime = Date.parse(new Date());
        var usedTime = etime - stime;  //两个时间戳相差的毫秒数
        var days=Math.floor(usedTime/(24*3600*1000));
        //计算出小时数
        var leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000));
        //计算相差分钟数
        var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000));
        var time = days + "天"+hours+"时"+minutes+"分";
        return time;
    }
    function starClickJump(){
        window.location.href="";
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
</script>
</body>
</html>
