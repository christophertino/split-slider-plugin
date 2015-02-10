/**
 *  jQuery Split-Slider Plugin - v0.0.1
 *  Split Slider is an image carousel that animates an image split into two equal halves. Each half animates vertically from the top or bottom, in opposing directions.
 *  
 *  Made by Christopher Tino
 *  Under MIT License
 */
//IIFE with jQuery, window, document namespaces
//Use trailing slash for concatenation
;(function ($, window, document) {

	"use strict";

	//Set plugin defaults
	var defaults = {
		propertyName: "value"
	};

	//Constructor function
	function SplitScroll (element, options) {
		this.element = element;
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