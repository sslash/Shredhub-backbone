	// Used to copy-paste in stuff
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/battle/battlesListTemplate.html',
  'collections/battlesCollection',
  'session'
], function($, _, Backbone, BattlesListTemplate, BattlesCollection,
		Session){
	
	var BattlesView = Backbone.View.extend({
		
		el: "#page",
		
		initialize : function() {
			this.collection = new BattlesCollection();
			this.collection.on("reset", this.renderTemplate, this);
		},
		
		events : {
			"click #yourBattlesButton" : "renderYourBattles"
		},
		
		renderYourBattles : function() {
			var url = "battles/shredder/" + Session.getUser().id;
			this.collection.setUrl(url);
			var that = this;
			this.collection.fetch();
		},
		
		render : function () {
			var that = this;
			this.collection.fetch({success: function(res){
				that.renderTemplate(); 
			}
			});
		},
		
		renderTemplate : function() {
			console.log("Will render template for battles!!");
			var template = _.template(BattlesListTemplate, {battles : this.collection.models});
			$(this.el).html(template);
		}
	});

  return BattlesView;
});