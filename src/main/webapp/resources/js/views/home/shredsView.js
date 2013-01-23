define([ 'jquery', 'underscore', 'backbone', 'bootstrapModal', 'video',
         'session', 'collections/shredCollection', 'views/home/shredView' ],
         function($, _,
		Backbone, BootstrapModal, Video, Session, shredCollection, ShredView) {

	var ShredsView = Backbone.View.extend({

		page : 1,		
		advancePage : 1,
		

		initialize : function() {
			_.bindAll(this);
			
			if ( !this.options.fetched ) {
				this.collection = new shredCollection();
			}
			
			if ( !this.options.collSetSize) {
				this.options.collSetSize = 4;
				this.options.startCollIndex = 5;
			}
			this.options.currCollIndex = this.options.startCollIndex;			
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
		
		nextShreds : function(event) {
			event.preventDefault();
		
			if (this.options.currCollIndex == this.advancePage){
				this.collection.advancePage();
				this.options.currCollIndex = this.options.startCollIndex;
				var that = this;
				this.collection.fetch({
					success : function(res) {
						that.renderCollection();
					}
				});
			} else {
				this.options.currCollIndex --;
				this.renderCollection();
			}	
		},
		
		renderCollection : function() {
			console.log("Will render new coll. currIndex: " + this.options.currCollIndex + ", vidSetSize: " +  this.options.collSetSize);
			
			var template = _.template(this.shredsTemplate, {
				shreds : _.last(this.collection.models, this.options.currCollIndex*this.options.collSetSize),
				index : (this.options.startCollIndex - this.options.currCollIndex) * this.options.collSetSize
			});
			$(this.el).html(template);		
		},

		render : function() {
			if ( !this.options.fetched ) {
				console.log("collection not fetched");
				this.populateShreds();
			}else{
				console.log("collection already fetched");
				this.renderCollection();
			}
			return this;
		},

		populateShreds : function() {
			var that = this;
			this.collection.fetch({
				success : function(res) {
					that.renderCollection();
				}
			});
		},

		events : {			
		 	"click .newShredsFromFaneesAncor" : "showVideoView",
		 	"keypress #tagSearch" : "populateShredsWithTags",
		 	"click .nextShred" : "nextShreds"
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
			
			this.collection.setQuery(query);
			this.render();
		},
		
		showVideoView : function(event) {
			
			// get the shred id
			var id = event.currentTarget.id.split("_")[1];			
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
