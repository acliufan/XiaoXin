
//////////
/*
 * 根据data项创建jqgrid表
 * @author minsheng.bai
 * @time 2016-11-10
 */
function createJQGridTableByGridData(gridDatas,gridTableId,girdPaperId,gridCaption,colNames,colModels,operateStatus,gridEditUrl) 
{

	var grid_selector = gridTableId;
	var pager_selector = girdPaperId;

	jQuery(gridTableId).jqGrid('clearGridData');
	
	jQuery(grid_selector).jqGrid({
		data:gridDatas,			
		datatype: "local",
		height: 'auto',
		colNames:colNames,
		colModel:colModels, 
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,100,500,1000],
		pager : pager_selector,
		altRows: true,
		//toppager: true,
		
		multiselect: true,
		//multikey: "ctrlKey",
		multiboxonly: true,

		loadComplete : function() {
			setJqgridCss();
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);
				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		//url:gridUrl,
		editurl: gridEditUrl,
		caption: gridCaption,
		autowidth: true
	});

	//navButtons
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
	{ 	//navbar options
		edit: operateStatus[0],
		editicon : 'icon-pencil blue',
		add: operateStatus[1],
		addicon : 'icon-plus-sign purple',
		del: operateStatus[2],
		delicon : 'icon-trash red',
		search: operateStatus[3],
		searchicon : 'icon-search orange',
		refresh: operateStatus[4],
		refreshicon : 'icon-refresh green',
		view: operateStatus[5],
		viewicon : 'icon-zoom-in grey',
	},
	{
		//edit record form
		//closeAfterEdit: true,
		recreateForm: true,
		beforeShowForm : function(e) {
			var form = $(e[0]);
			form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
			style_edit_form(form);
		}
	},
	{
		//new record form
		closeAfterAdd: true,
		recreateForm: true,
		viewPagerButtons: false,
		beforeShowForm : function(e) {
			var form = $(e[0]);
			form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
			style_edit_form(form);
		}
	},
	{
		//delete record form
		recreateForm: true,
		beforeShowForm : function(e) {
			var form = $(e[0]);
			if(form.data('styled')) return false;
			
			form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
			style_delete_form(form);
			
			form.data('styled', true);
		},
		onClick : function(e) {
			alert(1);
		}
	},
	{
		//search form
		recreateForm: true,
		afterShowSearch: function(e){
			var form = $(e[0]);
			form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			style_search_form(form);
		},
		afterRedraw: function(){
			style_search_filters($(this));
		},
		multipleSearch: true
		//multipleGroup:true,
		//showQuery: true
		
	},
	{
		//view record form
		recreateForm: true,
		beforeShowForm: function(e){
			var form = $(e[0]);
			form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
		}
	}
	)
}

/**
 * 创建无checkbox和查看图标的表格
 */
function newGridTableByGridUrl(gridUrl,gridTableId,girdPaperId,gridCaption,colNames,colModels,operateStatus,jsonReaderObj,gridEditUrl,afterSubmitFn,isInit,initFunc,addInitStr)
{
	var grid_selector = gridTableId;
	var pager_selector = girdPaperId;
	jQuery(grid_selector).jqGrid({
		//direction: "rtl",
		url:gridUrl,
		datatype: "json",
		height: 'auto',
		colNames:colNames,
		colModel:colModels,
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,100,500],
		pager : pager_selector,
		altRows: true,
		//toppager: true,

		multiselect: false,
		multiboxonly: false,
		loadComplete : function() {
			setJqgridCss();
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);

				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		jsonReader:jsonReaderObj,
		editurl: gridEditUrl,
		caption: gridCaption,
		autowidth: true,
		shrinkToFit:true,
		//forceFit:true,
		//scrollrows:false,
	});

	//navButtons
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	//navbar options
			edit: operateStatus[0],
			editicon : 'icon-pencil blue',
			add: operateStatus[1],
			addicon : 'icon-plus-sign purple',
			del: operateStatus[2],
			delicon : 'icon-trash red',
			search: operateStatus[3],
			searchicon : 'icon-search orange',
			refresh: operateStatus[4],
			refreshicon : 'icon-refresh green',
		},
		{
			//edit record form
			top: 150,
			left: leftOffset,
			closeAfterEdit: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//new record form
			top: 150,
			left: leftOffset,
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(isInit)
				{
					initFunc(form);
				}
				eval(addInitStr);

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//delete record form
			top: 150,
			left: leftOffset,
			closeAfterDel: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);

				form.data('styled', true);
			},
			onClick : function(e) {
				alert(1);
			},
			afterSubmit:afterSubmitFn

		},
		{
			//search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,
		}

	)
}

