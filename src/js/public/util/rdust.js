define([
	'jquery'
], function(
	$
) {
	'use strict';
	var buildMap = {};
	return {
		write: function (pluginName, name, write) {
			if (buildMap.hasOwnProperty(name)) {
				var text = buildMap[name];
				write.asModule(pluginName + "!" + name, text);
			}
		},
		load: function (name, parentRequire, load, config) {
			var path = parentRequire.toUrl('/template/' + name);
			$.get(path, function (text) {
				try {
					text = "define(['dust'],function(dust){"+dust.compile(text, name)+" return {render: function(context, callback) {return dust.render('"+name+"', context, callback)}}})";
				}
				catch (err) {
					err.message = "In " + path + ", " + err.message;
					throw(err);
				}
				if (config.isBuild) {
					buildMap[name] = text;
				}
				load.fromText('rdust!' + name, text);
			});
		}
	};
});
