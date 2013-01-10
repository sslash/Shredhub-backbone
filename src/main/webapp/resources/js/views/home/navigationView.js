define([ 'jquery', 'underscore', 'backbone', 'bootstrapModal',
        'bootstrapDropdown',
		'text!templates/home/navigation.html',
		'text!templates/home/mainNavigation.html',
		'collections/battleRequestCollection',
		'models/battle'], function($, _, Backbone,
		BootstrapModal, BootstrapDropdown, NavigationTemplate,
		MainNavigation, BattleRequestCollection, Battle) {

	var NavigationView = Backbone.View.extend({
		el : '#navigation',
		
		initialize : function() {
			_.bindAll(this);
		},
		
		render : function() { 
			console.log("Window user: " + window.Session.getUser());
			if (window.Session.getUser()){
				console.log("renders logged IN nav");
				this.renderBattleRequestsAndTemplate();
			} else {
				console.log("renders not logged in nav");
				var navTmplCompiled = _.template(MainNavigation);
				$(this.el).html(navTmplCompiled);
			}

		},

		events : {
			"click #new" : "openAddModal",
			"click #save" : "saveShred",
			"click #close" : "closeModal",
			"click #loginButton" : "closeLoginModal",
			"click .battleRequestModal" : "openBattleRequestModal"
		},
		
		openBattleRequestModal : function(event) {
			console.log("open modal" + this.cid);
 
			event.preventDefault();
			// event.currentTarget.
			var id =  event.currentTarget.id; 
			var battleRequest = this.collection.get(id);
			console.log("BATTLE res : " + battleRequest);
			
			var battle = new Battle();
			battle.createBattleFromBattleRequest(battleRequest);
			battleRequest.on("destroy", this.render, this);
			return this; 
		},

		renderBattleRequestsAndTemplate : function() {
			console.log("render:" + this.cid);			
			// bind the correct instance of this
 			this.collection.setShredderId(window.Session
					.getUser().id);

			var navData = {};
			navData.username = window.Session.getUser().username;
			navData.shredderId = window.Session.getUser().id;
			var that = this;
			this.collection.fetch({
				success : function(res) {
					console.log("succes!"
							+ JSON.stringify(that.collection));
					 
					navData.battleRequests = that.collection.models; 
					console.log("LOL: " + that.cid);
					var navTmplCompiled = _.template(NavigationTemplate, navData);
					$(that.el).html(navTmplCompiled);
				}
			});
		},

		closeLoginModal : function() {
			console.log("close login modal");
			$("#signInModal").modal('toggle');
			window.app_router.navigate("#login", {
				trigger : true
			});
		},

		openAddModal : function() {
			$("#myModal").modal('toggle');
		},

		saveShred : function() {
			console.log("saving shred");
			$("#myModal").modal('toggle');
			this.collection.create({
				name : $("#inputName").val(),
				url : $("#inputUrl").val()
			});
			this.render();
		},

		closeModal : function() {
			$("#myModal").modal('toggle');
		}

	});
	return NavigationView;
});