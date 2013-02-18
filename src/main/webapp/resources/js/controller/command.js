define(
		[ 'jquery', 'underscore', 'views/home/navigationView', 'session',
				'collections/battleRequestCollection', 'views/home/mainView' ],
		function($, _, NavigationView, Session, BattleRequestsCollection,
				MainView) {

			var Command = function() {
			};

			Command.shredders = function() {

				require([ 'views/shredders/shreddersView' ], function(
						ShreddersView) {
					var shreddersView = new ShreddersView();
					shreddersView.render();
				});
			};

			Command.home = function() {
				var mainView = new MainView();
				mainView.render();
			};

			Command.shredPool = function() {
				console.log("logging in!");
				require([ 'views/home/shredPool' ], function(ShredPoolView) {
					$('#signInModal').modal('hide');
					var shredPoolView = new ShredPoolView();
					shredPoolView.render();
				});
			};
			Command.login = function(attr) {

				require(
						[ 'collections/battleRequestCollection' ],
						function(BattleRequestsCollection) {
							$
									.ajax({
										type : "POST",
										url : 'login',
										contentType : "application/json",
										data : JSON.stringify(attr),
										success : function(data) {
											if (data) {
												(require(
														[ 'session' ],
														function(Session) {
															Session
																	.setUser(data);
															console
																	.log("lol: "
																			+ Session
																					.getUser().id);
															window.Session = Session;

															// Render logged in
															// navigation
															window.navigationView = new NavigationView(
																	{
																		collection : new BattleRequestsCollection()
																	});
															window.navigationView
																	.render();

															window.app_router
																	.navigate(
																			"#shredPool",
																			{
																				trigger : true
																			});
														}));

											} else {
												console
														.log("Wrong username or pass");
												$("#loginError")
														.text(
																"Wrong username or password");
												$("#signInModal").modal(
														'toggle');
												window.app_router
														.navigate("#signInModal");
											}
										}
									});

						})();
			};

			Command.showShredder = function(shredderId) {

				require([ 'models/shredder', 'views/profile/shredderView' ],
						function(Shredder, ShredderView) {

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
						});
			};

			Command.profile = function() {
				require([ 'models/shredder', 'views/profile/shredderView' ],
						function(Shredder, ShredderView) {

							var shredderView = new ShredderView({
								model : new Shredder(Session.getUser()),
								fanees : Session.getUser().fanees
							});
							shredderView.render();
						});
			};

			Command.battles = function() {
				require([ 'views/battle/battlesView' ], function(BattlesView) {

					var battlesView = new BattlesView();
					battlesView.render();
				});
			};

			Command.showBattle = function(battleId) {
				require([ 'models/battle', 'views/battle/battlesView' ],
						function(Battle, BattlesView) {

							var battle = new Battle({
								id : battleId
							});

							var battleView = new BattleView({
								model : battle
							});

						});
			};

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
				window.Session = Session;
				// Renders the navigationview each time. Might be performance
				// lame
				if (!window.navigationView) {
					Command.renderNavigation();
				}
				Command[action]
						&& Command[action].apply(Command, [].slice.call(
								arguments, 1));
			};

			return Command;
		});