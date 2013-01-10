//Used to copy-paste in stuff
define([ 'jquery', 'underscore', 'backbone', 'models/battleRequest' ], function($, _,
		Backbone, BattleRequest) {

	var BattleRequestCollection = Backbone.Collection.extend({

		model : BattleRequest,
		
		shredderId : 0,

		url : function() {
			return "battleRequests/shredder/" + this.shredderId;
		}, 
		
		setShredderId : function(id) {
			this.shredderId = id;
		}
	});

	return BattleRequestCollection;
});