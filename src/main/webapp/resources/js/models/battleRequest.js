define([ 'jquery', 'underscore', 'backbone'],
		function($, _, Backbone) { 
	
  var BattleRequest = Backbone.Model.extend({
    urlRoot : 'battleRequests',
    defaults: {
    	battler: {},
    	battlee: {}, 
    	battleStyle: '',
    	videoPath: '',
    	videoThumbnail: '',
    	timeCreated: new Date()    	
    },     
  });
  return BattleRequest;

});