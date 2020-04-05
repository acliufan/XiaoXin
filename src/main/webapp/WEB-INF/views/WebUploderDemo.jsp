<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/5/25 0025
  Time: 15:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <link rel="shortcut icon" href="/js/webUploader/webuploader/images/favicon.ico">
    <link rel="stylesheet" type="text/css" href="/js/webUploader/webuploader/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="/js/webUploader/webuploader/css/bootstrap-theme.min.css">
    <link rel="stylesheet" type="text/css" href="/js/webUploader/webuploader/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="/js/webUploader/webuploader/css/syntax.css">
    <link rel="stylesheet" type="text/css" href="/js/webUploader/webuploader/css/style.css">

    <link rel="stylesheet" type="text/css" href="/js/webUploader/webuploader/css/webuploader.css">

    <link rel="stylesheet" type="text/css" href="/js/webUploader/webuploader/css/demo.css">
</head>
<body ng-controller="myCtrl">
　　<p><input type="file" value="上传文件"/></p>
　　</br>
　　<div id="uploader" class="wu-example">
    　  　<!--用来存放文件信息-->
    <div id="thelist" class="uploader-list"></div>
    <div class="btns">
        <div id="picker">选择文件</div>
        <button id="ctlBtn" class="btn btn-default">开始上传</button>
    </div><br>     <div id="my_list"></div>
</div>
    <script>
    //实例化
    var uploader = WebUploader.create({
        // swf文件路径
        //swf: BASE_URL + '/js/Uploader.swf',
        // swf:'http://cdn.staticfile.org/webuploader/0.1.0/Uploader.swf',
        auto: false,
        // 文件接收服务端。
        server:'http://127.0.0.1:8020/upFile/file_up.html', //在做这个demo的时候，并没有服务器地址，我使用的是HBuilder自带的浏览器打开文件，复制url
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker',
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        method:'POST',
    });

    // 上传队列，仅包括等待上传的文件
    var _queue = [];

    // 存储所有文件
    var _map = {};
    // 当有文件被添加进队列的时候
    uploader.on( 'fileQueued', function( file ) {
        var that_file=file;
        _queue.push(file);
        draw_page(_queue);
    });

    //绘制页面
    function draw_page(_queue){
        $list=$("#my_list");
        $list.html("");
        console.log($list.html());
        for(var i=0;i<_queue.length;i++){
            $list.append( '<div id="' + _queue[i].id + '" class="item">' +
                '<h4 class="info">' + _queue[i].name +
                '<span id="cancelButton" style="background: red;cursor:pointer"' + 'onclick=deleteMyfile('+_queue[i].id+')'+ '> 取消上传</span>'
                +'</h4>' +
                '</div>' );
        }
    }

    //点击开始上传文件
    $("#ctlBtn").on("click",function(){
        uploader.upload();
    });

    //点击“取消”按钮，调用事件
    function deleteMyfile(myFile_id){
        console.log(myFile_id);
        //点击取消，删除dom节点刷新界面
        //   $(myFile_id).remove();

        var tar_id= $(myFile_id).attr("id");
        $.each(_queue,function(k,v){
            if(_queue[k].id==tar_id){
                var myFile=_queue[k];
                uploader.removeFile(myFile,true);
            }
            //return false;
        });
    }
    //文件删除的详细方式
    function _delFile (file){
        for(var i = _queue.length - 1 ; i >= 0 ; i-- ){
            if(_queue[i].id== file.id){
                _queue.splice(i,1);
                break;
            }
        }
        //重新绘制界面
        draw_page(_queue);
    };

    //档文件被移除队列de时候
    uploader.on("fileDequeued",function(file){
        _delFile (file);
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        alert("uploadProgress--文件正在上传");
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo( $li ).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');
        $percent.css( 'width', percentage * 100 + '%' );
    });

    //开始上传
    uploader.on('startUpload',function(file){
        alert("文件开始上传了------startUpload");
    });

    uploader.on( 'uploadSuccess', function( file ) {
        $( '#'+file.id ).find('p.state').text('已上传');
    });

    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错');
    });

    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });
</script>
</body>
</html>