/*
 * 根据url项创建jqgrid表
 * @author minsheng.bai
 * @time 2016-11-10
 */
 var selRowId;
function createJQGridTableByGridUrl(gridUrl,gridTableId,girdPaperId,gridCaption,colNames,colModels,operateStatus,jsonReaderObj,gridEditUrl,afterSubmitFn,isInit,initFunc,addInitStr)
{
	var grid_selector = gridTableId;
	var pager_selector = girdPaperId;
	jQuery(grid_selector).jqGrid({
		//direction: "rtl",
		url:gridUrl,
		datatype: "json",
		height: 'auto',
		colNames:colNames,
		colModel:colModels,
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,100,500],
		pager : pager_selector,
		altRows: true,
		//toppager: true,

		multiselect: true,
		//multikey: "ctrlKey",
		multiboxonly: true,
		onSelectRow:function(id){
			selRowId=id;
		},
		loadComplete : function() {
			setJqgridCss();
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);
				
				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		jsonReader:jsonReaderObj,
		editurl: gridEditUrl,
		caption: gridCaption,
		autowidth: true,
		shrinkToFit:true,
		//forceFit:true,
		//scrollrows:false,
	});

	//navButtons
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	//navbar options
			edit: operateStatus[0],
			editicon : 'icon-pencil blue',
			add: operateStatus[1],
			addicon : 'icon-plus-sign purple',
			addtext: '增加',
			del: operateStatus[2],
			delicon : 'icon-trash red',
			search: operateStatus[3],
			searchicon : 'icon-search orange',
			refresh: operateStatus[4],
			refreshicon : 'icon-refresh green',
			view: operateStatus[5],
			viewicon : 'icon-zoom-in grey',
		},
		{
			//edit record form
			top: 150,
			left: leftOffset,
			closeAfterEdit: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//new record form
			top: 150,
			left: leftOffset,
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(isInit)
				{
					initFunc(form);
				}
				eval(addInitStr);
				
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//delete record form
			top: 150,
			left: leftOffset,
			closeAfterDel: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;
				
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);
				
				form.data('styled', true);
			},
			onClick : function(e) {
				alert(1);
			},
			afterSubmit:afterSubmitFn

		},
		{
			//search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,
			
			//multipleGroup:true,
			//showQuery: true
			
		},
		{
			//view record form
			recreateForm: true,
			beforeShowForm: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		}
	)
}

