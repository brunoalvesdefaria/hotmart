define([
	'backbone',
	'jquery'
], function(
	Backbone,
	$
) {

	var GlobalRouter = Backbone.Router.extend({

		$menus: $('#main-menu > li'),

		views: {},

		routeMap: {
			'message': {
				route: 'message',
				name: 'message',
				view: '/js/backbone/view/message.js',
				template: 'rdust!message'
			}
		},

		// Setup
		initialize: function() {
			var appRoot = '/';

			Backbone.history.start({root: appRoot});
		},

		simpleRoute: function(map) {
			var globalRouter = this;
			return function(args) {
				var params = arguments;
				require([
					map.view,
					map.template
				], function(
					View,
					template
				) {
					if(!globalRouter.views[map.name]) {
						globalRouter.views[map.name] = new View();
					}
					globalRouter.views[map.name].render(template, params);
				});
			};
		},

		routes: {
			'': 'index',
			'market': 'index',
			'products': 'index',
			'sales': 'index',
			'purchases': 'index'
		},

		route: function(route, name, callback) {
			var globalRouter = this;
			return Backbone.Router.prototype.route.call(this, route, name, function() {
				this.trigger.apply(this, ['beforeroute'].concat(_.toArray(arguments)));
				if (!callback) callback = this[name];
				if (callback) callback.apply(this, arguments);
				globalRouter.afterRoute(route);
			});
		},

		afterRoute: function(route) {
			this.$menus.removeClass('active');
			this.$menus.children('a[href="#' + route + '"]').parent().addClass('active');
		},

		index: function() {
			this.simpleRoute(this.routeMap.message)();
		}

	});

	return GlobalRouter;

});
