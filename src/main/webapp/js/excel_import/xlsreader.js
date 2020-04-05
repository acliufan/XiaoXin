var X = XLSX;
var XW = {
	/* worker message */
	msg : 'xlsx',
	/* worker scripts */
	rABS : './xlsxworker2.js',
	norABS : './xlsxworker1.js',
	noxfer : './xlsxworker.js'
};

var rABS = typeof FileReader !== "undefined"
		&& typeof FileReader.prototype !== "undefined"
		&& typeof FileReader.prototype.readAsBinaryString !== "undefined";
if (!rABS) {
	document.getElementsByName("userabs")[0].disabled = true;
	document.getElementsByName("userabs")[0].checked = false;
}

var use_worker = typeof Worker !== 'undefined';
if (!use_worker) {
	document.getElementsByName("useworker")[0].disabled = true;
	document.getElementsByName("useworker")[0].checked = false;
}

var transferable = use_worker;
if (!transferable) {
	document.getElementsByName("xferable")[0].disabled = true;
	document.getElementsByName("xferable")[0].checked = false;
}

var wtf_mode = false;

function fixdata(data) {
	var o = "", l = 0, w = 10240;
	for (; l < data.byteLength / w; ++l)
		o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l
				* w + w)));
	o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
	return o;
}

function ab2str(data) {
	var o = "", l = 0, w = 10240;
	for (; l < data.byteLength / w; ++l)
		o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w,
				l * w + w)));
	o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
	return o;
}

function s2ab(s) {
	var b = new ArrayBuffer(s.length * 2), v = new Uint16Array(b);
	for (var i = 0; i != s.length; ++i)
		v[i] = s.charCodeAt(i);
	return [ v, b ];
}

function xw_noxfer(data, cb) {
	var worker = new Worker(XW.noxfer);
	worker.onmessage = function(e) {
		switch (e.data.t) {
		case 'ready':
			break;
		case 'e':
			console.error(e.data.d);
			break;
		case XW.msg:
			cb(JSON.parse(e.data.d));
			break;
		}
	};
	var arr = rABS ? data : btoa(fixdata(data));
	worker.postMessage({
		d : arr,
		b : rABS
	});
}

function xw_xfer(data, cb) {
	var worker = new Worker(rABS ? XW.rABS : XW.norABS);
	worker.onmessage = function(e) {
		switch (e.data.t) {
		case 'ready':
			break;
		case 'e':
			console.error(e.data.d);
			break;
		default:
			xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
			console.log("done");
			cb(JSON.parse(xx));
			break;
		}
	};
	if (rABS) {
		var val = s2ab(data);
		worker.postMessage(val[1], [ val[1] ]);
	} else {
		worker.postMessage(data, [ data ]);
	}
}

function xw(data, cb) {
	transferable = document.getElementsByName("xferable")[0].checked;
	if (transferable)
		xw_xfer(data, cb);
	else
		xw_noxfer(data, cb);
}

function get_radio_value(radioName) {
	var radios = document.getElementsByName(radioName);
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked || radios.length === 1) {
			return radios[i].value;
		}
	}
}

function to_json(workbook) {
	var result = {};
	workbook.SheetNames
			.forEach(function(sheetName) {
				var roa = X.utils
						.sheet_to_row_object_array(workbook.Sheets[sheetName]);
				if (roa.length > 0) {
					result[sheetName] = roa;
				}
			});
	return result;
}

function to_csv(workbook) {
	var result = [];
	//workbook.SheetNames.forEach(function(sheetName) {
    var csv = X.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);//		var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
	if (csv.length > 0) {
		//result.push("SHEET: " + sheetName);
		//result.push("");
		result.push(csv);
	}
	//});
	return result.join("\n");
}

function to_formulae(workbook) {
	var result = [];
	workbook.SheetNames.forEach(function(sheetName) {
		var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
		if (formulae.length > 0) {
			result.push("SHEET: " + sheetName);
			result.push("");
			result.push(formulae.join("\n"));
		}
	});
	return result.join("\n");
}

var tarea = document.getElementById('b64data');
function b64it() {
	if (typeof console !== 'undefined')
		console.log("onload", new Date());
	var wb = X.read(tarea.value, {
		type : 'base64',
		WTF : wtf_mode
	});
	process_wb(wb);
}


function process_wb(wb) {
    var output = "";
    var val = get_radio_value("format");
	switch (get_radio_value("format")) {
	case "json":
		output = JSON.stringify(to_json(wb), 2, 2);
		break;
	case "form":
		output = to_formulae(wb);
		break;
	default:
		output = to_csv(wb);
	}
	// if(out.innerText === undefined) out.textContent = output;
	// else out.innerText = output;
	if (typeof console !== 'undefined')
	  console.log("output", new Date());
    return output;
}

function handleDragover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}

function xls_show_dialog(result) {
	ret = false;
	var resultStr = $.parseJSON(result).result;
	
	if((resultStr.split(":"))[0] == "failed")
	{
	    title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-warning-sign red'></i> 失败 </h4></div>";
	    ret = false;
	}
	else{
	    title = "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-ok'></i> 成功</h4></div>";
	    ret = true;
	}
    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
        _title: function(title) {
            var $title = this.options.title || '&nbsp;'
            if( ("title_html" in this.options) && this.options.title_html == true )
                title.html($title);
            else title.text($title);
        }
    }));
    document.getElementById("message_content").innerHTML = "插入" + resultStr.split(":")[1];     
    var dialog = $( "#message_dialog" ).removeClass('hide').dialog({
        modal: true,
        title: title,
        title_html: true,
        buttons: [ 
            {
                text: "確定",
                "class" : "btn btn-primary btn-xs",
                click: function() {
                    $( this ).dialog( "close" ); 
                } 
            }
        ]
    });
    return ret;
}

function insert_db(condition) {
    var url = importUrlExcel;
    var paras = "code=" + condition;  // Excel content

    if (url == "importGoodsBoxExcel") {
        operationFunc(paras, url, function(result) {
            var ret = xls_show_dialog(result);
            if (ret == true) {
            	show_all_shelfs();         	
            }
        });
    } else {
        operationFunc(paras, url, function(result) {
            var gridTableId = "#grid-table";
            var ret = xls_show_dialog(result);
            if (ret == true) {
                jQuery(gridTableId).jqGrid('setGridParam', {
                    datatype : "json",
                    url : queryUrl
                }).trigger('reloadGrid');        	
            }
        });    	
    }
}

function handleFile(e) {
	rABS = null;// document.getElementsByName("userabs")[0].checked;
	use_worker = null;// document.getElementsByName("useworker")[0].checked;

	var files = e.target.files;
	var f = files[0];
	{
		var reader = new FileReader();
		var name = f.name;
		reader.onload = function(e) {
			if (typeof console !== 'undefined')
				console.log("onload", new Date(), rABS, use_worker);
			var data = e.target.result;
			if (use_worker) {
				xw(data, process_wb);
			} else {
				var wb;
				if (rABS) {
					wb = X.read(data, {
						type : 'binary'
					});
				} else {
					var arr = fixdata(data);
					wb = X.read(btoa(arr), {
						type : 'base64'
					});
				}
			  var excel_output = process_wb(wb);
              insert_db(excel_output);
			}
		};
		if (rABS)
			reader.readAsBinaryString(f);
		else
		  reader.readAsArrayBuffer(f);
	}
}