var selRowId;
function createJQGridTableByGridUrlwithCellEdit(gridUrl,gridTableId,girdPaperId,gridCaption,colNames,colModels,operateStatus,jsonReaderObj,gridEditUrl,afterSubmitFn,isInit,initFunc,addInitStr,isCellEdit,cellEditUrl,ifMutilSelect,modifyStatus)
{
	var grid_selector = gridTableId;
	var pager_selector = girdPaperId;
	jQuery(grid_selector).jqGrid({
		cellEdit: isCellEdit,
		cellsubmit: "remote",//|clientArray
		cellurl: cellEditUrl,
		url:gridUrl,
		datatype: "json",
		height: 'auto',
		colNames:colNames,
		colModel:colModels,
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,100,500,1000],
		pager : pager_selector,
		altRows: true,
		//toppager: true,

		multiselect: ifMutilSelect,
		//multikey: "ctrlKey",
		multiboxonly: true,

		loadComplete : function() {
			setJqgridCss();
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);

				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		jsonReader:jsonReaderObj,
		editurl: gridEditUrl,
		caption: gridCaption,
		autowidth: true,
		shrinkToFit:true,
		afterSubmitCell:afterSubmitFn,
		//forceFit:true,
		//scrollrows:false,
	});

	//navButtons
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	//navbar options
			edit: operateStatus[0],
			editicon : 'icon-pencil blue',
			add: operateStatus[1],
			addicon : 'icon-plus-sign purple',
			addtext: '增加',
			del: operateStatus[2],
			delicon : 'icon-trash red',
			search: operateStatus[3],
			searchicon : 'icon-search orange',
			refresh: operateStatus[4],
			refreshicon : 'icon-refresh green',
			view: operateStatus[5],
			viewicon : 'icon-zoom-in grey',
		},
		{
			//edit record form
			top: 150,
			left: leftOffset,
			closeAfterEdit: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				modifyStatus(form,"edit");
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//new record form
			top: 150,
			left: leftOffset,
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				modifyStatus(form,"add");
				if(isInit)
				{
					initFunc(form);
				}
				eval(addInitStr);

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//delete record form
			top: 150,
			left: leftOffset,
			closeAfterDel: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);

				form.data('styled', true);
			},
			onClick : function(e) {
				alert(1);
			},
			afterSubmit:afterSubmitFn

		},
		{
			//search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,

			//multipleGroup:true,
			//showQuery: true

		},
		{
			//view record form
			recreateForm: true,
			beforeShowForm: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		}
	)
}

/*
 * 根据url项创建jqgrid表
 * @author minsheng.bai
 * @time 2016-11-10
 */
var selRowId;
function createJQGridTableByGridUrl(gridUrl,gridTableId,girdPaperId,gridCaption,colNames,colModels,operateStatus,jsonReaderObj,gridEditUrl,afterSubmitFn,isInit,initFunc,addInitStr)
{
	var grid_selector = gridTableId;
	var pager_selector = girdPaperId;
	jQuery(grid_selector).jqGrid({
		//direction: "rtl",
		url:gridUrl,
		datatype: "json",
		height: 'auto',
		colNames:colNames,
		colModel:colModels,
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,100,500],
		pager : pager_selector,
		altRows: true,
		//toppager: true,

		multiselect: true,
		//multikey: "ctrlKey",
		multiboxonly: true,
		onSelectRow:function(id){
			selRowId=id;
		},
		loadComplete : function() {
			setJqgridCss();
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);

				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		jsonReader:jsonReaderObj,
		editurl: gridEditUrl,
		caption: gridCaption,
		autowidth: true,
		shrinkToFit:true,
		//forceFit:true,
		//scrollrows:false,
	});

	//navButtons
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	//navbar options
			edit: operateStatus[0],
			editicon : 'icon-pencil blue',
			add: operateStatus[1],
			addicon : 'icon-plus-sign purple',
			addtext: '增加',
			del: operateStatus[2],
			delicon : 'icon-trash red',
			search: operateStatus[3],
			searchicon : 'icon-search orange',
			refresh: operateStatus[4],
			refreshicon : 'icon-refresh green',
			view: operateStatus[5],
			viewicon : 'icon-zoom-in grey',
		},
		{
			//edit record form
			top: 150,
			left: leftOffset,
			closeAfterEdit: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//new record form
			top: 150,
			left: leftOffset,
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(isInit)
				{
					initFunc(form);
				}
				eval(addInitStr);

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//delete record form
			top: 150,
			left: leftOffset,
			closeAfterDel: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);

				form.data('styled', true);
			},
			onClick : function(e) {
				alert(1);
			},
			afterSubmit:afterSubmitFn

		},
		{
			//search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,

			//multipleGroup:true,
			//showQuery: true

		},
		{
			//view record form
			recreateForm: true,
			beforeShowForm: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		}
	)
}

