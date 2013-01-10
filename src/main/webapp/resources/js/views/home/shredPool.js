define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrapModal',
  
  // Views
  'views/home/shredsView', 
  'views/home/addShredView',
  'views/home/shredNewsView',
  
  // Templates
  'text!templates/home/shredPool.html',
  'text!templates/home/newShredsFromFanees.html',
  'text!templates/home/topShreds.html'
], function($, _, Backbone, BootstrapModal, ShredsView,
		AddShredView, ShredNewsView, shredPoolTemplate, faneesShredsTemplate,
		topShredsTemplate){
	
	var ShredPoolView = Backbone.View.extend({
    
	el: '#page',
    shredsFromFaneesView : null,	
    
     
    render: function () {

    	var compiledTemplate = _.template(shredPoolTemplate, {});
		this.$el.html(compiledTemplate);
		
		var shredsFromFaneesView = new ShredsView({el:"#newShredsFromFanees"}); 
		shredsFromFaneesView.setAttrs('NewShredsFromFanees', faneesShredsTemplate); 
		shredsFromFaneesView.render();
		
		var shredNewsView = new ShredNewsView({el: "#shredNews"});
		shredNewsView.render();
		
		var topShredsView = new ShredsView({el:"#topShreds"});
		topShredsView.setAttrs('TopShreds', topShredsTemplate);  
		topShredsView.render();
		 
		
		// Set shreds from shredders you might know
		(require(['text!templates/home/mightKnowShreds.html'], function(shredsTemplate){
			var topShredsView = new ShredsView({el:"#mightKnowShreds"}); 
			topShredsView.setAttrs('ShredsYouMightKnow', shredsTemplate); 
			topShredsView.render();
		}))(); 
		
		// Set shreds by tags
		(require(['text!templates/home/shredsByTags.html'], function(shredsTemplate){
			var topShredsView = new ShredsView({el:"#shredsByTags"}); 
			topShredsView.setAttrs('ShredsByTags', shredsTemplate); 
			topShredsView.render();
		}))();
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