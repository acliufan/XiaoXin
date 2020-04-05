<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/9/14 0014
  Time: 11:58
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page errorPage="Util/error.jsp"%>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <title>- Xin Chat </title>

    <meta name="description" content="User login page" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

    <!-- bootstrap & fontawesome -->
    <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
    <link rel="stylesheet" href="assets/font-awesome/4.5.0/css/font-awesome.min.css" />

    <!-- text fonts -->
    <link rel="stylesheet" href="assets/css/fonts.googleapis.com.css" />

    <!-- ace styles -->
    <link rel="stylesheet" href="assets/css/ace.min.css" />

    <!--[if lte IE 9]>
    <link rel="stylesheet" href="assets/css/ace-part2.min.css" />
    <![endif]-->
    <link rel="stylesheet" href="assets/css/ace-rtl.min.css" />

    <!--[if lte IE 9]>
    <link rel="stylesheet" href="assets/css/ace-ie.min.css" />
    <![endif]-->

    <!-- HTML5shiv and Respond.js for IE8 to support HTML5 elements and media queries -->

    <!--[if lte IE 8]>
    <script src="assets/js/html5shiv.min.js"></script>
    <script src="assets/js/respond.min.js"></script>
    <script type="text/javascript" src="/js/CommonPart/CommonUtil.js"></script>
    <![endif]-->
</head>

<body class="login-layout">
<div class="main-container">
    <div class="main-content">
        <div class="row">
            <div class="col-sm-10 col-sm-offset-1">
                <div class="login-container">
                    <div class="center">
                        <h1>
                            <i class="ace-icon fa fa-leaf green"></i>
                            <span class="red">Xin </span>
                            <span class="white" id="id-text2">Chat</span>
                        </h1>
                        <h4 class="blue" id="id-company-text">&copy; Xiao Liu </h4>
                    </div>

                    <div class="space-6"></div>

                    <div class="position-relative">
                        <div id="login-box" class="login-box visible widget-box no-border">
                            <div class="widget-body">
                                <div class="widget-main">
                                    <h4 class="header blue lighter bigger">
                                        <i class="ace-icon fa fa-coffee green"></i>
                                       emmm...留下名号
                                    </h4>

                                    <div class="space-6"></div>

                                    <form>
                                        <fieldset>
                                            <label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input id="userName" type="text" class="form-control" placeholder="Username" />
															<i class="ace-icon fa fa-user"></i>
														</span>
                                            </label>

                                            <label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input id="userPassword" type="password" class="form-control" placeholder="Password" />
															<i class="ace-icon fa fa-lock"></i>
														</span>
                                            </label>

                                            <div class="space"></div>

                                            <div class="clearfix">
                                                <%--<label class="inline">--%>
                                                    <%--<input type="checkbox" class="ace" />--%>
                                                    <%--<span class="lbl"> Remember Me</span>--%>
                                                <%--</label>--%>

                                                <button type="button" id="userLogin" class="width-35 pull-right btn btn-sm btn-primary">
                                                    <i class="ace-icon fa fa-key"></i>
                                                    <span class="bigger-110">Login</span>
                                                </button>
                                            </div>

                                            <div class="space-4"></div>
                                        </fieldset>
                                    </form>

                                    <%--<div class="social-or-login center">--%>
                                        <%--<span class="bigger-110">Or Login Using</span>--%>
                                    <%--</div>--%>

                                    <%--<div class="space-6"></div>--%>

                                    <%--<div class="social-login center">--%>
                                        <%--<a class="btn btn-primary">--%>
                                            <%--<i class="ace-icon fa fa-facebook"></i>--%>
                                        <%--</a>--%>

                                        <%--<a class="btn btn-info">--%>
                                            <%--<i class="ace-icon fa fa-twitter"></i>--%>
                                        <%--</a>--%>

                                        <%--<a class="btn btn-danger">--%>
                                            <%--<i class="ace-icon fa fa-google-plus"></i>--%>
                                        <%--</a>--%>
                                    <%--</div>--%>
                                </div><!-- /.widget-main -->

                                <div class="toolbar clearfix">
                                    <div>
                                        <%--<a href="#" data-target="#forgot-box" class="forgot-password-link">--%>
                                            <%--<i class="ace-icon fa fa-arrow-left"></i>--%>
                                            <%--I forgot my password--%>
                                        <%--</a>--%>
                                    </div>

                                    <div>
                                        <%--<a href="#" data-target="#signup-box" class="user-signup-link">--%>
                                            <%--I want to register--%>
                                            <%--<i class="ace-icon fa fa-arrow-right"></i>--%>
                                        <%--</a>--%>
                                    </div>
                                </div>
                            </div><!-- /.widget-body -->
                        </div><!-- /.login-box -->

                        <div id="forgot-box" class="forgot-box widget-box no-border">
                            <div class="widget-body">
                                <div class="widget-main">
                                    <h4 class="header red lighter bigger">
                                        <i class="ace-icon fa fa-key"></i>
                                        Retrieve Password
                                    </h4>

                                    <div class="space-6"></div>
                                    <p>
                                        Enter your email and to receive instructions
                                    </p>

                                    <form>
                                        <fieldset>
                                            <label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="email" class="form-control" placeholder="Email" />
															<i class="ace-icon fa fa-envelope"></i>
														</span>
                                            </label>

                                            <div class="clearfix">
                                                <button type="button" class="width-35 pull-right btn btn-sm btn-danger">
                                                    <i class="ace-icon fa fa-lightbulb-o"></i>
                                                    <span class="bigger-110">Send Me!</span>
                                                </button>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div><!-- /.widget-main -->

                                <div class="toolbar center">
                                    <a href="#" data-target="#login-box" class="back-to-login-link">
                                        Back to login
                                        <i class="ace-icon fa fa-arrow-right"></i>
                                    </a>
                                </div>
                            </div><!-- /.widget-body -->
                        </div><!-- /.forgot-box -->

                        <div id="signup-box" class="signup-box widget-box no-border">
                            <div class="widget-body">
                                <div class="widget-main">
                                    <h4 class="header green lighter bigger">
                                        <i class="ace-icon fa fa-users blue"></i>
                                        New User Registration
                                    </h4>

                                    <div class="space-6"></div>
                                    <p> Enter your details to begin: </p>

                                    <form>
                                        <fieldset>
                                            <label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="email" class="form-control" placeholder="Email" />
															<i class="ace-icon fa fa-envelope"></i>
														</span>
                                            </label>

                                            <label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="text" class="form-control" placeholder="Username" />
															<i class="ace-icon fa fa-user"></i>
														</span>
                                            </label>

                                            <label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="password" class="form-control" placeholder="Password" />
															<i class="ace-icon fa fa-lock"></i>
														</span>
                                            </label>

                                            <label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="password" class="form-control" placeholder="Repeat password" />
															<i class="ace-icon fa fa-retweet"></i>
														</span>
                                            </label>

                                            <label class="block">
                                                <input type="checkbox" class="ace" />
                                                <span class="lbl">
															I accept the
															<a href="#">User Agreement</a>
														</span>
                                            </label>

                                            <div class="space-24"></div>

                                            <div class="clearfix">
                                                <button type="reset" class="width-30 pull-left btn btn-sm">
                                                    <i class="ace-icon fa fa-refresh"></i>
                                                    <span class="bigger-110">Reset</span>
                                                </button>

                                                <button type="button" class="width-65 pull-right btn btn-sm btn-success">
                                                    <span class="bigger-110">Register</span>

                                                    <i class="ace-icon fa fa-arrow-right icon-on-right"></i>
                                                </button>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div>

                                <div class="toolbar center">
                                    <a href="#" data-target="#login-box" class="back-to-login-link">
                                        <i class="ace-icon fa fa-arrow-left"></i>
                                        Back to login
                                    </a>
                                </div>
                            </div><!-- /.widget-body -->
                        </div><!-- /.signup-box -->
                    </div><!-- /.position-relative -->

                    <div class="navbar-fixed-top align-right">
                        <br />
                        &nbsp;
                        <a id="btn-login-dark" href="#">Dark</a>
                        &nbsp;
                        <span class="blue">/</span>
                        &nbsp;
                        <a id="btn-login-blur" href="#">Blur</a>
                        &nbsp;
                        <span class="blue">/</span>
                        &nbsp;
                        <a id="btn-login-light" href="#">Light</a>
                        &nbsp; &nbsp; &nbsp;
                    </div>
                </div>
            </div><!-- /.col -->
        </div><!-- /.row -->
    </div><!-- /.main-content -->
