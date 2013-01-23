/**
 * The main log in / signup page in the application
 */
define([ 
        'jquery',
        'underscore',
        'backbone', 
        'video',
        'bootstrapModal',
        'bootstrapCarousel',
		'collections/shredCollection',
        'views/home/shredView',
		'text!templates/home/main.html',
        'text!templates/home/mainNavigation.html',
        'session'
		], function($, _, Backbone, Video,
		BootstrapModal, BootstrapCarusel,ShredCollection, 
		ShredView, shredListTemplate, navigationTemplate,
		Session) {

		var MainHomeView = Backbone.View.extend({
		el : $("#page"),   

		initialize : function() {
			var attr = {page:1, query:'TopShreds', id:null};
			this.collection = new ShredCollection();
			this.collection.initURL(attr);
		},

		render : function() {
			//this.loadNavBar();
			this.loadResults();
			this.runCarousel();
		},
		
		events : {			
		 	"click .shredVideoThumb" : "showVideoView"
		},  
		
		showVideoView : function(event) {
			event.preventDefault();
			// get the  shred
			var id = event.currentTarget.id;
			var shred = this.collection.models[id];
			 
			var shredView = new ShredView({
				el:"#newShredsModalBox",
				model : shred
			}); 
			shredView.render();			
		},
		
		runCarousel: function() {
			$('.carousel').carousel();
		},
		
		loadNavBar: function() {

			var navData = {
					loggedIn : false					
			}; 
			var navTmplCompiled = _.template(navigationTemplate, navData);
            $("#navigation").html(navTmplCompiled); 
		},
		
		loadResults: function() {
			console.log("Fetching top shreds for main view");
			var that = this;
			this.collection.fetch({ 
				success: function(res) {
					var data = {				
						shreds : that.collection.models 
					}; 
					// Put these on session! :)
					Session.setTopShreds(JSON.stringify(that.collection.models));					

					var compiledTemplate = _.template(shredListTemplate, data);
					that.$el.html(compiledTemplate);					
				}
			});
		},
	});

	return MainHomeView;
});