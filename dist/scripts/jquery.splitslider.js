/**!
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
		captions: true,
		speed: 500,
		slideWidth: 0
	};

	//Constructor function
	function SplitSlider (element, options) {
		this.el = element;
		this.settings = $.extend({}, defaults, options);
		this.defaults = defaults;
		this.init();
	}

	//Prototype object methods
	SplitSlider.prototype = {
		/**
		 * ----------------------------
		 * Private Methods
		 * @access private
		 * @description _method indicates privacy convention only
		 * ----------------------------
		 */
		_init: function () {
			//Make sure the el exists
			if(this.el.length === 0){
				return this;
			}

			//Wrap with container divs
			this.el.wrap("<div class=\"slider-wrap\"><div class=\"slider-view\"></div></div>");

			//Set max slideshow width
			if (this.settings.slideWidth === 0){
				this.settings.slideWidth === "100%";
			}
			$(".slider-wrap").css("max-width", this.settings.slideWidth);

			//Turn on auto-play timer

			//Animation
			var propValue = slider.settings.mode === "vertical" ? "translate3d(0, " + value + "px, 0)" : "translate3d(" + value + "px, 0, 0)";
			// add the CSS transition-duration
			el.css("-" + slider.cssPrefix + "-transition-duration", duration / 1000 + "s");
			setTimeout(function() {
				// set the property value
				el.css(slider.animProp, propValue);
				// if value 0, just update
				if(value === 0) {
					updateAfterSlideTransition();
				} else {
					// bind a callback method - executes when CSS transition completes
					el.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
						// unbind the callback
						el.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
						updateAfterSlideTransition();
					});
				}
			}, 0);

			//Controls


			//Pager


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
	$.fn.splitslider = function (options) {
		this.each(function () {
			var instance = $.data(this, "splitslider");
			if (!instance) {
				//Plugin hasn"t been created yet
				instance = new SplitSlider(this, options);
				$.data(this, "splitslider", instance);
			}
			return this;
		});
	};

})(jQuery, window, document);