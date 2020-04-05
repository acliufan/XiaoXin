//查询字典数据
function findCONSENUM(queryCol) {
	var url = "findPublicCONSENUM";
	var paras = "selStr="+queryCol;
	var optionDate = "";
	operationFunc(paras, url, function (result) {
		optionDate = $.parseJSON(result);
	});
	return optionDate;
}

/**
 * 查询类型下拉框数据
 * @param queryCol 查询表头字段
 * @param sel 下拉框id
 */
function initSelCONSENUM(queryCol,sel) {
	var tempsArray = findCONSENUM(queryCol);
	var obj = document.getElementById(sel);
	obj.options.add(new Option('', ''));
	var resultStr = '';
	for (var i = 0; i < tempsArray.length; i++) {
		obj.options.add(new Option(tempsArray[i].value, tempsArray[i].code));
		if(i != 0)
			resultStr = resultStr + ';';
		resultStr = resultStr + tempsArray[i].code + ':' + tempsArray[i].value ;
	}
	return resultStr;
}

//生成 grid表格下拉框格式数控
function editOptionsCONSENUM(queryCol) {
	var tempsArray = findCONSENUM(queryCol);
	var str='';
	for (var i = 0; i < tempsArray.length; i++) {
		str = str + tempsArray[i].code + ":" +tempsArray[i].name;
		if( i != tempsArray.length-1)
			str = str + ";";
	}
	return str;
}

//根据指定code获取显示数值
function getCONSENUMValue(temps,selStr) {
	var tempsArray = temps.split(";");
	for (var i = 0; i < tempsArray.length; i++) {
		if(selStr == tempsArray[i].split(":")[0])
			return tempsArray[i].split(":")[1];
	}
}



//查询部门
function findDeptsNew() {
	var url = "findDepts";
	var paras = "";
	var depts = "";
	operationFunc(paras, url, function (result) {
		var val = $.parseJSON(result);
		$.each(val, function (id, item) {
			if (depts != "") {
				depts = depts + ";" + item.code + ":" + item.name;
			} else {
				depts = item.code + ":" + item.name;
			}
		});
	});
	return depts;
}

//查询一级分类
function findFirstTypes() {
	var url = "findFirstTypes?type=2";
	var paras = "";
	var temps = "";
	operationFunc(paras, url, function (result) {
		var val = $.parseJSON(result);
		$.each(val, function (id, item) {
			if (temps != "") {
				temps = temps + ";" + item.code + ":" + item.name;
			} else {
				temps = item.code + ":" + item.name;
			}
		});
	});
	return temps;
}

//查询一级分类
function findAllFirstTypes() {
	var url = "findFirstTypes";
	var paras = "";
	var temps = "";
	operationFunc(paras, url, function (result) {
		var val = $.parseJSON(result);
		$.each(val, function (id, item) {
			if (temps != "") {
				temps = temps + ";" + item.code + ":" + item.name;
			} else {
				temps = item.code + ":" + item.name;
			}
		});
	});
	return temps;
}

//查询二级分类
function findSecondTypes(firstTypeCode) {
	var url = "findSecondTypes?firstTypeCode=" + firstTypeCode;
	var paras = "";
	var temps = "";
	operationFunc(paras, url, function (result) {
		var val = $.parseJSON(result);
		$.each(val, function (id, item) {
			if (temps != "") {
				temps = temps + ";" + item.code + ":" + item.name;
			} else {
				temps = item.code + ":" + item.name;
			}
		});
	});
	return temps;
}

//查询分类代码
function findAccountInfos() {
	var url = "findAccountcodeAndName";
	var paras = "";
	var temps = "";
	operationFunc(paras, url, function (result) {
		var val = $.parseJSON(result);
		$.each(val, function (id, item) {
			if (temps != "") {
				temps = temps + ";" + item.code + ":" + item.name;
			} else {
				temps = item.code + ":" + item.name;
			}
		});
	});
	return temps;
}

//查询人员信息
function findUserInfos() {
	var url = "findUsersForPurchaser";
	var paras = "";
	var temps = "";
	operationFunc(paras, url, function (result) {
		var val = $.parseJSON(result);
		$.each(val, function (id, item) {
			if (temps != "") {
				temps = temps + ";" + item.code + ":" + item.name;
			} else {
				temps = item.code + ":" + item.name;
			}
		});
	});
	return temps;
}

//查询部门的人员信息
function findUserInfoByDepts(deptCode) {
	var url = "findUsersForPurchaser?deptCode="+deptCode;
	var paras = "";
	var temps = "";
	operationFunc(paras, url, function (result) {
		var val = $.parseJSON(result);
		$.each(val, function (id, item) {
			if (temps != "") {
				temps = temps + ";" + item.code + ":" + item.name;
			} else {
				temps = item.code + ":" + item.name;
			}
		});
	});
	return temps;
}

//查询仪器和设备位置信息
function findAllUsePalec() {
	var url = "getUsePlaceInfo";
	var paras = "";
	var temps = ":";
	operationFunc(paras, url, function (result) {
		var val = $.parseJSON(result);
		$.each(val, function (id, item) {
			temps = temps + ";" + item.code + ":" + item.name;
		});
	});
	return temps;
}