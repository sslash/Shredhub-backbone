define([
  'jquery',
  'underscore',
  'backbone',
  'models/shredder'
], function($, _, Backbone, ShredderModel){

  var ShredderCollection = Backbone.Collection.extend({
    model: ShredderModel,
    page: 1,    
    query: "",    
    id: "",
    
    url: function() {
    	return "shredders/?q=" + this.query +"&page=" + this.page + "&id=" + this.id;
    },
    
    setUrl : function(url) {
    	this.url = url;
    }
    
  });
  
  
 
  return ShredderCollection;
});