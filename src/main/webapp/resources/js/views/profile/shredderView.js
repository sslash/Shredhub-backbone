define([ 'jquery', 'underscore', 'backbone', 'session',
		'text!templates/profile/shredderTemplate.html',
		'collections/shredCollection',
		'text!templates/profile/shredTemplate.html', 'views/home/shredView',
		'views/profile/battleRelationshipView',
		'text!templates/profile/faneesTemplate.html' ], function($, _,
		Backbone, Session, ShredderTemplate, ShredCollection, ShredTemplate,
		ShredView, BattleRelationshipView, FaneesTemplate) {

	var ShredderView = Backbone.View.extend({
		el : '#page',
		faneesDiv : "#fanees",
		page : 1,
		shredDiv : "#shreds",
		shredderLvlLabels : ["Beginner", "Skilled", "Awesome", "Shred king", "Wizard"],

		// model : shredder 
		// username : slash

		initialize : function() {
			console.log("init model = " + this.model.get('username'));
			_.bindAll(this);
			this.collection = new ShredCollection();
			this.collection.setUrl("shreds/shredder/" + Session.getUser().id);
		},

		render : function() {
			var levelLabel = this.getLevelLabel();
			var compiledTmpl = _.template(ShredderTemplate, {
				"shredder" : this.model,
				"levelLabel": levelLabel
			});
			$(this.el).html(compiledTmpl);
			this.populateShreds();
			this.populateFanees();
			this.renderBattleRelationshipView();
			return this;
		},
		
		getLevelLabel : function() {
			var currLvl = this.model.get('shredderLevel');
			if ( currLvl > 0 ) currLvl = currLvl/100;
			
			if (  currLvl < 20 ) {
				return this.shredderLvlLabels[0];
			} else if (  currLvl < 40 ) {
				return this.shredderLvlLabels[1];
			} else if (  currLvl < 60 ) {
				return this.shredderLvlLabels[2];
			} else if (  currLvl < 80 ) {
				return this.shredderLvlLabels[3];
			}else {
				return this.shredderLvlLabels[4];
			}
		},

		renderBattleRelationshipView : function() {
			var battleRelationship = new BattleRelationshipView({
				shredder : this.model,
				Session : Session
			});
			//battleRelationship.init(this.model); 
			battleRelationship.render();
		},

		populateFanees : function() {
			// Here, I fetch all the fanees from the server.
			// The server could do the job for me when I got the 
			// shredder, but this goes against the thick client model
			if ( this.options.fanees ) {
				this.renderFanees(this.options.fanees);
			} else {
				var faneesList = this.model.get('fanees');
				this.fetchFanees(faneesList);
			}
		},

		fetchFanees : function(shredders) {
			var shredderIds = 
				_.reduce(shredders, function(memo, tmp){ 
					return memo + "&shredderIds=" + tmp },
					"");

			var that = this;
			$.get("shredders/?action=listOfShredders",
				shredderIds,
				function(res) {
					that.renderFanees(res);					
				}				
			);
		},
		
		renderFanees : function(fanees) {
			var compiledTmpl = _.template(FaneesTemplate, {
				"fanees" : fanees
			});
			$(this.faneesDiv).html(compiledTmpl);
		},

		populateShreds : function() {
			var that = this;

			this.collection.fetch({
				success : function(res) {
					if (res.models) {
						var template = _.template(ShredTemplate, {
							shreds : res.models
						});
						$(that.shredDiv).append(template);
					}
				}
			});
		},

		events : {
			"click .showPlayModal" : "showPlayModal",
			"click #becomeFanButton" : "becomeFan",
		},

		becomeFan : function(event) {
			var user = Session.getUser();
			if (!user) {
				console.log("not logged in..");
				return false;
			}

			$.ajax({
				type : "PUT",
				url : "shredders/".concat(user).concat("/fanees"),
				data : {
					faneeId : this.model.get('id')
				},
				success : function(res) {
					console.log("res: " + res);
				}
			});
		},

		showPlayModal : function(event) {
			event.preventDefault();
			console.log("Show play modal entered!");
			var id = event.currentTarget.id;
			var shred = this.collection.models[id];

			(require([ 'text!templates/home/videoView.html' ], function(
					shredTemplate) {
				var shredView = new ShredView({
					el : "#newShredsModalBox",
					model : shred
				});
				//shredView.setTemplate(shredTemplate); 
				shredView.render();
			}))();
		}

	});

	return ShredderView;
});
