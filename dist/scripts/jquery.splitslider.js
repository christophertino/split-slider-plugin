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

	//"use strict";

	//Set plugin defaults
	var defaults = {
		captions: true, //display text captions over the images. requires <ul class="captions"></ul> in html
		controls: true, //display left and right arrows
		delay: 3000, //length between slide transitions in miliseconds
		pager: true, //display pager dots below the slider
		slideWidth: 1000, //set max width of the slider. if 'auto', width will be 100%
		speed: 0.5, //animation speed in seconds
		useTouch: true //allow horizontal swiping on touch devices
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

		//Initialization logic
		_init: function () {
			//Make sure the el exists
			if(this.el.length === 0){
				return this;
			}

			//Wrap with container divs
			this.el.wrap("<div class=\"slider-wrap\"></div>");
			this.el.addClass("slider-view");

			//Set max slideshow width and height
			if (this.settings.slideWidth === "auto") {
				$(".slider-wrap").css("max-width", "100%");
			} else {
				$(".slider-wrap").css("max-width", this.settings.slideWidth.toString() + "px");
			}
			$(".slider-view").css("height", $(".left-images li").outerHeight());

			//Establish some meta about the slides
			this.slideHeight = $(".slider-view").outerHeight();
			this.slideCount = $(".left-images").children().length;
			this.activeSlide = 1; //not zero based
			this.rightImgPos = this._buildRightImgArray(this.slideCount);
			this.browserPrefix = "-" + this._getBrowserPrefix() + "-";

			//Make sure we have equal number of left and right slides, captions (optional)
			if(!this._checkSliderLength(this.settings.captions)) {
				console.log("You must have an equal number of left and right images.");
				return false;
			}

			//Build our initial animation
			this._loadFirstSlides();

			//Build left/right arrow controls
			if(this.settings.controls) {
				this._buildControls();
			}

			//Build pager
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

			//Touch Events
			if (this.settings.useTouch) {
				//check for touch
				if ("ontouchstart" in window) {
					$("control-arrows").hide();
				}
				this.touchObj = {
					start: {x: 0, y: 0},
					end: {x: 0, y: 0}
				};
				$(".slider-view").on("touchstart", this._onTouchStart.bind(this));
			}

			//Window resize for responsive
			$(window).on("resize", this._onResizeEvent.bind(this));

		},

		//Test our browser for appropriate CSS3 prefix
		_getBrowserPrefix: function(){
			var temp = document.createElement("div");
			var properties = ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
			for(var i in properties){
				if(temp.style[properties[i]] !== undefined){
					return properties[i].replace("Perspective", "").toLowerCase();
				}
			}
			return false;
		},

		//Make sure there are equal numbers left images, right images, and captions
		_checkSliderLength: function (captions) {
			if (captions) {
				if (($(".captions").children().length === $(".right-images").children().length) && ($(".captions").children().length === this.slideCount)) {
					return true;
				} else{
					return false;
				}
			} else {
				return this.slideCount === $(".right-images").children().length;
			}
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

		//Build the left-right arrows
		_buildControls: function(){
			$(".slider-wrap").append("<div class=\"controls\"><div class=\"control-arrows\"><span class=\"prev\"></span><span class=\"next\"></span></div></div>");

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

		//Build the pager dots
		_buildPager: function(){
			$(".controls").prepend("<div class=\"pager\"></div>");
			for (var i=0; i<this.slideCount; i++) {
				$(".controls .pager").append("<div class=\"pager-item\"><span class=\"pager-link\" data-slide-index=\"" + i + "\">" + i + "</span></div>");
			}
			$(".pager .pager-item").eq(0).children(".pager-link").addClass("active");
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

		//Reverse the right-hand image order so that the animation comes from opposite directions (top and bottom)
		_reverseSlides: function() {
			var reversed = $(".right-images li").get().reverse();
			$(".right-images").empty();
			for (var i in reversed) {
				$(".right-images").append(reversed[i]);
			}
			var y = -this.slideHeight * this.slideCount;
			$(".right-images").css(this.browserPrefix + "transform", "translate3d(0, " + y + "px, 0)");
		},

		//Build our first set of slides on page load
		_loadFirstSlides: function(){
			//Show loader gif
			this.el.append("<div class=\"loader\"></div>");

			//Hide slides and set animation duration
			var duration = this.settings.speed.toString() + "s";
			$(".left-images, .right-images").hide().css(this.browserPrefix + "transition-duration", duration);

			//Set start position for left-images
			$(".left-images").css(this.browserPrefix + "transform", "translate3d(0, " + (-this.slideHeight) + "px, 0)");

			//Clone first and last slides for infinite loop
			$(".left-images li").eq(0).clone().appendTo(".left-images").addClass("clone");
			$(".left-images li").eq(this.slideCount-1).clone().prependTo(".left-images").addClass("clone");
			$(".right-images li").eq(0).clone().appendTo(".right-images").addClass("clone");
			$(".right-images li").eq(this.slideCount-1).clone().prependTo(".right-images").addClass("clone");

			//Reverse the order of the right slides
			this._reverseSlides();

			//Use timeout to prevent jump while the slides position themselves
			var timeout = setTimeout(function(self){
				$(".loader").remove();
				$(".left-images, .right-images").fadeIn(500);
				//Load initial caption
				if(self.settings.captions) {
					$(".captions li").eq(0).fadeIn(500);
				}
			}, 500, this);
		},

		//Resize the slider to allow for responsiveness
		_onResizeEvent: function(){
			//clear the ending timeout below
			clearTimeout(end);

			//stop autplay
			if(this.autoPlay){
				this.stopSlider();
				this.paused = true;
			}

			//update height
			$(".slider-view").css("height", $(".left-images li").outerHeight());
			this.slideHeight = $(".slider-view").outerHeight();

			//redraw slides
			var leftYPos = -(this.activeSlide * this.slideHeight);
			var rightYPos = -(this.rightImgPos[this.activeSlide-1] * this.slideHeight);
			$(".left-images, .right-images").css(this.browserPrefix + "transition-duration", "0s");
			$(".left-images").css(this.browserPrefix + "transform", "translate3d(0, " + leftYPos + "px, 0)");
			$(".right-images").css(this.browserPrefix + "transform", "translate3d(0, " + rightYPos + "px, 0)");

			//Signifies the end of each resize event
			var end = setTimeout(function(self){
				//restart slider
				if(self.paused){
					self.startSlider();
					self.paused = null;
				}
			}, 100, this);
		},

		//Touch start
		_onTouchStart: function(event){
			var original = event.originalEvent;
			var touchPoints = (typeof original.changedTouches !== "undefined") ? original.changedTouches : [original];
			//set start positions
			this.touchObj.start.x = touchPoints[0].pageX;
			this.touchObj.start.y = touchPoints[0].pageY;
			$(".slider-view").bind("touchmove", this._onTouchMove.bind(this));
			$(".slider-view").bind("touchend", this._onTouchEnd.bind(this));
		},

		//Touch move - prevent horizontal browser scroll
		_onTouchMove: function(event){
			var original = event.originalEvent;
			var touchPoints = (typeof original.changedTouches !== "undefined") ? original.changedTouches : [original];
			var xMovement = Math.abs(touchPoints[0].pageX - this.touchObj.start.x);
			var yMovement = Math.abs(touchPoints[0].pageY - this.touchObj.start.y);
			if((xMovement * 3) > yMovement){
				event.preventDefault();
			}
		},

		//Touch end
		_onTouchEnd: function(event){
			var original = event.originalEvent;
			var touchPoints = (typeof original.changedTouches !== "undefined") ? original.changedTouches : [original];
			var swipeThreshold = 150;

			//set end positions
			this.touchObj.end.x = touchPoints[0].pageX;
			this.touchObj.end.y = touchPoints[0].pageY;

			var distance = this.touchObj.end.x - this.touchObj.start.x;

			// check if distance clears threshold
			if(Math.abs(distance) >= swipeThreshold){
				if(distance < 0){
					this.animateSlide("next");
				} else {
					this.animateSlide("prev");
				}
				this.stopSlider();
			}
			$(".slider-view").unbind("touchend");
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
		 * @param  {int} 	slideIndex 	Index of slide to navgiate to (used with "pager" only)
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
				var y;
				//make adjustments for the final slide
				if (this.activeSlide === this.slideCount && direction === "next") {
					//reset duration for a moment
					$(".left-images, .right-images").css(this.browserPrefix + "transition-duration", "0s");

					//reset position to beginning
					$(".left-images").css(this.browserPrefix + "transform", "translate3d(0, " + (-this.slideHeight) + "px, 0)");

					y = -this.slideHeight * this.slideCount;
					$(".right-images").css(this.browserPrefix + "transform", "translate3d(0, " + y + "px, 0)");

					this.activeSlide = 1;
				} else if (this.activeSlide === 1 && direction === "prev") {
					//reset duration for a moment
					$(".left-images, .right-images").css(this.browserPrefix + "transition-duration", "0s");

					//reset position to beginning
					y = -this.slideHeight * this.slideCount;
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

				//update controls
				if(this.settings.pager) {
					$(".pager .pager-link").removeClass("active");
					$(".pager .pager-item").eq(this.activeSlide-1).children(".pager-link").addClass("active");
				}

				//update caption
				if(this.settings.captions) {
					$(".captions li:visible").hide();
					$(".captions li").eq(this.activeSlide-1).fadeIn(500);
				}

				$(".right-images").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
			}.bind(this));
		},

		//Fire up the auto-rotation
		startSlider: function(){
			// if interval already exists, return
			if(this.autoPlay){
				return;
			}
			this.autoPlay = setInterval(function(self) {
				self.animateSlide("next");
			}, this.settings.delay, this);
		},

		//Stop auto-rotation to allow other things to happen
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