function createJQGridTableByGridUrlwithNoSel(gridUrl,gridTableId,girdPaperId,gridCaption,colNames,colModels,operateStatus,jsonReaderObj,gridEditUrl,afterSubmitFn,isInit,initFunc,addInitStr,isCellEdit,cellEditUrl,ifMutilSelect,modifyStatus,sortAttribute)
{
	var grid_selector = gridTableId;
	var pager_selector = girdPaperId;
	jQuery(grid_selector).jqGrid({
		cellEdit: isCellEdit,
		cellsubmit: "remote",//|clientArray
		cellurl: cellEditUrl,
		url:gridUrl,
		datatype: "json",
		height: 'auto',
		colNames:colNames,
		colModel:colModels,
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,100,500,1000],
		pager : pager_selector,
		altRows: true,
		//toppager: true,

		multiselect: false,
		//multikey: "ctrlKey",
		multiboxonly: false,

		loadComplete : function() {
			setJqgridCss();
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);

				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		sortorder:sortAttribute,
		jsonReader:jsonReaderObj,
		editurl: gridEditUrl,
		caption: gridCaption,
		autowidth: true,
		shrinkToFit:true,
		afterSubmitCell:afterSubmitFn,
		//forceFit:true,
		//scrollrows:false,
	});

	//navButtons
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	//navbar options
			edit: operateStatus[0],
			editicon : 'icon-pencil blue',
			add: operateStatus[1],
			addicon : 'icon-plus-sign purple',
			addtext: '增加',
			del: operateStatus[2],
			delicon : 'icon-trash red',
			search: operateStatus[3],
			searchicon : 'icon-search orange',
			refresh: operateStatus[4],
			refreshicon : 'icon-refresh green',
			view: operateStatus[5],
			viewicon : 'icon-zoom-in grey',
		},
		{
			//edit record form
			top: 150,
			left: leftOffset,
			closeAfterEdit: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//new record form
			top: 150,
			left: leftOffset,
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(isInit)
				{
					initFunc(form);
				}
				eval(addInitStr);

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//delete record form
			top: 150,
			left: leftOffset,
			closeAfterDel: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);

				form.data('styled', true);
			},
			onClick : function(e) {
				alert(1);
			},
			afterSubmit:afterSubmitFn

		},
		{
			//search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,

			//multipleGroup:true,
			//showQuery: true

		},
		{
			//view record form
			recreateForm: true,
			beforeShowForm: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		}
	)

	$("#add_grid-table").hide();
	$("#edit_grid-table").hide();
	$(".ui-separator").hide();
}

//by yuejin.wnag
function createJQGridTableByOptions(options)
{
    var defaultOptions = {
        gridSelector:"#grid-table",
        cellEdit: false,
        cellsubmit: "remote",//|clientArray
        datatype: "json",
        height: 'auto',
        viewrecords : true,
        rowNum:10,
        rowList:[10,20,30,100,500,1000],
        pager : "#grid-pager",
        altRows: true,
        multiselect: false,
        multiboxonly: false,


       // autowidth: true,
        shrinkToFit:false,
		autoScroll:true

    }
    var newOptions = $.extend(defaultOptions,options);
	var oldLoadComplate = newOptions.loadComplete;
    newOptions.loadComplete = function() {
        if(oldLoadComplate && typeof oldLoadComplate == "function"){
            oldLoadComplate();
        }
        setJqgridCss();
        var table = this;
        setTimeout(function(){
            styleCheckbox(table);
            updateActionIcons(table);
            updatePagerIcons(table);
            enableTooltips(table);
        }, 0);
    };
    newOptions.onCellSelect = function (oid) {
        $(newOptions.gridSelector).jqGrid('setSelection',oid);
    }
    var oldGridComplete = newOptions.gridComplete;
    newOptions.gridComplete = function () {
    	if(oldGridComplete && typeof oldGridComplete == "function"){
            oldGridComplete();
		}
		/*$(this).find*/
		$('[operType="edit"],[operType="del"]').off().click(function(){
			var operType = $(this).attr("operType");
			setTimeout(function () {
                $("#"+operType+"_grid-table").trigger("click");
            },50)
		})
        $('[operType="add"]').off().click(function(){
			$("#add_grid-table").trigger("click");
        })
	}
    jQuery(newOptions.gridSelector).jqGrid(newOptions);
    var operateStatus = [true, true, true, false, false, false];
    jQuery(grid_selector).jqGrid('navGrid',pager_selector,
        { 	//navbar options
            edit: operateStatus[0],
            editicon : 'icon-pencil blue',
            add: operateStatus[1],
            addicon : 'icon-plus-sign purple',
            del: operateStatus[2],
            delicon : 'icon-trash red',
            search: operateStatus[3],
            searchicon : 'icon-search orange',
            refresh: operateStatus[4],
            refreshicon : 'icon-refresh green',
            view: operateStatus[5],
            viewicon : 'icon-zoom-in grey'/*,
            delfunc:function (oid) {
                confirms("确定删除吗",function(){
                    var param = "oper=del&oid=" + oid;
                    var url = newOptions.editurl;
                    operationFunc(param, url, function (result) {
                        var resultStr = $.parseJSON(result);
                        afterShow(resultStr.result, null, "selectbtn()");
                    });
                })
            }*/
        },
        {
            //edit record form
            top: 150,
            left: leftOffset,
            closeAfterEdit: true,
            recreateForm: true,
            beforeShowForm : function(e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                style_edit_form(form);
            },
            afterSubmit:newOptions.afterSubmitCell
        },
        {
            //new record form
            top: 150,
            left: leftOffset,
            closeAfterAdd: true,
            recreateForm: true,
            viewPagerButtons: false,
            beforeShowForm : function(e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                style_edit_form(form);
            },
            afterSubmit:newOptions.afterSubmitCell
        },
        {
            //delete record form
            top: 150,
            left: leftOffset,
            closeAfterDel: true,
            recreateForm: true,
            beforeShowForm : function(e) {
                var form = $(e[0]);
                if(form.data('styled')) return false;
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                style_delete_form(form);
                form.data('styled', true);
            },
            afterSubmit:newOptions.afterSubmitCell

        }
    )
    $("#add_grid-table").hide();
    $("#edit_grid-table").hide();
    $("#del_grid-table").hide();
    $(".ui-separator").hide();
}

