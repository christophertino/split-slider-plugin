# jQuery Split Slider Plugin

Split Slider is an image carousel that animates an image split into two equal halves. Each half animates vertically from the top or bottom, in opposing directions.

## Basic Setup

Follow the index.html demo file located in the /dist folder. You'll need to split your image assets in half vertically and add them to the left-images, right-images <ul> containers, respectively. 

	```html
	<!doctype html>
	<html>
	<head>
		<title>jQuery Split Slider Plugin</title>
		<link type="text/css" href="jquery.splitslider.css" rel="stylesheet" />
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
		<script src="jquery.splitslider.js"></script>
		<script>
			$(function() {
				$(".split-slider").splitslider({
					caption: true
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
		caption: true,
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
