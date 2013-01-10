define([ 'jquery',
         'underscore',
         'views/home/navigationView',
         'session',/*
		'collections/battleRequestCollection',
		'views/home/mainView',
		'views/home/twitterWidget',
		'views/battle/battlesView',
		'models/battle', 
		'views/battle/battleView',
		'models/shredder',
		'views/profile/shredderView',
		'views/home/shredPool',
		'views/shredders/shreddersView' */
         'collections/battleRequestCollection',
         'views/home/mainView'], function($, _, NavigationView,
		Session/*, BattleRequestsCollection, MainView, TwitterWidget,
		BattlesView, Battle, BattleView, Shredder, ShredderView, ShredPoolView,
		ShreddersView*/,BattleRequestsCollection, MainView) {

	var Command = function() {
	};

	Command.shredders = function() {

		var shreddersView = new ShreddersView();
		shreddersView.render();
	};

	Command.home = function() {
		var mainView = new MainView();
		mainView.render();
	};

	Command.shredPool = function() {
		console.log("logging in!");
		require(['views/home/shredPool'], function(ShredPoolView){
			$('#signInModal').modal('hide');
			var shredPoolView = new ShredPoolView();
			shredPoolView.render();
		});
	};
	Command.login = function(attr) {
		
		require(['collections/battleRequestCollection'],
				function(BattleRequestsCollection){
		$.ajax({
			type : "POST",
			url : 'login',
			contentType : "application/json",
			data : JSON.stringify(attr),
			success : function(data) {
				if (data) {
					(require([ 'session' ], function(Session) {
						Session.setUser(data);
						console.log("lol: " + Session.getUser().id);
						window.Session = Session;
						
						// Render logged in navigation
						window.navigationView = new NavigationView({
							 collection : new BattleRequestsCollection()
						});
						window.navigationView.render();
						
						window.app_router.navigate("#shredPool", {
							trigger : true
						});
					}));

				} else {
					console.log("Wrong username or pass");
					$("#loginError").text("Wrong username or password");
					$("#signInModal").modal('toggle');
					window.app_router.navigate("#signInModal");
				}
			}
		});
		
		})();
	};
	/*

	Command.showShredder = function(shredderId) {
		var shredder = new Shredder({
			id : shredderId
		});

		shredder.fetch({
			success : function(res) {
				var shredderView = new ShredderView({
					model : shredder
				});
				shredderView.render();
			}
		});
	};

	

	Command.battles = function() {
		var battlesView = new BattlesView();
		battlesView.render();
	};

	Command.showBattle = function(battleId) {
		var battle = new Battle({
			id : battleId
		});

		var battleView = new BattleView({
			model : battle
		});
	};
*/

	Command.renderNavigation = function() {
		if (Session.getUser()) {
			window.navigationView = new NavigationView({
				collection : new BattleRequestsCollection()
			});
		} else {
			window.navigationView = new NavigationView();
		}
		window.navigationView.render();
	};

	Command.execute = function(action) {
		console.log("Execute: " + action + ", Session : " + Session.getUser());

		window.Session = Session;
		// Renders the navigationview each time. Might be performance lame
		if (!window.navigationView) {
			Command.renderNavigation();
		}
		Command[action]
				&& Command[action].apply(Command, [].slice.call(arguments, 1));
	};

	return Command;
});