// TODO: Render the shredder if a battle request is sent! 
define([ 'jquery', 'underscore', 'backbone',
		'models/battle', 'models/battleRequest',
		'bootstrapModal','video'],
		function($, _, Backbone, Battle, BattleRequest, BootstrapModal, Video) {

	/**
	 * Defines a view inside the shredder that displays
	 * the shredders relationship with the currently logged in user
	 */
	var BattleRelationshipView = Backbone.View.extend({
		
		el: "#battleRelationship",

		
		/*
		 * The model is either a battle object, a battlerequest object, or null
		 */
		render : function() {
			this.tryFetchModel();
		},
		
		events : {
			"click #checkBattleRequestButton" : "openBattleRequestModal",
			'click #acceptBattle' : 'acceptBattle',
			"click #challengeToBattleButton" : "openChallengeToBattleModal" 
		},
		
		openChallengeToBattleModal: function(event) {
			console.log("battle!"); 
			var that = this;
			
			// Only load the template now when the button is first pressed.
			// Reduces loading !
			(require(['views/battle/addBattleView'],
					 function(AddBattleView){
				console.log("will execute challenge battle view");
				var battleView = new AddBattleView();
				battleView.setBattlee(that.options.shredder);
				battleView.render();		
			}))();					
		},
		
		
		acceptBattle : function() { 
			console.log("will accept battle");
			var battle = new Battle({
				battler: this.model.get('battler'),
				battlee: this.model.get('battlee'),
				battleStyle: this.model.get('battleStyle')
			});
			
			var battleShred = {
					videoPath: this.model.get('videoPath'),
					videoThumbnail : this.model.get('videoThumbnail'),
					timeCreated: this.model.get('timeCreated'),
					rating: {
						numberOfRaters : 0,
						currentRating : 0
					}
			};
			
			
			var battleRound = {
					battlersShred: battleShred,
					battleesShred: null
			};
			
			battle.get('battleRounds').push(battleRound);
			battle.save();	
			this.model.destroy();
			this.render();
			
			// create battle object and get the first shred from the battle request object
			// save the object so its persisted
			// delete this model object 
			// call render again
		},
		
		openBattleRequestModal : function() { 
			$("#battleRequestModal").modal('show'); 
		},
		
		renderTemplate : function(TemplateStr, div) {
			var that = this;
			(require([TemplateStr], 
					 function(Template){ 
				var compiled = _.template(Template, {
						model: that.model,
						shredder: that.options.shredder,
						user: that.options.Session.getUser()
					});
				$(div).html(compiled);				
			}))();
		},

		tryFetchModel : function() {
			console.log("first try and get battles");
			var that = this;
			$.getJSON('battles/', {
				'shredder1' : this.options.shredder.id,
				'shredder2' : this.options.Session.getUser().id
			}, function(res) {
				console.log("battle res: " + res);
				if (!res) {
					console.log("Not in battle");								 
					that.tryFetchBattleRequest();
				} else {
					console.log("They are in a battle!");
					that.model = new Battle(res);
					that.renderTemplate('text!templates/profile/inBattleRelationshipTemplate.html', that.el);
										
				}
			});
		},

		tryFetchBattleRequest : function() {
			var that = this;
			$.getJSON('battleRequests/', {
				'shredder1' : this.options.shredder.id,
				'shredder2' : this.options.Session.getUser().id
			}, function(res) {
				console.log("battle req res: " + res);
				if (!res) {
					console.log("Not in battle request");
					that.renderTemplate('text!templates/profile/addBattleRequestTemplate.html', that.el);
				} else {
					console.log("They are in a battle requests!");
					that.model = new BattleRequest(res);
					that.renderTemplate('text!templates/profile/battleRequestPendingTemplate.html', that.el);
					that.renderTemplate('text!templates/battle/battleRequestTemplate.html', "#battleRequestModalTemplate");
				}
			});
		}
	});

	return BattleRelationshipView;
});