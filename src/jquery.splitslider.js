//IIFE with jQuery, window, document namespaces
//Use trailing slash for concatenation
;(function ($, window, document) {

	"use strict";

	//Set plugin defaults
	var defaults = {
		captions: true,
		delay: 3000,
		slideWidth: 0,
		speed: 0.5
	};

	//Constructor function
	function SplitSlider (element, options) {
		this.el = $(element);
		this.settings = $.extend({}, defaults, options);
		this.defaults = defaults;
		this._init();
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
			this.el.wrap("<div class=\"slider-wrap\"></div>");
			this.el.addClass("slider-view");

			//Set max slideshow width
			if (this.settings.slideWidth === 0){
				this.settings.slideWidth === "100%";
			}
			$(".slider-wrap").css("max-width", this.settings.slideWidth);

			//Establish some meta about the slides
			this.slideHeight = $(".slider-view").outerHeight();
			this.slideCount = $(".left-images").children().length;
			this.activeSlide = 1; //not zero based
			this.rightImgPos = this._buildRightImgArray(this.slideCount);
			this.browserPrefix = "-" + this._getBrowserPrefix() + "-";

			//make sure we have equal number of left and right slides
			if(!this._checkSliderLength()) {
				console.log("You must have an equal number of left- and right-images.")
				return false;
			}

			//build our initial animation
			this._loadFirstSlides();

			//Turn on auto-play timer
			var autoPlay = setInterval(function(self) {
				self.advanceSlide();
			}, this.settings.delay, this);

			//Controls


			//Pager

		},

		_getBrowserPrefix: function(){
			var temp = document.createElement('div');
			var properties = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
			for(var i in properties){
				if(temp.style[properties[i]] !== undefined){
					return properties[i].replace('Perspective', '').toLowerCase();
				}
			}
			return false;
		},

		_checkSliderLength: function () {
			return this.slideCount == $(".right-images").children().length;
		},

		//Create a reverse-order index array to help track our right-hand images
		_buildRightImgArray: function(numSlides){
			var arr = new Array(numSlides);
			var count = arr.length;
			arr = $.map(arr, function(n){
				return count--;
			});
			return arr;
		},

		_reverseSlides: function() {
			var reversed = $(".right-images li").get().reverse();
			$(".right-images").empty();
			for (var i in reversed) {
				$(".right-images").append(reversed[i]);
			}
			var y = -this.slideHeight * this.slideCount;
			$(".right-images").css(this.browserPrefix + "transform", "translate3d(0, " + y + "px, 0)");
		},

		_loadFirstSlides: function(){
			// bind a callback method - executes when CSS transition completes
			$(".right-images").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
				console.log('end')
				// unbind the callback
				$(".right-images").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
				$(".loader").remove();
				$(".left-images, .right-images").fadeIn(500);
			});

			//Show loader gif
			this.el.append("<div class=\"loader\"></div>")

			//Hide slides and set animation duration
			var duration = this.settings.speed.toString() + "s";
			$(".left-images, .right-images").hide().css(this.browserPrefix + "transition-duration", duration);

			//set start position for left-images
			$(".left-images").css(this.browserPrefix + "transform", "translate3d(0, " + (-this.slideHeight) + "px, 0)");

			//clone first and last slides for infinite loop
			$(".left-images li").eq(0).clone().appendTo(".left-images").addClass('clone');
			$(".left-images li").eq(this.slideCount-1).clone().prependTo(".left-images").addClass('clone');
			$(".right-images li").eq(0).clone().appendTo(".right-images").addClass('clone');
			$(".right-images li").eq(this.slideCount-1).clone().prependTo(".right-images").addClass('clone');

			//reverse the order of the right slides
			this._reverseSlides();


		},

		/**
		 * ----------------------------
		 * Public Methods
		 * @access public
		 * ----------------------------
		 */
		advanceSlide: function () {
			//re-establish duration
			var duration = this.settings.speed.toString() + "s";
			$(".left-images, .right-images").css(this.browserPrefix + "transition-duration", duration);

			var leftYPos = -(this.activeSlide * this.slideHeight);
			var rightYPos = -(this.rightImgPos[this.activeSlide-1] * this.slideHeight);
			var lastSlide = false;

			if (this.activeSlide == this.slideCount) {
				//we are on the last slide
				lastSlide = true;
			}

			leftYPos -= this.slideHeight;
			rightYPos += this.slideHeight;

			$(".left-images").css(this.browserPrefix + "transform", "translate3d(0, " + leftYPos + "px, 0)");
			$(".right-images").css(this.browserPrefix + "transform", "translate3d(0, " + rightYPos + "px, 0)");

			//update active slide index
			this.activeSlide++;

			//wait till animation completes
			var self = this;
			$(".right-images").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
				//make a few behind the scenes adjustments for the final slide
				if (lastSlide) {
					//reset duration for a moment
					$(".left-images, .right-images").css(self.browserPrefix + "transition-duration", "0s");

					//reset position to beginning
					$(".left-images").css(self.browserPrefix + "transform", "translate3d(0, " + (-self.slideHeight) + "px, 0)");

					var y = -self.slideHeight * self.slideCount;
					$(".right-images").css(self.browserPrefix + "transform", "translate3d(0, " + y + "px, 0)");

					self.activeSlide = 1;
				}
				$(".right-images").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
			});
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