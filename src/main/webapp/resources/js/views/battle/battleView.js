define([ 'jquery', 'underscore', 'backbone',
		'text!templates/battle/battleTemplate.html', 'video', 'uploadVideo',
		'session', 'text!templates/battle/shredBattleTemplate.html',
		'text!templates/battle/waitingForShredBattleTemplate.html',
		'text!templates/battle/addShredBattleTemplate.html',
		'text!templates/battle/battleRound.html' ],
		
		function($, _, Backbone, BattleTemplate, Video,
				UploadVideo, Session, ShredBattleTemplate,
				WatingForShredBattleTemplate, AddShredBattleTemplate,
				BattleRoundTemplate) {

	var BattleView = Backbone.View.extend({

		// model : battle
		el : "#page",
		battlerRatingDiv : "#battlerRatingTemplate",
		battlerCommentsDiv : "#battlerCommentsTemplate",
		battlerTmpl : "#battlerTmpl",
		battleeTmpl : "#battleeTmpl",
		battleRoundTmpl : "#battleRoundTmpl",
		// currentRoundNo: 1,
		// currentBattleRound: null,
		// lastRoundNo: 1
		
		initialize : function() {
			var that = this;
			this.model
					.fetch({
						success : function(res) {
							that.currentRoundNo = that.model.get('round');
							that.currentBattleRound = _.last(that.model
									.get('battleRounds'));
							that.lastRoundNo = that.currentRoundNo;
							console.log("Will display battle:\n"
									+ JSON.stringify(res));
							that.setEvents();
							that.render();
						}
					});
		},
		
		setEvents : function() {
			this.model.on('change', this.render, this); 
		},

		render : function() {
			this.currentBattleRound = this.model.get('battleRounds')[this.currentRoundNo-1];
			this.renderBattleTemplate();			
			return this;
		},

		events : {
			"submit #addShredForm" : "addBattleShred",
			"click #nextRound" : "nextBattleRound",
			"click #prevRound" : "prevBattleRound",
			"keypress .commentText" : "addComment",
			"click .rateButton" : "rateShred"
		},		

		rateShred : function(event) {
			event.preventDefault();
			var performer = event.currentTarget.id;
			performer = performer.split("Rating")[0];			
			var rateVal = $('#' + performer + 'rateVal').val();
			this.model.addRatingForBattleShred({
				roundNumber : this.currentRoundNo,
				rateValue : rateVal,
				performer : performer
			});
		},
		
		addComment : function ( event ) {
			if(event.keyCode == 13) {
				var performerId = event.currentTarget.id;
				
				this.model.addCommentToShred({
					roundNumber : this.currentRoundNo,
					performer: performerId.split("Comment")[0],
					commentText : $('#' + performerId).val(),
					commenterId : Session.getUser().id
				});
			}			
		},
		
		prevBattleRound : function() {
			console.log("prevRound"); 
			event.preventDefault();
			if ( this.currentRoundNo > 1 ) {
				this.currentRoundNo --; 
				this.currentBattleRound = this.model.get('battleRounds')[this.currentRoundNo-1];
				this.renderBattles();
			} 
		}, 

		nextBattleRound : function() {
			console.log("nextRound");
			event.preventDefault();

			// if battler is this user, and its time for a new round
			if (this.lastRoundNo == this.currentRoundNo
					&& this.model.get('battler').id == Session.getUser().id
					&& this.currentBattleRound.battleesShred != null) {
				this.renderAdvanceBattleRound();
				
			// go to next round if there are any
			} else if ( this.currentRoundNo < this.lastRoundNo ) {
				this.currentRoundNo ++; 
				this.currentBattleRound = this.model.get('battleRounds')[this.currentRoundNo-1];
				this.renderBattles();
			}

		},

		renderAdvanceBattleRound : function() {
			this.currentRoundNo++;
			this.renderBattleRound();

			var battlerTemplate = _.template(AddShredBattleTemplate, {
				nextUp : 'battlersShred'
			});

			$(this.battlerTmpl).html(battlerTemplate);
			$(this.battleeTmpl).html("");
		},

		addBattleShred : function(event) {
			var nextUp = $("#nextUp").val();
			console.log("Will post!");
			event.preventDefault();

			if (nextUp == 'battlersShred') {
				this.model.set({
					round : this.model.get('round') + 1
				}, {silent:true});
				this.lastRoundNo ++;
				
				this.model.get('battleRounds').push({
					battlersShred : this.createNewBattleShred(),
					battleesShred : null
				});
				this.currentBattleRound = _.last(this.model.get('battleRounds'));
			} else {
			// TODO: create some checks here.. not secure, but super slick
				this.currentBattleRound[nextUp] = this.createNewBattleShred();
			}
			
			// Update the value for the last battleshred as well!
			var that = this;
			var formData = new FormData( $('#addShredForm')[0]);
			this.model.save({lastBattleShred : new Date()},{
				success : function(res) {
					console.log("Success!: " + res);
					that.uploadVideo(formData);
				}, silent:true
			}); 
			
		},
		
		uploadVideo : function(formData) {

			// Upload the video
			var options = {
				data : formData,
				url : 'battles/' + this.model.id + '/?action=addVideo',
				callback : this.uploadSuccess,
				context : this
			};
			
			UploadVideo.upload(options);
		},
		
		createNewBattleShred : function () {
			return { 
				rating : {			
					currentRating : 0,
					numberOfRaters : 0
				},
				timeCreated : new Date
			};
		},

		uploadSuccess : function(res) {
			console.log('done sending! ' + res);
			_.first(this.model.get('battleRounds'))[$("#nextUp").val()] = res
			this.currentBattleRound[$("#nextUp").val()] = res;
			this.renderBattles();
		},

		renderBattleTemplate : function() {
			var battlePoints = this.calculateBattlePoints();
			var leader = '';
			if ( battlePoints.battlersPoints > battlePoints.battleesPoints ) { 
				leader = this.model.get('battler').username;
			} else if ( battlePoints.battleesPoints > battlePoints.battlersPoints ) {
				leader = this.model.get('battlee').username;
			} else {
				leader = "It's a tie"
			}
			
			var data = {
				battle : this.model,
				battleRound : this.currentBattleRound,
				battlePoints : battlePoints,
				leader : leader
			};
			var template = _.template(BattleTemplate, data);
			$(this.el).html(template);
			this.renderBattles();
		},
		
		/*
		 * For each battleround: for each battle performer: get all the points
		 * and sum up
		 */
		calculateBattlePoints : function() {
			
			var res = {battlersPoints: 0, battleesPoints: 0};
			_.each (this.model.get('battleRounds'), function(round, i) {
			
				if ( round.battlersShred ) {
					res.battlersPoints += (round.battlersShred.rating.currentRating / 
							round.battlersShred.rating.numberOfRaters);					
				} 
				
				if ( round.battleesShred) {					
					res.battleesPoints += (round.battleesShred.rating.currentRating / parseInt(round.battleesShred.rating.numberOfRaters));
				}  
			});
			
			return res;		
		},

		renderBattles : function() {
			this.renderBattleRound();
			this.renderBattlerTemplate();
			this.renderBattleeTemplate();
		},
		
		renderBattleRound : function() {
			var template = _.template(BattleRoundTemplate, {
				currentRound : this.currentRoundNo
			});
			$(this.battleRoundTmpl).html(template);
		},

		renderBattlerTemplate : function() {
			var battlerTemplate = _.template(ShredBattleTemplate, {
				shred : this.currentBattleRound.battlersShred,
				id : 'battler',
			});
			$(this.battlerTmpl).html(battlerTemplate);
		},

		renderBattleeTemplate : function() {
			if (this.currentBattleRound.battleesShred == null) {
				// if the battlee is this guy
				if (this.model.get('battlee').id == Session.getUser().id) {
					battleeTemplate = _.template(AddShredBattleTemplate, {
						nextUp : 'battleesShred'
					});
				} else {
					battleeTemplate = _.template(WatingForShredBattleTemplate,
							{ battler : this.model.get('battlee').username });
				}

			} else {
				var battleeTemplate = _.template(ShredBattleTemplate, {
					shred : this.currentBattleRound.battleesShred,
					id : 'battlee'
				});
			}
			$(this.battleeTmpl).html(battleeTemplate);
		}
	});

	return BattleView;

});