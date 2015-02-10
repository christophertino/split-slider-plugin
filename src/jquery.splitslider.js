//IIFE with jQuery, window, document namespaces
//Use trailing slash for concatenation
;(function ($, window, document) {

	"use strict";

	//Set plugin defaults
	var defaults = {
		captions: true,
		speed: 500
	};

	//Constructor function
	function SplitScroll (element, options) {
		this.el = element;
		this.settings = $.extend({}, defaults, options);
		this.defaults = defaults;
		this.init();
	}

	//Prototype object methods
	SplitScroll.prototype = {
		/**
		 * ----------------------------
		 * Private Methods
		 * @access private
		 * @description _method indicates privacy convention only
		 * ----------------------------
		 */
		_init: function () {
			if(this.el.length === 0){
				return this;
			}
			console.log(this.settings);
			console.log(this._defaults);
		},

		/**
		 * ----------------------------
		 * Public Methods
		 * @access public
		 * ----------------------------
		 */
		yourOtherFunction: function () {
			// some logic
		}
	};

	/**
	 * Extend the jQuery plugin object
	 * @param  	Object options Custom options passed from user
	 * @param 	Object this    DOM element attached to the plugin
	 * @return 	this
	 */
	$.fn.splitscroll = function (options) {
		this.each(function () {
			var instance = $.data(this, "splitscroll");
			if (!instance) {
				//Plugin hasn't been created yet
				instance = new SplitScroll(this, options);
				$.data(this, "splitscroll", instance);
			}
			return this;
		});
	};

})(jQuery, window, document);