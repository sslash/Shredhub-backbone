/**
 * Creates the list of shred news.
 * Each list gets more news then necessary (20).
 * But I don't feel the need to create specialized 
 * API calls for shred news on the server.
 */
define([ 'jquery', 'underscore', 'backbone', 'bootstrapModal', 'session',
		'collections/shredCollection', 'collections/battlesCollection',
		'collections/shredderCollection',
		'text!templates/home/shredNewsTemplate.html',
		'text!templates/home/shredFromFaneesNewsTemplate.html',
		'text!templates/home/battleWithFaneesNewsTemplate.html',
		'text!templates/home/shreddersYouMightLikeTemplate.html',
		'text!templates/home/newsItemLatestBattleShredsTemplate.html'],
		function($,
		_, Backbone, BootstrapModal, Session, ShredCollection,
		BattlesCollection, ShredderCollection, ShredNewsTemplate, ShredFromFaneesNewsTemplate,
		BattleWithFaneesTemplate,ShreddersYouMightLikeTemplate, BattleShredsNewsTemplate) {

	var ShredsView = Backbone.View.extend({
 
		page : 1,

		newShredFromFaneeNewsItem : "#newShredFromFaneeNewsItem",
		newBattlesFromFanees : "#newBattlesFromFanees",
		shreddersYouMightLike : "#shreddersYouMightLike",
		latesBattleShreds : "#latesBattleShreds",
		

		initialize : function() {
			_.bindAll(this);

		},

		render : function() {
			var template = _.template(ShredNewsTemplate, {});
			$(this.el).html(template);

			this.getNewestShredsFromFanees();
			this.getNewestBattlesFromFanees();
			this.getShreddersYouMightKnow();
			this.getNewBattleShredsFromFanees();
		},

		// TODO: Create the modal thing
		getNewestShredsFromFanees : function() {
			this.newestShreds = new ShredCollection();
			var that = this;
			this.newestShreds.initURL({
				page : 1,
				query : "NewShredsFromFanees",
				id : Session.getUser().id
			});

						
			this.newestShreds.fetch({
				success : function(res) {
					var shreds = _.first(that.newestShreds.models, 5);
					this.template = _.template(ShredFromFaneesNewsTemplate, {
						shreds : shreds
					});
					$(that.newShredFromFaneeNewsItem).append(this.template);
				}
			});
		},

		getNewestBattlesFromFanees : function() {
			this.newestBattles = new BattlesCollection();
			var url = "battles/?action=fromFanees&page=1&shredderId="
					+ Session.getUser().id;
			this.newestBattles.setUrl(url);
			var that = this;
			this.newestBattles.fetch({
				success : function() { 
					var battles = _.first(that.newestBattles.models, 3); 
					var template = _.template(BattleWithFaneesTemplate, {battles:battles}); 
					$(that.newBattlesFromFanees).html(template);
				}
			});
		},
		
		getShreddersYouMightKnow : function() {
			this.mightLikeShredders = new ShredderCollection(); 
			var url = "shredders/?action=mightKnowShredders&id=" + Session.getUser().id
			+ "&resultNum=5";
			this.mightLikeShredders.setUrl(url);
			var that = this;
			
			this.mightLikeShredders.fetch({
				success : function() {
					var shredders = _.first(that.mightLikeShredders.models, 5); 
					var template = _.template(ShreddersYouMightLikeTemplate, {shredders:shredders}); 
					$(that.shreddersYouMightLike).html(template);
				}
			});
		},
		
		getNewBattleShredsFromFanees : function() {
			//Option 1:
			// Get all the battles from fanees
			// DO filtering on the client to find the newest battleshreds
			
			//Option 2:
			// On the server: get all battles, filter out the newest ones
			
			// Option 3:
			// For every battle shred, add a new entry in a "battleshredhistory" collection:
			// {battleid, shredderid, battler/battlee}. Override the entry each time a battleshred is created
			
			// I pick solution 2... But I add a timevalue just for the sake of this operation.
			// each time a battleshred is added, the timevalue is updated
			this.battlesFromFanees = new BattlesCollection();
			var url = "battles/?action=withLatestBattleShredsFromFanees&id=" + Session.getUser().id;
			this.battlesFromFanees.setUrl(url);
			var that = this;
			this.battlesFromFanees.fetch({
				success : function(){
					var battles = _.first(that.battlesFromFanees.models, 5); 
					var template = _.template(BattleShredsNewsTemplate, {battles:battles}); 
					$(that.latesBattleShreds).html(template);
				}
			})
			
		}
	});
	return ShredsView;
});
