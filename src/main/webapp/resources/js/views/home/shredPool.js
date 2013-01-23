define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrapModal',
  'session',
  'collections/shredCollection',
  
  // Views
  'views/home/shredsView', 
  'views/home/addShredView',
  'views/home/shredNewsView',
  
  // Templates
  'text!templates/home/shredPool.html',
  'text!templates/home/newShredsFromFanees.html',
  'text!templates/home/topShreds.html',
  'text!templates/home/mightKnowShreds.html',
  'text!templates/home/shredsByTags.html'
], function($, _, Backbone, BootstrapModal,Session, 
		ShredCollection, ShredsView,
		AddShredView, ShredNewsView, shredPoolTemplate, faneesShredsTemplate,
		topShredsTemplate, mightKnowShredsTemplate, shredsByTagsTemplate){
	
	var ShredPoolView = Backbone.View.extend({
    
	el: '#page',
    shredsFromFaneesView : null,	
    
     
    render: function () {

    	var compiledTemplate = _.template(shredPoolTemplate, {});
		this.$el.html(compiledTemplate);
		
		var shredsFromFaneesView = new ShredsView({el:"#newShredsFromFanees", fetched : false}); 
		shredsFromFaneesView.setAttrs('NewShredsFromFanees', faneesShredsTemplate); 
		shredsFromFaneesView.render();
		
		var shredNewsView = new ShredNewsView({el: "#shredNews"});
		shredNewsView.render();
		
		var topShredsView = new ShredsView({collection: new ShredCollection(Session.getTopShreds()), 
			fetched : true,el:"#topShreds",collSetSize : 2, startCollIndex : 10 });
		
		topShredsView.setAttrs('TopShreds', topShredsTemplate);  
		topShredsView.render();
		 
		var mightKnowView = new ShredsView({el:"#mightKnowShreds", fetched : false, collSetSize : 3, startCollIndex : 7}); 
		mightKnowView.setAttrs('ShredsYouMightKnow', mightKnowShredsTemplate); 
		mightKnowView.render(); 
		 
		var byTagsView = new ShredsView({el:"#shredsByTags",fetched : false}); 
		byTagsView.setAttrs('ShredsByTags', shredsByTagsTemplate); 
		byTagsView.render();
    },
    
    events : {
    	"click #openAddShredModal" : "addShredModal"
    },
		
    addShredModal : function()  {
    	(require(['text!templates/home/addShredForm.html'], function(AddShredFormTemplate){
    		var addShredModal = new AddShredView();
        	addShredModal.setTemplate(AddShredFormTemplate);
    		addShredModal.render();
		}))();
    	   
	}
	
    
  });
  return ShredPoolView;
});