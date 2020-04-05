//searchModel.js  搜索框
/*!
 * searchModal.js
 * http://git.oschina.net/cylansad/searchModal
 *
 * Copyright 2016, Sad
 */
(function($) {
	var searchModel = {};
	 // 临时变量,是否已显示
    var _tmp_variate_ishow = false;
    // 临时变量,最后的zindex值
    var _tmp_last_zindex = 1000;
    
	searchModel.show = function(opt) {
		_buildOverlay(opt);
		_buildModal(opt);
	};
	searchModel.close = function(opt) {
		_close({ unique: unique });
        _tmp_variate_ishow = false;
	};
	function _buildOverlay(opt) {

	}
	function _buildModal(opt) {

	}
}(jquery));