//by叶晓龙，为了加select
function createJQGridWithMutiselect(gridUrl,gridTableId,girdPaperId,gridCaption,colNames,colModels,operateStatus,jsonReaderObj,gridEditUrl,afterSubmitFn,isInit,initFunc,addInitStr,isCellEdit,cellEditUrl,ifMutilSelect,modifyStatus)
{
	var grid_selector = gridTableId;
	var pager_selector = girdPaperId;
	jQuery(grid_selector).jqGrid({
		cellEdit: isCellEdit,
		cellsubmit: "remote",//|clientArray
		cellurl: cellEditUrl,
		url:gridUrl,
		datatype: "json",
		height: 'auto',
		colNames:colNames,
		colModel:colModels,
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,100,500,1000],
		pager : pager_selector,
		altRows: true,
		//toppager: true,

		multiselect: true,
		//multikey: "ctrlKey",
		multiboxonly: false,

		loadComplete : function() {
			setJqgridCss();
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);

				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		jsonReader:jsonReaderObj,
		editurl: gridEditUrl,
		caption: gridCaption,
		autowidth: true,
		shrinkToFit:true,
		afterSubmitCell:afterSubmitFn,
		//forceFit:true,
		//scrollrows:false,
	});

	//navButtons
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	//navbar options
			edit: operateStatus[0],
			editicon : 'icon-pencil blue',
			add: operateStatus[1],
			addicon : 'icon-plus-sign purple',
			del: operateStatus[2],
			delicon : 'icon-trash red',
			search: operateStatus[3],
			searchicon : 'icon-search orange',
			refresh: operateStatus[4],
			refreshicon : 'icon-refresh green',
			view: operateStatus[5],
			viewicon : 'icon-zoom-in grey',
		},
		{
			//edit record form
			top: 150,
			left: leftOffset,
			closeAfterEdit: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//new record form
			top: 150,
			left: leftOffset,
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(isInit)
				{
					initFunc(form);
				}
				eval(addInitStr);

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit:afterSubmitFn
		},
		{
			//delete record form
			top: 150,
			left: leftOffset,
			closeAfterDel: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);

				form.data('styled', true);
			},
			onClick : function(e) {
				alert(1);
			},
			afterSubmit:afterSubmitFn

		},
		{
			//search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,

			//multipleGroup:true,
			//showQuery: true

		},
		{
			//view record form
			recreateForm: true,
			beforeShowForm: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		}
	)

	$("#add_grid-table").hide();
	$("#edit_grid-table").hide();
	$(".ui-separator").hide();
}

