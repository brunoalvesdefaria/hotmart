define([
	'backbone',
	'jquery'
], function(
	Backbone,
	$
) {

	var mockData = {
		messages:[
			{
				user: {
					id: 100001,
					name: 'Primeiro Usuário'
				},
				date: '21/09/2015',
				content: 'Alguma mensagem qualquer.',
				amount: 19
			},
			{
				user: {
					id: 100002,
					name: 'Segundo Usuário'
				},
				date: '19/09/2015',
				content: 'Outra mensagem qualquer.',
				amount: 2
			},
			{
				user: {
					id: 100003,
					name: 'Terceiro Usuário'
				},
				date: '12/08/2015',
				content: 'Qualquer coisa escrita.',
				amount: 231
			},
			{
				user: {
					id: 100004,
					name: 'Quarto Usuário'
				},
				date: '28/06/2015',
				content: 'Mais um pouco de texto.',
				amount: 8
			},
			{
				user: {
					id: 100005,
					name: 'Quinto Usuário'
				},
				date: '05/06/2015',
				content: 'Lorem ipsum dolor sit amet.',
				amount: 42
			},
			{
				user: {
					id: 100006,
					name: 'Sexto Usuário'
				},
				date: '18/04/2015',
				content: 'Mensagem pra finalizar as mensagens.',
				amount: 27
			},
		]
	};

	var HomeView = Backbone.View.extend({

		el: $('#body-content'),

		initialize: function() {
		},

		render: function(template) {
			var view = this;
			template.render(mockData, function(data, html) {
				view.$el.html(html);
			});
		}

	});

	return HomeView;
});