
/**
 * 汉字转化相关。
 * */
function toUtf8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
	}
	return out;
}

/*
 * 获取时间（年月日时分秒）
 * @author minsheng.bai
 * @time 2016-11-3
 */
function getTime()
{
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var monthStr;
	if(month <10)
	{
		monthStr = "0"+month;
	}else{
		monthStr = ""+month;
	}
	var day = date.getDate();
	var dayStr;
	if(day <10)
	{
		dayStr = "0"+day;
	}else{
		dayStr = ""+day;
	}
	var hour = date.getHours();
	var hourStr;
	if(hour <10)
	{
		hourStr = "0"+hour;
	}else{
		hourStr = ""+hour;
	}
	var minute = date.getMinutes();
	var minuteStr;
	if(minute <10)
	{
		minuteStr = "0"+minute;
	}else{
		minuteStr = ""+minute;
	}
	var second = date.getSeconds();
	var secondStr;
	if(second <10)
	{
		secondStr = "0"+second;
	}else{
		secondStr = ""+second;
	}

	var time = year+monthStr+dayStr+hourStr+minuteStr+secondStr;
	return time;

}

function initDate(datePickerId,dateType)
{
	$(datePickerId).datepicker({
			showOtherMonths: true,
			selectOtherMonths: false,
			dateFormat: 'yy/mm/dd',
			changeMonth: true,
			changeYear: true,
			
			showButtonPanel: true,
			beforeShow: function() {
				//change button colors
				var datepicker = $(this).datepicker( "widget" );
				setTimeout(function(){
					var buttons = datepicker.find('.ui-datepicker-buttonpane')
					.find('button');
					buttons.eq(0).addClass('btn btn-xs');
					buttons.eq(1).addClass('btn btn-xs btn-success');
					buttons.wrapInner('<span class="bigger-110" />');
				}, 0);
			}
			
		});
	if(dateType == "startDate")
	{
		//获取七天前的时间
		var currDate = new Date();
		var before7DateTime = currDate.getTime() - 7*24*3600*1000;
		var before7Date = new Date(before7DateTime);
		var year = before7Date.getFullYear();
		var month = before7Date.getMonth()+1;
		var day = before7Date.getDate();
		//$(datePickerId).val(year +"/" + month + "/" + day);

	}
	else if(dateType == "endDate"){
		//获取当前时间
		var currDate = new Date();
		var year = currDate.getFullYear();
		var month = currDate.getMonth()+1;
		var day = currDate.getDate();
		//$(datePickerId).val(year +"/" + month + "/" + day);
	}
}


function initDateByDate(datePickerId,selDate)
{
	$(datePickerId).datepicker({
		showOtherMonths: true,
		selectOtherMonths: false,
		dateFormat: 'yy/mm/dd',
		changeMonth: true,
		changeYear: true,

		showButtonPanel: true,
		beforeShow: function() {
			//change button colors
			var datepicker = $(this).datepicker( "widget" );
			setTimeout(function(){
				var buttons = datepicker.find('.ui-datepicker-buttonpane')
					.find('button');
				buttons.eq(0).addClass('btn btn-xs');
				buttons.eq(1).addClass('btn btn-xs btn-success');
				buttons.wrapInner('<span class="bigger-110" />');
			}, 0);
		}

	});
	$(datePickerId).val(selDate);
}

function confirms(msg,ok)
{
	var dialog = '<div id="confirm_message_dialog" class="hide"><p id="confirm_content"></p></div>';
	var $ele = $("body").find("#confirm_message_dialog")
	if($ele.length<1){
        $("body").append(dialog);
	}
    var title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign red'></i>提示</h4></div>"
    document.getElementById("confirm_content").innerHTML = msg;
    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
        _title: function(title) {
            var $title = this.options.title || '&nbsp;'
            if( ("title_html" in this.options) && this.options.title_html == true )
                title.html($title);
            else title.text($title);
        }
    }));
    var dialog = $( "#confirm_message_dialog" ).removeClass('hide').dialog({
        modal: true,
        title:title,
        title_html: true,
        buttons: [
            {
                ID:"confirm_yes",
                text: "确定",
                "class" : "btn btn-primary btn-xs",
                click: function() {
                	if(ok && typeof ok =="function"){
                		ok();
					}
                    $( this ).dialog( "close" );
                    return 1;
                }
            },
            {
                ID:"confirm_no",
                text: "取消",
                "class" : "btn btn-xs",
                click: function() {
                    $( this ).dialog( "close" );
                    return 2;
                }
            }
        ]
    });
}

