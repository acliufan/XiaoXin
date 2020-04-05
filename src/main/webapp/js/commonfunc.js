		jQuery(function($) {
			filterClick();
		});
		var grid_selector = "#grid-table";
		var pager_selector = "#grid-pager";
		
		function findEntitys(url,paras,callbackFunc){
			var entitys="";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val,function(id,item){
					if(entitys!=""){
						entitys=entitys+";"+item.code+":"+item.name;
					}else{
						entitys=item.code+": ;"+item.code+":"+item.name;
					}
				});
			});
			callbackFunc(entitys);
		}

		//获取六大类设备
		function findDeviceTypes(){
			var  entitys="";
			entitys="计算机设备:计算机设备";
			entitys=entitys+";办公自动化设备:办公自动化设备";
			entitys=entitys+";存储设备:存储设备";
			entitys=entitys+";仪器仪表:仪器仪表";
			entitys=entitys+";营具:营具";
			entitys=entitys+";消防器材:消防器材";
			return  entitys;
		}
		//获取六大类设备
		function findCheckTypes(){
			var  entitys="";
			entitys="部门:部门";
			entitys=entitys+";房间号:房间号";
			return  entitys;
		}

		
		function findEntitys1(url,paras,callbackFunc){
			var entitys="";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val,function(id,item){
					if(entitys!=""){
						entitys=entitys+";"+item.code+":"+item.name;
					}else{
						entitys=item.code+": ;"+item.code+":"+item.name;
					}
				});
			});
			callbackFunc(entitys);
		}

		//jqgrid的select专用
		function findTheDepts(){
			var paras = '';
			var url="findDepts";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val,function(id,item){
					if(depts!=""){
						depts=depts+";"+item.deptCode+":"+item.deptName;
					}else{
						depts=":;"+item.deptCode+":"+item.deptName;
					}
				});
			});
		}

		//jqgrid的select专用
		function findTheShortDepts(){
			var paras = '';
			var tempx=':';
			var url="findShortDepts";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val,function(id,item){
					tempx=tempx+";"+item.deptCode+":"+item.deptName;
				});
			});
			return tempx;
		}

		//用户类型
		function findJCSJDWMLs(){
			var url="queryCompanyDirectory";
			var paras="";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val.rows,function(id,item){
					if(dwmls!=""){
						dwmls=dwmls+";"+item.DWDM+":"+item.DWMC;
					}else{
						dwmls=item.DWDM+": ;"+item.DWDM+":"+item.DWMC;
					}
				});
			});
		}
		//用户
		function finduser(){
			var url="finduser";
			var paras="";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val,function(id,item){
					if(userinfo!=""){
						userinfo=userinfo+";"+item.code+":"+item.name;
					}else{
						userinfo=item.code+": ;"+item.code+":"+item.name;
					}
				});
			});
		}

		function findRoles(){
			var url="queryTheRole";
			var paras="";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val.rows,function(id,item){
					if(roles!=""){
						roles=roles+";"+item.roleCode+":"+item.roleName;
					}else{
						roles=item.roleCode+": ;"+item.roleCode+":"+item.roleName;
					}
				});
			});
		}

		function findRoleNews(){
			var url="queryTheRole";
			var paras="";
			var roleResult="";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val.rows,function(id,item){
					if(roleResult!=""){
						roleResult=roleResult+";"+item.roleCode+":"+item.roleName;
					}else{
						roleResult=item.roleCode+":"+item.roleName;
					}
				});
			});
			return roleResult;
		}

		function findUserTypes(){
			var url="findUserTypes";
			var paras="";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val.rows,function(id,item){
					if(userTypes!=""){
						userTypes=userTypes+";"+item.userTypeCode+":"+item.userType;
					}else{
						userTypes=item.userTypeCode+": ;"+item.userTypeCode+":"+item.userType;
					}
				});
			});
		}
		
		function refresh(grid_selector,url,param){
			jQuery(grid_selector).jqGrid('setGridParam',{
				url:url+param,
				page: 1
			}).trigger('reloadGrid');
		}
		
	    function _iframe(title,url) {
	        var  unique = zeroModal.show({
	            title: title,
	            iframe: true,
	            url: url,
	            width: '80%',
	            height: '80%',
	            cancel: true
	        });
			return unique;
	    }

		//宽度和高度
		function iframe(title,url,w,h) {
			var  unique = zeroModal.show({
				title: title,
				iframe: true,
				url: url,
				width: w,
				height: h,
				cancel: true
			});
			return unique;
		}
	    
	    function _piframe(title,url) {
	        parent.zeroModal.show({
	            title: title,
	            iframe: true,
	            url: url,
	            width: '80%',
	            height: '80%',
	            cancel: true
	        });
	    }
	    
	
	    
		function filterClick(){
        $("#id_btn_Filter").on('click', function (e) {
            e.preventDefault();

            $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
                _title: function (title) {
                    var $title = this.options.title || '&nbsp;'
                    if (("title_html" in this.options) && this.options.title_html == true)
                        title.html($title);
                    else title.text($title);
                }
            }));

            var dialog = $("#Filter_dialog").removeClass('hide').dialog({
                modal: true,
                width: 400,
                title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-search'></i> 筛选条件</h4></div>",
                title_html: true,
                success: "",
                buttons: [
                    {
                        text: "查看",
                        "class": "btn btn-primary btn-xs",
                        click: function () {
                        	searchFresh();
                            $(this).dialog("close");
                        }
                    }
                ]
            });

        });	  
		}

		function findDepts(){
			var options = '<option value="">  </option>';
			var url="findDepts";
			var paras="";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val,function(id,item){
					options =options + '<option value="'+item.deptCode+'"> '+item.deptName+' </option>';
				});
			});
			return options;
		}

		function findUsers(){
			var options = '<option value="">  </option>';
			var url="findUsers";
			var paras="";
			operationFunc(paras, url, function(result){
				var val = $.parseJSON(result);
				$.each(val,function(id,item){
					options =options + '<option value="'+item.ID+'"> '+item.userName+' </option>';
				});

			});
			return options;
		}

		