/*global module:false */
module.exports = function(grunt) {
	'use strict';

	var options = grunt.file.readJSON('config/grunt/options.json'),
		development = grunt.file.readJSON('config/grunt/development.json'),
		production = grunt.file.readJSON('config/grunt/production.json');

	var optionsExtend = function(options, additional) {
		var i, result = {};
		for(i in options) {
			result[i] = options[i];
		}
		for(i in additional) {
			result[i] = additional[i];
		}
		return result;
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {files: ['public/js/**/*', 'public/css/**/*', 'public/template/**/*']},

		copy: {
			dev_css: {expand: true, flatten: true, ext: '.css', src: development.copy.css, dest: 'public/css/lib/'},
			dev_js: {expand: true, flatten: true, ext: '.js', src: development.copy.js, dest: 'public/js/lib/'},
			prod_css: {expand: true, flatten: true, ext: '.css', src: production.copy.css, dest: 'public/css/lib/'},
			prod_js: {expand: true, flatten: true, ext: '.js', src: production.copy.js, dest: 'public/js/lib/'},
			js: {expand: true, ext: '.js', cwd: 'src/js/public/', src: '**/*.js', dest: 'public/js/'},
			templates: {expand: true, ext: '', cwd: 'src/template/', src: '**/*.dust', dest: 'public/template/'},
			fonts: {expand: true, flatten: true, src: options.copy.fonts, dest: 'public/css/fonts/'}
		},

		replace: {
			icomoon: {
				src: options.replace.icomoon.src,
				dest: options.replace.icomoon.dest,
				replacements: [{from: "url('fonts/", to: "url('/css/fonts/"}]
			}
		},

		uglify: production.uglify,

		cssmin: {
			css: {expand: true, cwd: "public/css/", src: ["*.css", "!*.min.css"], dest: "public/css/", ext: ".css"}
		},

		concat: {
			css: {src: production.concat.css, dest: "public/css/style.css"}
		},

		compass: {
			watch: {options: optionsExtend(options.sass, {
				watch: true
			})},
			dev: {options: optionsExtend(options.sass, {
				watch: false, force: true, outputStyle: 'nested'
			})},
			prod: {options: optionsExtend(options.sass, {
				watch: false, force: true, outputStyle: 'compressed'
			})}
		},

		watch: {
			sass: {
				files: ['src/style/sass/**/*.scss'],
				tasks: ['compass:watch']
			},
			jsPublic: {
				files: ['src/js/public/**/*.js'],
				tasks: ['copy:js']
			},
			dustPublic: {
				files: options.copy.templates,
				tasks: ['copy:templates']
			}
		},

	});

	// Enable plugins
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-text-replace');

	// Replace Bootstrap Variables
	grunt.registerTask(
		'bootstrap',
		function() {
			var newFile = 'src/style/less/bootstrap-variables.less';
			var newVars = grunt.file.read(newFile);
			var variables = newVars.match(/\@.+\:.+\;\n/g);
			var varsObj = {};
			for(var i=0; i<variables.length; i++) {
				var variable = variables[i].replace(';\n', '').split(': ');
				varsObj[variable[0]] = variable[1];
			}

			var originalFile = 'lib/bower/bootstrap/less/variables.less';
			var originalVars = grunt.file.read(originalFile);
			for(var i in varsObj) {
				var regex = new RegExp(i + '\\:.+\n');
				var variable = originalVars.match(regex)[0];
				originalVars = originalVars.replace(variable, i + ': ' + varsObj[i] + ';\n');
			}

			grunt.file.write(originalFile, originalVars);

			console.log('Bootstrap variables replaced!');
		}
	);

	// Build Development
	grunt.registerTask(
		'buildDev',
		[
			'bootstrap',
			'clean',
			'replace',
			'copy:js',
			'copy:templates',
			'copy:fonts',
			'copy:dev_css',
			'copy:dev_js',
			'compass:dev'
		]
	);

	// Build Production
	grunt.registerTask(
		'buildProd',
		[
			'bootstrap',
			'clean',
			'replace',
			'copy:js',
			'copy:templates',
			'copy:fonts',
			'copy:prod_css',
			'copy:prod_js',
			'compass:prod',
			'uglify',
			'cssmin',
			'concat'
		]
	);

};
