// Filename: router.js
define([ 'jquery', 'underscore', 'backbone', /*'vm',*/ 'command' ], function($, _,
		Backbone, /*Vm,*/ Command) {

	var AppRouter = Backbone.Router.extend({
		routes : {
			'login' : 'login',
			'shredPool' : 'shredPool',
			'shredder/:shredderId' : 'showShredderView',
			'shredders' : 'showShreddersView',
			'battles/:battleId' : 'showBattleView',
			'battles' : 'showBattlesView',
			'*actions' : 'defaultAction',
			'/' : 'defaultAction'
		}
	});

	// TODO: Use the command object to do the routing delegation
	var initialize = function() {
		window.app_router = new AppRouter;

		
		window.app_router.on('route:defaultAction', function(actions) {
			Command.execute("home");
		});
		
		window.app_router.on("route:showBattlesView", function() {
			Command.execute("battles");
		});

		window.app_router.on("route:showBattleView", function(battleId) {
			Command.execute("showBattle", battleId);			
		});

		window.app_router.on('route:showShredderView', function(shredderId) {
			Command.execute("showShredder", shredderId);
		});

		window.app_router.on('route:showShreddersView', function() {
			Command.execute("shredders");
		});

		window.app_router.on('route:login', function() {

			Command.execute("login", {
				username : $('#username').val(),
				password : $('#password').val()
			});
		}); 
		
		window.app_router.on('route:shredPool', function() {
			Command.execute("shredPool");
		});

		Backbone.history.start();

	};
	return {
		initialize : initialize
	};
});