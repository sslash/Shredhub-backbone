	// Used to copy-paste in stuff
define([
  'jquery',
  'underscore',
  'backbone',
  'session', 
  'collections/shredderCollection', 
  'text!templates/shredders/shreddersTemplate.html',
  'models/shredder',
  'views/profile/shredderView'
], function($, _, Backbone, Session,
		ShredderCollection, ShreddersTemplate,Shredder, ShredderView){
	
	var ShreddersView = Backbone.View.extend({
		
		el: "#page",
		page: 1,
		
		initialize : function() {
			this.collection = new ShredderCollection(Session.getUser().fanees);
			this.collection.setUrl("");
		}, 
		
		render: function(){ 
			this.renderTemplate();
		},
		
		events : {
			"keypress #shredderSearch" : "shredderSearchOnEnter"
		},
		
		shredderSearchOnEnter : function(event) {
			event.preventDefault();
			if(event.keyCode == 13) {	
				var url = 'shredders/username/' + event.currentTarget.value;
							
				$.getJSON(url, function(shredderJson) {
					if (shredderJson) {
						var shredder = new Shredder(shredderJson);
						var shredderView = new ShredderView({
							model : shredder
						});
						window.app_router.navigate("#shredder/" + shredder.id);
						shredderView.render();
					}else {
						$('.text-error').text('shredder was not found..');
					}
				});
			}
		},
		
		renderTemplate: function() {
			// Set the level
			_.each(this.collection.models, function(shredder) {
				var shredderLevel = shredder.get('shredderLevel');
				var level = shredderLevel > 0 ? shredder.get('shredderLevel')/100 : 0;
				shredder.set("level", level);
			});
			
			var compiledTmplt = _.template(ShreddersTemplate, {shredders: this.collection.models});
			$(this.el).html(compiledTmplt);
		}
	});

  return ShreddersView;
});