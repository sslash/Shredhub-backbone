	// Used to copy-paste in stuff
define([
  'jquery',
  'underscore',
  'backbone', 
  'session',
  'bootstrapModal',
  'models/battleRequest',
  'text!templates/battle/challengeToBattleTemplate.html'
], function($, _, Backbone, Session, BootstrapModal, BattleRequest, challengeToBattleTemplate){
	
	var AddBattleView = Backbone.View.extend({
		
		el: "#challengeBattleModalDiv",
		modal: "#challengeToBattleModal",
		
		// battlee: model from shredderView		
		// model: 
			
		initialize: function () {
			_.bindAll(this);
			this.model = new BattleRequest({battler: Session.getUser()});
		},
		
		render : function() {
			var compiledTemplate = _.template(challengeToBattleTemplate, 
					{
						battlee: this.battlee
					});
			$(this.el).html(compiledTemplate);			
			$(this.modal).modal('show'); 
		},
		
		setBattlee : function(battleeObj) {
			this.battlee = battleeObj;
			this.model.set({battlee: this.battlee}); 
		},
		
		events : {
			"click form #addBattleShredButton" : "postForm" 
		}, 
		 
		
		postForm : function(event) {
			event.preventDefault(); 
			console.log("Will post battle!");
		    this.saveBattleAndStoreVideo($('#battleStyle').val()); 
			
		},
		
		saveBattleAndStoreVideo:function(battleStyle){
			var that = this;
			this.model.save(
					{battleStyle: battleStyle},
					{success: function(res) {
						console.log("SAP: " + JSON.stringify(res));
						var formData = new FormData(that.$('#addBattleRequestForm')[0]);
						that.uploadShredVideo(formData);
					}}
			); 
		},
		
		uploadShredVideo: function (formData) {
		    var that = this;  
			    $.ajax({
			        url: 'battleRequests/' + that.model.id, 
			        type: 'POST', // Should be put, but has to be POST due to spring 
			        xhr: function() {  // custom xhr
			            myXhr = $.ajaxSettings.xhr(); 
			            if(myXhr.upload){ // check if upload property exists
			                myXhr.upload.addEventListener('progress',that.progressHandlingFunction, false); // for handling the progress of the upload
			            } 
			            return myXhr;
			        },
			        //Ajax events
			        beforeSend: function(){},
			        success: function(res){
			        	console.log('done sending!'); 
			        	$(that.modal).modal('hide');  
			        },
			        error: function(res){
			        	console.log('error occured: ' + res);
			        },  
			        // Form data
			        data: formData, 
			        //Options to tell JQuery not to process data or worry about content-type
			        cache: false,
			        contentType: false,
			        processData: false
			    });
		    },
		    
		    progressHandlingFunction : function(e) {
		    	// console.log(e);
		    }
	});
	
  return AddBattleView;
});
