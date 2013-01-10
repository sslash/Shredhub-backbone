define([ 'jquery', 'underscore', 'backbone', 'models/battle' ], function($, _,
		Backbone, BattleModel) {

	var BattlesCollection = Backbone.Collection.extend({

		model : BattleModel,

		url : function() {
			return "battles/?action=search&page=" + this.page;
		},

		initialize : function() {
			this.page = 1;
		},
		
		setUrl : function(url) {
			this.url = url;
		}
	});

	return BattlesCollection;
});