function alerts(msg)
{
    var dialog = '<div id="alert_message_dialog" class="hide"><p id="alert_content"></p></div>';
    var $ele = $("body").find("#alert_message_dialog")
    if($ele.length<1){
        $("body").append(dialog);
    }
    var title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign red'></i>提示</h4></div>"
    document.getElementById("alert_content").innerHTML = msg;
    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
        _title: function(title) {
            var $title = this.options.title || '&nbsp;'
            if( ("title_html" in this.options) && this.options.title_html == true )
                title.html($title);
            else title.text($title);
        }
    }));
    var dialog = $( "#alert_message_dialog" ).removeClass('hide').dialog({
        modal: true,
        title:title,
        title_html: true,
        buttons: [
            {
                ID:"confirm_yes",
                text: "确定",
                "class" : "btn btn-primary btn-xs",
                click: function() {
                    $( this ).dialog( "close" );
                    return false;
                }
            }
        ]
    });
}

function initDateNow(datePickerId)
{
	$(datePickerId).datepicker({
		showOtherMonths: true,
		selectOtherMonths: false,
		dateFormat: 'yy/mm/dd',
		changeMonth: true,
		changeYear: true,

		showButtonPanel: true,
		beforeShow: function() {
			//change button colors
			var datepicker = $(this).datepicker( "widget" );
			setTimeout(function(){
				var buttons = datepicker.find('.ui-datepicker-buttonpane')
					.find('button');
				buttons.eq(0).addClass('btn btn-xs');
				buttons.eq(1).addClass('btn btn-xs btn-success');
				buttons.wrapInner('<span class="bigger-110" />');
			}, 0);
		}
	});

	var currDate = new Date();
	var dateTime = currDate.getTime();
	var nowDate = new Date(dateTime);
	var year = nowDate.getFullYear();

	var month = nowDate.getMonth()+1;
	if(month<10)
		month='0'+month;
	var day = nowDate.getDate();
	if(day<10)
		day='0'+day;

	$(datePickerId).val(year +"/" + month +"/" + day);
}
////////////
function _iframe(title,url) {
	zeroModal.show({
		title: title,
		iframe: true,
		url: url,
		width: '80%',
		height: '80%',
		cancel: true,
		overlay:true,
		overlayClose:true/*,
		onComplete:function()
		{
			var heightIFrame = $("#zeroModalBodyIFrame").height();
			$("#zeroModalBody").css("height",heightIFrame+80);
			$("#zeroModalContainer").css("height",(heightIFrame+100));
		}*/
	});
}

function _iframe2(title,url) {
	zeroModal.show({
		title: title,
		iframe: true,
		url: url,
		width: '80%',
		height: '80%',
		cancel: true,
		overlay:true,
		overlayClose:true,
		ok: true,
		okTitle: '提交',
		okFn:getSelectInfo,
		onClosed:getCloseFun
	});
}


function afterSubmitFunc(response,postdata)
{
	var resultObj = $.parseJSON(response.responseText);
	var resultStr = resultObj.result;
	var title = "";
	var resultStrArray = resultStr.split(":");
	if(resultStrArray[0] == "failed")
	{
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign red'></i> 错误</h4></div>"
	}
	else{
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-ok'></i> 成功</h4></div>"
	}

	var message_content = resultStrArray[1];
	//document.getElementById("message_content").innerHTML = message_content;
	$("#message_content").text(message_content);
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
					_title: function(title) {
						var $title = this.options.title || '&nbsp;'
						if( ("title_html" in this.options) && this.options.title_html == true )
							title.html($title);
						else title.text($title);
					}
				}));
	var dialog = $( "#message_dialog" ).removeClass('hide').dialog({
						modal: true,
						title:title,
						title_html: true,
						buttons: [ 
							{
								text: "确定",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( this ).dialog( "close" ); 
								} 
							}
						]
					});
					
	return [true,''];
}
function XGafterSubmitFunc(response,postdata)
{
	var resultObj = $.parseJSON(response.responseText);
	var resultStr = resultObj.result.saveRes;
	var title = "";
    document.getElementById("SQXS").innerText=resultObj.result.SQXS;
	document.getElementById("SQJS").innerText=resultObj.result.SQJS;
	document.getElementById("SQED").innerText=resultObj.result.SQED;
	if((resultStr.split(":"))[0] == "failed")
	{
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign red'></i> 错误</h4></div>"
	}
	else{
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-ok'></i> 成功</h4></div>"
	}

	document.getElementById("message_content").innerHTML = (resultStr.split(":"))[1];

	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function(title) {
			var $title = this.options.title || '&nbsp;'
			if( ("title_html" in this.options) && this.options.title_html == true )
				title.html($title);
			else title.text($title);
		}
	}));
	var dialog = $( "#message_dialog" ).removeClass('hide').dialog({
		modal: true,
		title:title,
		title_html: true,
		buttons: [
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( this ).dialog( "close" );
				}
			}
		]
	});

	return [true,''];
}

