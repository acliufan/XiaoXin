function afterShow(resultStr,itemName ,callback)
{
	var title = "";
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
									
									if(null != itemName){
										window.parent.getUrl(itemName);
									}

									if(null != callback && undefined != callback){
										eval(callback);
									}
								} 
							}
						]
					});
	
	return [true,''];
}

function showTheMessage(resultStr,itemName)
{
	var title = "提示";

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

					if(null != itemName){
						window.parent.changePage(itemName);
					}
				}
			}
		]
	});

	return [true,''];
}