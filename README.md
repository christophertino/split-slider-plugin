# jQuery Split Slider Plugin

Split Slider is an image carousel that animates an image split into two equal halves. Each half animates vertically from the top or bottom, in opposing directions.

## Basic Setup

Follow the index.html demo file located in the /dist folder. You'll need to split your image assets in half vertically and add them to the left-images and right-images ul containers, respectively. To add text captions on top of each slide, use a third ul with class 'captions' as shown below.

```html
<!doctype html>
<html>
<head>
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>jQuery Split Slider Plugin</title>
	<link type="text/css" href="css/jquery.splitslider.css" rel="stylesheet" />
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
	<script src="scripts/jquery.splitslider.js"></script>
	<script>
		$(function() {
			$(".split-slider").splitslider({
				captions: true
			});
		});
	</script>
</head>
<body>
	<div class="split-slider">
		<ul class="left-images"></ul>
		<ul class="right-images"></ul>
		<ul class="captions"></ul>
	</div>
</body>
</html>
```

## Configuration Options
	
```javascript
$('.selector').splitslider({
	captions: true, //display text captions over the images. requires <ul class="captions"></ul> in html
	controls: true, //display left and right arrows
	delay: 3000, //length between slide transitions in miliseconds
	pager: true, //display pager dots below the slider
	slideWidth: 1000, //set max width of the slider. if 'auto', width will be 100%
	speed: 0.5, //animation speed in seconds
	useTouch: true, //allow horizontal swiping on touch devices
	useCSS: true //use CSS or jQuery animations
});
```

## Developer Setup

1. Install Grunt
	
	```sh
	$ npm install -g grunt-cli
	```

2. Install npm packages
	
	Note: grunt-sass will sometimes hang if you install using sudo. Try not to use sudo, at least for that package. 

	```sh
	$ npm install
	```

3. Run Grunt Tasks

	```sh
	$ grunt
	```
	
## License

[MIT License](http://opensource.org/licenses/MIT)