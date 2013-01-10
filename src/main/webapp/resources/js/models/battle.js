define(
		[ 'jquery', 'underscore', 'backbone', 'models/shredder' ],
		function($, _, Backbone, Shredder) {

			var Battle = Backbone.Model
					.extend({
						urlRoot : 'battles',
						defaults : {
							battler : {},
							battlee : {},
							battleStyle : '',
							round : 1,
							timeCreated : new Date(),
							battleRounds : new Array()
						},

						addRatingForBattleShred : function(rating) {
							console.log("rate: " + JSON.stringify(rating));
							// console.log(JSON.stringify(this.attributes));
							// var battleRound =
							// this.get('battleRounds')[rating.roundNumber - 1];
							var battleShred = this
									.getBattleRoundFromOptionsHash(rating);
							var currRate = battleShred.rating;
							currRate.numberOfRaters++;
							currRate.currentRating += parseInt(rating.rateValue);
							this.increaseShredLevelForShredder(
									rating.performer,
									parseInt(rating.rateValue));
							this.save();
						},

						increaseShredLevelForShredder : function(shredderName,
								points) {
							var shredder = this.get(shredderName);
							shredder.shredderLevel = shredder.shredderLevel ? shredder.shredderLevel
									+ points
									: points;

							var sh = new Shredder(shredder);
							// I actually performs the shredder level increase
							// on the shredder aswell.
							// this is because of a duplication in the
							// datastructure
							// ( both shredder and battler needs to be updated )
							// I should try and find the overhead of doing this
							// duplication
							sh.save();
						},

						addCommentToShred : function(comment) {
							console.log("comment: " + JSON.stringify(comment));
							var battleShred = this
									.getBattleRoundFromOptionsHash(comment);
							if (!battleShred.shredComments) {
								battleShred.shredComments = new Array();
							}

							battleShred.shredComments.push({
								timeCreated : new Date(),
								text : comment.commentText,
								commenterId : comment.commenterId,
							});
							this.save();
						},

						getBattleRoundFromOptionsHash : function(opts) {
							var battleRound = this.get('battleRounds')[opts.roundNumber - 1];
							return battleRound[opts.performer + 'sShred'];
						},

						createBattleFromBattleRequest : function(battleRequest) {
					
							console.log("will save battle from battle shred!");
							var battleShred = {
								videoPath : battleRequest.get('videoPath'),
								videoThumbnail : battleRequest
										.get('videoThumbnail'),
								timeCreated : battleRequest.get('timeCreated'),
								rating : {
									numberOfRaters : 0,
									currentRating : 0
								}
							};
							this.save({
								battler : battleRequest.get('battler'),
								battlee : battleRequest.get('battlee'),
								battleStyle : battleRequest.get('battleStyle'),
								timeCreated : new Date(),
								round : 1,
								lastBattleShred : battleRequest.get('timeCreated'),
								timeCreated : new Date(),
								battleRounds : [ {
									battlersShred : battleShred,
									battleesShred : null
								}]
							}, {success : function() {
								battleRequest.destroy();
							}});
						},

					});
			return Battle;
		});