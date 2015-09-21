window.requirejs.config({
	waitSeconds: 0,

	shim: {
		"backbone": {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		"bootstrap": {
			deps: ["jquery"]
		},
		"dust": {
			exports: "dust"
		},
		"rdust": {
			deps: ["dust"]
		},
		"underscore": {
			exports: "_"
		}
	},

	paths : {
		"backbone": "lib/backbone",
		"bootstrap": "lib/bootstrap",
		"jquery": "lib/jquery",
		"underscore": "lib/underscore",
		"dust": "lib/dust-full",
		"rdust": "util/rdust"
	}
});

window.require([
	"bootstrap",
	"dust"
]);

window.define(["js/backbone/router/global.js"], function (GlobalRouter) {
	"use strict";

	dust.nodes.partial = function (context, node) {
		var templateName = node[1][1];
		var templateContent;
		if(typeof dust.cache[templateName] === 'undefined') {
			$.ajax('/template/' + templateName, {
				async: false,
				method: 'GET',
				success: function(data) {
					templateContent = data;
				}
			});
			if(typeof templateContent !== 'undefined') {
				dust.loadSource(dust.compile(templateContent, templateName));
			}
		}
		return '.partial(' +
			dust.compileNode(context, node[1]) +
			',' + dust.compileNode(context, node[2]) +
			',' + dust.compileNode(context, node[3]) + ')';
	};

	window.globalRouter = new GlobalRouter();

});