function scannerMsg(resultStr, url, param) {
	var title = "";
	var banner = (resultStr.split(":"))[0];
	if (banner == "failed") {
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign red'></i> 错误</h4></div>"
	} else if (banner == "warnning") {
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign'></i> 提示</h4></div>";
	} else {
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-ok'></i> 成功</h4></div>"
	}
	document.getElementById("message_content").innerHTML = (resultStr.split(":"))[1];
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function(title) {
			var $title = this.options.title || '&nbsp;'
			if( ("title_html" in this.options) && this.options.title_html == true )
				title.html($title);
			else title.text($title);
		}
	}));
	if (banner == "insert") {
		if (confirm((resultStr.split(":"))[1])) {
			operationFunc(param, url, function (result) {
				var val = $.parseJSON(result);
				var resultSt = val.result;
				showMsg(resultSt);
			});
		}
	} else {
		var dialog = $( "#message_dialog" ).removeClass('hide').dialog({
			modal: true,
			title:title,
			title_html: true,
			buttons: [
				{
					text: "确定",
					"class" : "btn btn-primary btn-xs",
					click: function() {
						$( this ).dialog( "close" );
					}
				}
			]
		});
	}
}

function showMsg(resultStr)
{
	var title = "";
	var resultStrArray = resultStr.split(":");
	if(resultStrArray[0] == "failed")
	{
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign red'></i> 错误</h4></div>"
	}
	else if((resultStr.split(":"))[0] == "warnning"){
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign'></i> 提示</h4></div>"
	}
	else{
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-ok'></i> 成功</h4></div>"
	}
	var message_content = resultStrArray[1];
	//document.getElementById("message_content").innerHTML = (resultStr.split(":"))[1];
	$("#message_content").text(message_content);
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function(title) {
			var $title = this.options.title || '&nbsp;'
			if( ("title_html" in this.options) && this.options.title_html == true )
				title.html($title);
			else title.text($title);
		}
	}));
	var dialog = $( "#message_dialog" ).removeClass('hide').dialog({
		modal: true,
		title:title,
		title_html: true,
		buttons: [
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( this ).dialog( "close" );
				}
			}
		]
	});
}

function showMsgAndClose(resultStr,itemName,itemUrl,closeId)
{
	var title = "";
	var resultStrArray = resultStr.split(":");
	if(resultStrArray[0] == "failed")
	{
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign red'></i> 错误</h4></div>"
	}
	else{
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-ok'></i> 成功</h4></div>"
	}

	var message_content = resultStrArray[1];
	document.getElementById("message_content").innerHTML = message_content;
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function(title) {
			var $title = this.options.title || '&nbsp;'
			if( ("title_html" in this.options) && this.options.title_html == true )
				title.html($title);
			else title.text($title);
		}
	}));
	var dialog = $( "#message_dialog" ).removeClass('hide').dialog({
		modal: true,
		title:title,
		title_html: true,
		buttons: [
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( this ).dialog( "close" );
					parent.showNewTab(itemName, itemUrl);
					if(null != closeId){
						closeTabByName(closeId);
					}
				}
			}
		]
	});
}


function showMsgByName(resultStr,funName)
{
	var title = "";
	var resultStrArray = resultStr.split(":");
	if(resultStrArray[0] == "failed")
	{
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign red'></i> 错误</h4></div>"
	}
	else{
		title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-ok'></i> 成功</h4></div>"
	}

	var message_content = resultStrArray[1];
	document.getElementById("message_content").innerHTML = message_content;

	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function(title) {
			var $title = this.options.title || '&nbsp;'
			if( ("title_html" in this.options) && this.options.title_html == true )
				title.html($title);
			else title.text($title);
		}
	}));
	var dialog = $( "#message_dialog" ).removeClass('hide').dialog({
		modal: true,
		title:title,
		title_html: true,
		buttons: [
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( this ).dialog( "close" );
					eval(funName);
				}
			}
		]
	});
}


function findLocaltaskName_StopState() {
	var taskName = "";
	var url = "findLocalTaskName_StopState";
	var paras = "";
	operationFunc(paras, url, function (result) {
		var val = $.parseJSON(result);
		$.each(val, function (id, item) {
			if (taskName != "") {
				taskName = taskName + ";" + item.code + ":" + item.name;
			} else {
				taskName = ":;" + item.code + ":" + item.name;
			}
		});
	});

	return taskName;
}

function findtaskName_LocalLevel_NoDraftState() {
	var taskName = "";
	var url = "findCCGLYearApplyFormLowLevelActionTaskName";
	var paras = "";
	operationFunc(paras, url, function (result) {
		var val = $.parseJSON(result);
		$.each(val, function (id, item) {
			if (taskName != "") {
				taskName = taskName + ";" + item.code + ":" + item.name;
			} else {
				taskName = ":;" + item.code + ":" + item.name;
			}
		});
	});

	return taskName;
}
