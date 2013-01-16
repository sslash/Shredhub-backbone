define([
  'jquery',
  'underscore',
  'backbone',
  'models/shred',
], function($, _, Backbone, ShredModel){
	
  var NewShredsFromFaneesCollection = Backbone.Collection.extend({
    model: ShredModel,
    
    url: function() {
    	return "shreds/?q=" + this.query +"&page=" + this.page + "&id=" + this.id;
    },
    
    page : 1,
    
    query: "",
     
    initURL: function(attr){
    	if ( attr['page'] ) this.page = attr['page'];
    	if ( attr['query'] ) this.query = attr['query'];
    	if ( attr['id'] ) this.id = attr['id'];
    },
    
    advancePage : function(){
    	this.page ++;
    },
    
    setQuery : function(q) {
    	this.query = q;
    },
    
    setUrl : function(newUrl) {
    	this.url = newUrl;
    }
    
  });
 
  return NewShredsFromFaneesCollection;
});