//enable search/filter toolbar
//jQuery(grid_selector).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})

//switch element when editing inline
function aceSwitch( cellvalue, options, cell ) {
	setTimeout(function(){
		$(cell) .find('input[type=checkbox]')
				.wrap('<label class="inline" />')
			.addClass('ace ace-switch ace-switch-5')
			.after('<span class="lbl"></span>');
	}, 0);
}
//enable datepicker
function pickDate( cellvalue, options, cell ) {
	setTimeout(function(){
		$(cell) .find('input[type=text]')
				.datepicker({format:'yyyy-mm-dd' , autoclose:true}); 
	}, 0);
}


function style_edit_form(form) {
	//enable datepicker on "sdate" field and switches for "stock" field
	form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
		.end().find('input[name=stock]')
			  .addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

	//update buttons classes
	var buttons = form.next().find('.EditButton .fm-button');
	buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
	buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
	buttons.eq(1).prepend('<i class="icon-remove"></i>')
	
	//buttons = form.next().find('.navButton a');
	//buttons.find('.ui-icon').remove();
	//buttons.eq(0).append('<i class="icon-chevron-left"></i>');
	//buttons.eq(1).append('<i class="icon-chevron-right"></i>');
}

function style_delete_form(form) {
	var buttons = form.next().find('.EditButton .fm-button');
	buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
	buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
	buttons.eq(1).prepend('<i class="icon-remove"></i>')
}

function style_search_filters(form) {
	form.find('.delete-rule').val('X');
	form.find('.add-rule').addClass('btn btn-xs btn-primary');
	form.find('.add-group').addClass('btn btn-xs btn-success');
	form.find('.delete-group').addClass('btn btn-xs btn-danger');
}
function style_search_form(form) {
	var dialog = form.closest('.ui-jqdialog');
	var buttons = dialog.find('.EditTable')
	buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
	buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
	buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
}





//it causes some flicker when reloading or navigating grid
//it may be possible to have some custom formatter to do this as the grid is being created to prevent this
//or go back to default browser checkbox styles for the grid
function styleCheckbox(table) {
/**
	$(table).find('input:checkbox').addClass('ace')
	.wrap('<label />')
	.after('<span class="lbl align-top" />')


	$('.ui-jqgrid-labels th[id*="_cb"]:first-child')
	.find('input.cbox[type=checkbox]').addClass('ace')
	.wrap('<label />').after('<span class="lbl align-top" />');
*/
}


//unlike navButtons icons, action icons in rows seem to be hard-coded
//you can change them like this in here if you want
function updateActionIcons(table) {
	/**
	var replacement = 
	{
		'ui-icon-pencil' : 'icon-pencil blue',
		'ui-icon-trash' : 'icon-trash red',
		'ui-icon-disk' : 'icon-ok green',
		'ui-icon-cancel' : 'icon-remove red'
	};
	$(table).find('.ui-pg-div span.ui-icon').each(function(){
		var icon = $(this);
		var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
		if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
	})
	*/
}

//replace icons with FontAwesome icons like above
function updatePagerIcons(table) {
	var replacement = 
	{
		'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
		'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
		'ui-icon-seek-next' : 'icon-angle-right bigger-140',
		'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
	};
	$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
		var icon = $(this);
		var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
		
		if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
	})
}

function enableTooltips(table) {
	$('.navtable .ui-pg-button').tooltip({container:'body'});
	$(table).find('.ui-pg-div').tooltip({container:'body'});
}

function beforeDeleteCallback(e) {
	var form = $(e[0]);
	if(form.data('styled')) return false;

	form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
	style_delete_form(form);

	form.data('styled', true);
}

function beforeEditCallback(e) {
	var form = $(e[0]);
	form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
	style_edit_form(form);
}