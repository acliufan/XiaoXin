/**
 *  判断密级，如果是空或者”其他“，则需要录入密级后打印，是非密则直接打印
 *  如果是批量打印，判断所选的每条数据，为空或者”其他“则，修改为录入的密级，
 *  为”非密“，则直接打印
 * @param filedName 密级字段名称json
 *
 */
var filedName;

function printCheck(id) {
    var total = '';
    if(null == id || '' == id){
        var ids =  $(grid_selector).jqGrid('getGridParam','selarrrow');
        total = ids.length;
    }else{
        var ids = new Array(id);
        total=1;
    }

    $("canvas").remove();
    //判断数量
    if (total > 50) {
        showTheMessage("failed:单次打印数量不能超过50个");
    } else if (total < 1) {
        showTheMessage("failed:请选择要打印的数据");
    }
    else {
        for (var i = 0; i < total; i++) {
            var rowData = $(grid_selector).jqGrid('getRowData', ids[i]);
            var secretLevel = eval('rowData.'+filedName.level);
            //判断是否要输入密级
            if (null == secretLevel || '' == secretLevel || '其他' == secretLevel) {
                //如果已输入国密级，则不再输入
                selectLevel(id);
                return ;
            }
        }
        print(id);
    }
}

/**
 * 打印标签
 * @param id 如果是单件打印，传递打印的编号
 */
function print(id) {
    var setLevel = $("#setLevel").val();
    if(null == id || '' == id){
        var ids =  $(grid_selector).jqGrid('getGridParam','selarrrow');
        total = ids.length;
    }else{
        var ids = new Array(id);
        total=1;
    }
    $("canvas").remove();
    var imgDiv = "";
    imgDiv = $('<div id="imgDiv" class="div2" style="height:41px; width: 300px;"></div>');//TSC打印机用

    for (var i = 0; i < total; i++) {
        var rowData = $(grid_selector).jqGrid('getRowData', ids[i]);
        var accountCode = eval('rowData.'+filedName.code);
        var accountName = eval('rowData.'+filedName.name);
        var secretLevel = eval('rowData.'+filedName.level);

        //判断是否要输入密级
        if (null == secretLevel || '' == secretLevel || '其他' == secretLevel) {
            //如果已输入国密级，则不再输入
            secretLevel = setLevel;
        }

        var equipmentuses = eval('rowData.'+filedName.equipmentuses);
        var responseDeptName;
        var responserName =  eval('rowData.'+filedName.userName);
        var deptName =  eval('rowData.'+filedName.deptName);
        if (deptName.length > 6) {
            responseDeptName = eval('rowData.'+filedName.deptShortName);
        } else {
            responseDeptName = deptName;
        }

        var num = i % 51;
        jQuery('#output' + num).qrcode({
            render: 'canvas',
            width: 85,
            height: 75,
            text: accountCode
        });
        $("canvas").attr("id", "canvas_qrcode" + num);
        var canvas = document.getElementById('canvas_qrcode'
            + num);
        var image = new Image();
        var strDataURI = canvas.toDataURL("image/png");
        //系统在用
        //名称单行显示
        if(accountName == '' || accountName.length<8){
            imgDiv.append('<div style=" height:41mm;">'
                + '<div style="margin-left:25px;height: 3mm">&nbsp;</div>'
                + '<img src="' + strDataURI + '" style="float:right;margin-right:20px;margin-top:8px" /> '
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 5mm">资产编号:&nbsp;' + accountCode + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 5mm">资产名称:&nbsp;' + accountName + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 5mm">资产密级:&nbsp;' + secretLevel + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 5mm">责任部门:&nbsp;' + responseDeptName + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 5mm">责&nbsp;任&nbsp;人:&nbsp;' + responserName + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 8mm">资产用途:&nbsp;' + equipmentuses + '</div>'
                + '<div style="float: left;margin-left: 65px;font-family: SimHei;font-size: 110%;height: 5mm">中国航天科工二院七〇六所</div></div>');
        }
        //名称双行显示
        else{
            var name='';
            var num=0;
            if(accountName.length>19)
                num = 19 -14;
            else
                num = accountName.length -14;

            for(var j=5;j>num;j--){
                if(j>0)
                    name += '&nbsp;&nbsp;';
            }
            name += accountName.substring(7,num+14);

            imgDiv.append('<div style=" height:41mm;">'
                + '<div style="margin-left:25px;height: 3mm">&nbsp;</div>'
                + '<img src="' + strDataURI + '" style="float:right;margin-right:20px;margin-top:8px" /> '
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 5mm">资产编号:&nbsp;' + accountCode + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 4mm">资产名称:&nbsp;' + accountName.substring(0,7) + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 4mm">' + name + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 5mm">资产密级:&nbsp;' + secretLevel + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 5mm">责任部门:&nbsp;' + responseDeptName + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 5mm">责&nbsp;任&nbsp;人:&nbsp;' + responserName + '</div>'
                + '<div style="margin-left:25px;font-family: SimHei;font-size: 110%;height: 8mm">资产用途:&nbsp;' + equipmentuses + '</div>'
                + '<div style="float: left;margin-left: 65px;font-family: SimHei;font-size: 110%;height: 5mm">中国航天科工二院七〇六所</div></div>');
        }

    }
    imgDiv.jqprint();
}

/**
 * 输入密级
 * @param id 如果是单件打印，传递打印的编号
 */
function selectLevel(id){
    var title = "";
    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
        _title: function (title) {
            var $title = this.options.title || '&nbsp;'
            if (("title_html" in this.options)
                && this.options.title_html == true)
                title.html($title);
            else
                title.text($title);
        }
    }));
    dialog = $("#print_dialog").removeClass('hide').dialog({
        modal: true,
        width: "360px",
        heigth: "160px",
        title: "输入密级",
        title_html: true,
        open: function () {
            $('#setLevel').val('');
        },
        close: function () {
            //$('#setLevel').val('');
        },
        buttons: [
            {
                text: "确定",
                "class": "btn btn-primary btn-xs",
                click: function () {
                    $(this).dialog("close");
                    print(id);
                }
            }
        ]
    });
}
//上传控件初始化
function initUploadify(url){
    $("#uploadify").uploadify({
        swf				:'js/uploadify/uploadify.swf',
        method			: 'get',	// 提交方式
        fileObjName		: 'filedata',	//文件对象名称, 即属性名
        uploader		: url, //+$("#updateRole").val(),
        height			: 30	, // 30 px
        width			: 107	, // 120 px
        formData		: {"operType":0,"updateRole":1},
// 			folder			:'UploadFile',
        queueID			:'fileQueue',
        buttonText		:'选择文件',
        buttonCursor	: 'hand',	// 上传按钮Hover时的鼠标形状
        fileSizeLimit	: 10240,		// 文件大小限制, 10240 KB
        fileTypeExts	: '*.xls;*.xlsx',	// 允许的文件类型,分号分隔
        progressData	: 'percentage',	// 进度显示, speed-上传速度,percentage-百分比
        auto			:false,
        multi			:true,
        // 在每一个文件上传成功后触发
        onUploadSuccess : function(file, data, response) {
            var resultObj = $.parseJSON(data);
            var resultStr = resultObj.result;
            showMsg(resultStr);
        }
    });
}