</div><!-- /.main-container -->

<!-- basic scripts -->

<!--[if !IE]> -->
<script src="assets/js/jquery-2.1.4.min.js"></script>

<!-- <![endif]-->

<!--[if IE]>
<script src="assets/js/jquery-1.11.3.min.js"></script>
<![endif]-->
<script type="text/javascript">
    if('ontouchstart' in document.documentElement) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
</script>

<!-- inline scripts related to this page -->
<script type="text/javascript">
    var a=1/0;
    jQuery(function($) {
        $(document).on('click', '.toolbar a[data-target]', function(e) {
            e.preventDefault();
            var target = $(this).data('target');
            $('.widget-box.visible').removeClass('visible');//hide others
            $(target).addClass('visible');//show target
        });
    });



    //you don't need this, just used for changing background
    jQuery(function($) {
        $('#btn-login-dark').on('click', function(e) {
            $('body').attr('class', 'login-layout');
            $('#id-text2').attr('class', 'white');
            $('#id-company-text').attr('class', 'blue');

            e.preventDefault();
        });
        $('#btn-login-light').on('click', function(e) {
            $('body').attr('class', 'login-layout light-login');
            $('#id-text2').attr('class', 'grey');
            $('#id-company-text').attr('class', 'blue');

            e.preventDefault();
        });
        $('#btn-login-blur').on('click', function(e) {
            $('body').attr('class', 'login-layout blur-login');
            $('#id-text2').attr('class', 'white');
            $('#id-company-text').attr('class', 'light-blue');

            e.preventDefault();
        });

    });
</script>
<%--回调函数的样式afterShow--开始--%>
<link type="text/css" rel="stylesheet" href="/js/Hplus-v/css/plugins/toastr/toastr.min.css">
<script type="text/javascript" src="/js/Hplus-v/js/plugins/toastr/toastr.min.js"></script>
<script type="text/javascript" src="/js/Hplus-v/js/content.js"></script>
<%--回调函数的样式afterShow--结束--%>
<script>
    $('#userLogin').on('click', function () {
        var url = "UserLogin";
        var userName = $("#userName").val();
        var userPassword = $("#userPassword").val();
        var parameter = "userName=" + userName;
//        var parameter="userName="+userName+"&userPassword="+userPassword;
        operationFunction(parameter, url, function (result) {
            var tips = result.result;
            afterShowTips(tips);
            var arr = tips.split(":");
            var status="";
            if(arr!=undefined){
                status=arr[0];
            }
            if(status=="success"){
                var name="${CurrentUser}";
                setTimeout(function () {
                    window.location.href="ToXinChat?userName="+name;
                }, 1500);
            }else {
                return false;
            }
        })
    })
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
