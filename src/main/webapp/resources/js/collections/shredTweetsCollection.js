define([
  'jquery',
  'underscore',
  'backbone',
  'models/shred',
  'backboneLocalStorage'
], function($, _, Backbone, ShredModel, LocalStorage){
	
  var ShredTweetsCollection = Backbone.Collection.extend({
    model: ShredModel,
    
    localStorage: new Store("shred-list"),
    
    initialize: function(){
    }
  });
 
  return ShredTweetsCollection;
});