//IIFE with jQuery, window, document namespaces
//Use trailing slash for concatenation
;(function ($, window, document) {

	"use strict";

	//Set plugin defaults
	var defaults = {
		captions: true,
		controls: true,
		delay: 3000,
		pager: true,
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

			//build left/right arrow controls
			if(this.settings.controls) {
				this._buildControls();
			}

			//build pager
			if(this.settings.pager) {
				this._buildPager();
			}

			//Turn on auto-play timer
			this.startSlider();

			//Pause slider on hover
			this.el.hover(function(){
				//check if an interval already exists
				if(this.autoPlay){
					this.stopSlider();
					this.paused = true;
				}
			}.bind(this), function(){
				if(this.paused){
					this.startSlider();
					this.paused = null;
				}
			}.bind(this));

			//Controls


			//Pager

			//Touch Events

			//Window resize for responsive

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

		_buildControls: function(){
			$(".slider-wrap").append("\
				<div class=\"controls\">\
					<div class=\"control-arrows\">\
						<span class=\"prev\"></span>\
						<span class=\"next\"></span>\
					</div>\
				</div>\
			");

			$(".control-arrows").on("click touchend", "span.prev", function(e){
				//stop autplay
				if(this.autoPlay){
					this.stopSlider();
					this.paused = true;
				}
				this.animateSlide("prev");
			}.bind(this)).on("click touchend", "span.next", function(e){
				//stop autplay
				if(this.autoPlay){
					this.stopSlider();
					this.paused = true;
				}
				this.animateSlide("next");
			}.bind(this));
		},

		_buildPager: function(){
			$(".controls").prepend("<div class=\"pager\"></div>");
			for (var i=0; i<this.slideCount; i++) {
				$(".controls .pager").append("\
					<div class=\"pager-item\">\
						<span class=\"pager-link\" data-slide-index=\"" + i + "\">" + i + "</span>\
					</div>\
				");
			}
			$(".pager").on("click touchend", "span.pager-link", function(e){
				//stop autplay
				if(this.autoPlay){
					this.stopSlider();
					this.paused = true;
				}
				var slideIndex = $(e.target).data("slide-index");
				this.animateSlide("pager", slideIndex+1);
			}.bind(this));
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

			//use timeout to prevent jump while the slides position themselves
			var timeout = setTimeout(function(){
				$(".loader").remove();
				$(".left-images, .right-images").fadeIn(500);
			}, 500);
		},

		/**
		 * ----------------------------
		 * Public Methods
		 * @access public
		 * ----------------------------
		 */

		/**
		 * Animate slides forward or backward
		 * @param  {string} direction 	"prev", "next" or "pager"
		 * @param  {int} 	slideIndex 		Index of slide to navgiate to (used with "pager" only)
		 */
		animateSlide: function (direction, slideIndex) {
			//re-establish duration
			var duration = this.settings.speed.toString() + "s";
			$(".left-images, .right-images").css(this.browserPrefix + "transition-duration", duration);

			var leftYPos = -(this.activeSlide * this.slideHeight);
			var rightYPos = -(this.rightImgPos[this.activeSlide-1] * this.slideHeight);

			if (direction === "pager" && slideIndex !== null) {
				leftYPos = -(slideIndex * this.slideHeight);
				rightYPos = -(this.rightImgPos[slideIndex-1] * this.slideHeight);
				this.activeSlide = slideIndex;
			} else if (direction === "prev") {
				leftYPos += this.slideHeight;
				rightYPos -= this.slideHeight;
			} else {
				//go forward
				leftYPos -= this.slideHeight;
				rightYPos += this.slideHeight;
			}

			//we are using translate3d in order to support hardware acceleration in IOS
			$(".left-images").css(this.browserPrefix + "transform", "translate3d(0, " + leftYPos + "px, 0)");
			$(".right-images").css(this.browserPrefix + "transform", "translate3d(0, " + rightYPos + "px, 0)");

			//wait until animation completes
			$(".right-images").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
				//make adjustments for the final slide
				if (this.activeSlide == this.slideCount && (direction === "next" || direction === "pager")) {
					//reset duration for a moment
					$(".left-images, .right-images").css(this.browserPrefix + "transition-duration", "0s");

					//reset position to beginning
					$(".left-images").css(this.browserPrefix + "transform", "translate3d(0, " + (-this.slideHeight) + "px, 0)");

					var y = -this.slideHeight * this.slideCount;
					$(".right-images").css(this.browserPrefix + "transform", "translate3d(0, " + y + "px, 0)");

					this.activeSlide = 1;
				} else if (this.activeSlide === 1 && (direction === "prev" || direction === "pager")) {
					//reset duration for a moment
					$(".left-images, .right-images").css(this.browserPrefix + "transition-duration", "0s");

					//reset position to beginning
					var y = -this.slideHeight * this.slideCount;
					$(".left-images").css(this.browserPrefix + "transform", "translate3d(0, " + y + "px, 0)");

					$(".right-images").css(this.browserPrefix + "transform", "translate3d(0, " + (-this.slideHeight) + "px, 0)");

					this.activeSlide = this.slideCount;
				} else {
					//update active slide index
					if (direction === "pager") {
						//this.activeSlide = slideIndex;
					} else if (direction === "prev") {
						this.activeSlide--;
					} else {
						this.activeSlide++;
					}
				}
				$(".right-images").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
			}.bind(this));
		},

		startSlider: function(){
			// if interval already exists, return
			if(this.autoPlay){
				return;
			}
			this.autoPlay = setInterval(function(self) {
				self.animateSlide("next");
			}, this.settings.delay, this);
		},

		stopSlider: function(){
			// if interval already exists, return
			if(!this.autoPlay){
				return;
			}
			// clear the interval
			clearInterval(this.autoPlay);
			this.autoPlay = null;
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