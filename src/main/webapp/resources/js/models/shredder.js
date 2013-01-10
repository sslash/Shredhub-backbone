define([ 'jquery', 'underscore', 'backbone'], function($, _, Backbone,
		Shredder) { 
  var Shredder = Backbone.Model.extend({
    urlRoot : 'shredders',
    
    defaults: {
    	username : "",
		fanees : new Array(),
		birthdate : null,
		country : null,
		profileImagePath : "",
		email : "",
		password : "",
		guitars : new Array(),
		equiptment : new Array(),
		description : "",
		timeCreated : null,
		shredderLevel : 0 // same as experience points
    },
    	
    getShreds: function() {
    	console.log("getting shreds");
    	var that = this;
    	var url = 'shreds/'; 
    	console.log("url: " + url);
    	
    	$.getJSON({
    		url: url, 
    		dataType: 'json',
    		success: function(res) {
    			console.log("res: " + res);
    			that.shreds = res;
    		}    		
    	});
    }
  });
  return Shredder;

});