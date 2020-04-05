/**
 * 
 */
if (top.location != self.location) {
    top.location = self.location; 
}
$(function() {
	$("#form").submit(function(){
		var submit = true;
		var username = $("#username").val();
		var passwd = $("#passwd").val();
		var usernamemsg = $("#usernamemsg");
		var passwdmsg = $("#passwdmsg");
		usernamemsg.text("");
		passwdmsg.text("");
		if(username == ""){
			usernamemsg.text("账号不能为空！");
			submit=false;
		}
		if(passwd == ""){
			passwdmsg.text("密码不能为空！");
			submit=false;
		}
		return submit;
	});
});

