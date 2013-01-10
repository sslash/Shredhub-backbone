define([ 'jquery', 'underscore', 'backbone', 'bootstrapModal', 'video',
         'session', 'collections/shredCollection', 'views/home/shredView' ],
         function($, _,
		Backbone, BootstrapModal, Video, Session, shredCollection, ShredView) {

	var ShredsView = Backbone.View.extend({

		page : 1,

		initialize : function() {
			_.bindAll(this);
			this.collection = new shredCollection();
		},

		// Receives a template, so this class can be reused with different views (templates)
		setAttrs : function(query, shredsTemplate) {
			this.collection.initURL({
				'page' : this.page,
				'id' : Session.getUser().id,
				'query' : query
			});

			this.shredsTemplate = shredsTemplate;
		},

		render : function() {
			this.populateShreds();
			return this;
		},

		populateShreds : function() {
			var that = this;

			this.collection.fetch({
				success : function(res) {
					var template = _.template(that.shredsTemplate, {
						shreds : res.models
					});
					$(that.el).html(template);
				}
			});
		},

		events : {			
		 	"click .newShredsFromFaneesAncor" : "showVideoView",
		 	"keypress #tagSearch" : "populateShredsWithTags"
		},  
		
		populateShredsWithTags : function(event) {
			if(event.keyCode == 13) {	 
				var val = event.currentTarget.value; 				
				var tagsList = val.split(/,\s*/g);
				this.fetchShredsByTags(tagsList);
			}
		},
		
		fetchShredsByTags : function(tagsList) {
			var query= _.reduce( tagsList, function(memo, arg) {
				return memo + "&tag=" + arg;
			}, "ShredsByTags");
			
			console.log("url: " + query);
			this.collection.setQuery(query);
			this.render();
		},
		
		showVideoView : function(event) {
			
			// get the  shred
			var id = event.currentTarget.id;
			var shred = this.collection.models[id];
			 
			var shredView = new ShredView({
				el:"#newShredsModalBox",
				model : shred
			}); 
			shredView.render();			
		}
	});
	return ShredsView;
});
