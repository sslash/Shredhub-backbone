define([ 'jquery', 'underscore', 'backbone', 'models/shredder'], function($, _, Backbone,
		Shredder) {
	var ShredModel = Backbone.Model.extend({
		urlRoot : "shreds",
		defaults : {
			videoPath : '',
			description : '',
			shredRating : {
				numberOfRaters : 0,
				currentRating : 0
			},
			shredComments: new Array(),
			owner: {},
			timeCreated: new Date(),
			tags: new Array(),
			shredType:"normal",
			shredderLevel: 0
		},

		initialize : function() {

			if (!this.get('shredComments')) {
				this.set({
					shredComments : new Array()
				});
			}
		},

		// Todo: Add validation..
		validate : function(attributes) {
		},

		addRating : function(rateValue) {	
			var shredRating = this.get('shredRating');
			shredRating.numberOfRaters ++;
			shredRating.currentRating += parseInt(rateValue);			
			this.increaseShredLevel(parseInt(rateValue));
			this.save();
		},
		
		increaseShredLevel : function(level) {
			var shredder = this.get('owner');
			shredder.shredderLevel += level;
			var shredder = new Shredder(shredder);			
			shredder.save();
		},

		addComment : function(commentText) {
			var shredComment = {
				text : commentText,
				commenterId : "509971403ac1d6b8e31874f7",
				timeCreated : new Date()
			};
			var url = "shreds/" + this.get('id') + "/comments/";
			var that = this;
			
			$.ajax(url, {
			    data : JSON.stringify(shredComment),
			    contentType : 'application/json',
			    type : 'POST',
			    success : function(model) {
					console.log("succsessfully updated comments");
					that.set({shredComments: model.shredComments}); 
				}
			});
		}
	});
	return ShredModel;

});