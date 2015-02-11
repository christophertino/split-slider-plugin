module.exports = function(grunt) {

	grunt.initConfig({

		// Import project JSON data
		pkg: grunt.file.readJSON("package.json"),

		// Custom banner meta
		meta: {
			banner: "/**!\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.licenses[0].type %> License\n" +
				" */\n"
		},

		// Add banner and migrate to output dir
		concat: {
			dist: {
				src: ["src/jquery.splitslider.js"],
				dest: "dist/scripts/jquery.splitslider.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/jquery.splitslider.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify JS
		uglify: {
			my_target: {
				src: ["dist/scripts/jquery.splitslider.js"],
				dest: "dist/scripts/jquery.splitslider.min.js"
			},
			options: {
				banner: "<%= meta.banner %>",
				preserveComments : false
			}
		},

		// Compile SASS
		sass: {
			options: {
				sourceMap: false
			},
			dist: {
				options: {
					outputStyle: "expanded"
				},
				files: {
					"dist/css/jquery.splitslider.css" : "src/jquery.splitslider.scss"
				}
			}
		},

		clean : {
			css : [
				"dist/css/jquery.splitslider.css"
			],
			js : [
				"dist/scripts/jquery.splitslider.min.js",
				"dist/scripts/jquery.splitslider.js"
			]
		},

		watch: {
			sass: {
				files: "src/**/*.scss",
				tasks: ["sass"]
			}
		}

	});

	//Load plugins from package.json, rahter than listing them one-by-one
	require("load-grunt-tasks")(grunt, {scope: "devDependencies"});

	//JS distribution task
	grunt.registerTask("dist-js", ["jshint", "clean:js", "concat", "uglify"]);

	//CSS distribution task
	grunt.registerTask("dist-css", ["clean:css", "sass"]);

	//Default task
	grunt.registerTask("default", ["dist-js", "dist-css"]);

};
