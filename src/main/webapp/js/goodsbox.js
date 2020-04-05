/*function contactGoodsBoxDetail(id, detailUrl) {
 zeroModal.show({
 title : '货架信息',
 iframe : false,
 url : detailUrl + '?code=' + id,
 width : '80%',
 height: 'auto',
 ok: true,
 okFn : function() {
 $("#grid-table").trigger("reloadGrid");
 }
 });
 }*/
function _Myiframe(title, url) {
    zeroModal.show({
        title: title,
        iframe: true,
        url: url,
        width: '80%',
        height: '49%',
        ok: true
    });
}
function contactGoodsBoxDetail(id, detailUrl) {
    var url = '/' + detailUrl + '?code=' + id;
    _Myiframe('货架信息', url);
}
function getShelfsList(para) {
    var url = "findGoodsBox";
    var results = "";
    operationFunc(para, url, function (result) {
        if (result != "" && result != undefined && result != null && typeof(result)!="object")
            results = $.parseJSON(result);
    });

    return results;
}

function showAllShelfs(para) {
    var allShelfs = $("#all_shelfs");
    allShelfs.empty();
    var output = "";
    var shelfs = getShelfsList(para);
    if (shelfs == null || shelfs == "") {
        return;
    }

    for (var i = 0; i < shelfs.shelfNames.length; i++) {
        var shelfHtml = '<li>\
							<a onclick="contactGoodsBoxDetail(\'' + shelfs.shelfNames[i] + '\', \'' + 'goodsBoxDetail' + '\')" data-rel="colorbox">\
								<p class="text-error" style="font-size:18px">' + '货架' + shelfs.shelfNames[i] + '</p>\
								<img alt="150x150" src="images/goodsbox.png" style="width:150px;height:120px" />\
								<div class="text">\
									<div class="inner">' + '已占用' + shelfs.shelfValues[i] + '格' + '</div>\
								</div>\
							</a>\
						 </li>';
        output += shelfHtml;
    }
    allShelfs.append(output);
}

function getShelfItems(url, para) {
    var paras = "";
    var url = "findGoodsBoxDetail";
    var results = "";
    if (para != undefined) paras = 'code=' + para;
    operationFunc(paras, url, function (result) {
        results = $.parseJSON(result);
    });

    return results;
}

function fillItems(rowLen, colLen, items) {
    var itemsArray = new Array(rowLen);
    for (var i = 0; i < itemsArray.length; i++) {
        itemsArray[i] = new Array(colLen);
        for (var j = 0; j < itemsArray[i].length; j++) {
            itemsArray[i][j] = {"boxCode": "空", "goodsName": "无", "goodsNum": "0"};
        }
    }

    for (var i = 0; i < items.total; i++) {
        itemsArray[items.rows[i].rowNum - 1][items.rows[i].colNum - 1] =
        {"boxCode": items.rows[i].boxCode, "goodsName": items.rows[i].goodsName, "goodsNum": items.rows[i].goodsNum};
    }
    return itemsArray;
}

function showShelfItems(url, para) {
    var allItems = $("#all_items");
    allItems.empty();
    var output = "";
    var items = getShelfItems(url, para);
    var shelfRow = 4;
    var shelfCol = 5;
    var itemsArray = fillItems(shelfRow, shelfCol, items);

    for (var i = 0; i < shelfRow; i++) {
        shelfHtml = '<tr>';
        for (var j = 0; j < shelfCol; j++) {
            shelfHtml += '<td>';
            shelfHtml += '<div class="infobox infobox-green  ">\
							<div class="infobox-icon">\
								<i class="icon-comments"></i>\
							</div>\
						    <div class="infobox-data">\
								<span class="infobox-data-number">' + itemsArray[i][j].boxCode + '</span>\
								<div class="infobox-content" style="font-size:14px">' + itemsArray[i][j].goodsName + " 数量:"+itemsArray[i][j].goodsNum+ '</div>\
							</div>\
						  </div>';
            shelfHtml += '</td>';
        }
        shelfHtml += '</tr>';
        output += shelfHtml;
    }
    allItems.append(output);
}