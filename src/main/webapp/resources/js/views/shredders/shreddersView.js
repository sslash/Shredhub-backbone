define([
  'jquery',
  'underscore',
  'backbone',
  'session', 
  'collections/shredderCollection', 
  'text!templates/shredders/shreddersTemplate.html'
], function($, _, Backbone, Session,
		ShredderCollection, ShreddersTemplate){
	
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
				var that = this;
				$.getJSON(url, function(shredderJson) {
					if (shredderJson) {
						that.navigateToShredder(shredderJson);
					}else {
						$('.text-error').text('shredder was not found..');
					}
				});
			}
		},
		
		navigateToShredder : function(shredderJson) {
			
			// Lazily loaded scripts to load the shredder page faster!
			require(['models/shredder', 'views/profile/shredderView'], 
					function(Shredder, ShredderView){
				
				$('#signInModal').modal('hide');
				var shredder = new Shredder(shredderJson);
				var shredderView = new ShredderView({
					model : shredder
				});
				window.app_router.navigate("#shredder/" + shredder.id);
				shredderView.render();
			});
		},
		
		renderTemplate: function() {
			var compiledTmplt = _.template(ShreddersTemplate, {shredders: this.collection.models});
			$(this.el).html(compiledTmplt);
		}
	});

  return ShreddersView;
});