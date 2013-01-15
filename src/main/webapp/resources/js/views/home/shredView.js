define([ 'jquery',
         'underscore',
         'backbone',
         'bootstrapModal',
         'video',
         'session',
         'text!templates/home/videoView.html',
         'text!templates/home/videoDetailsTemplate.html'], 
		function($, _, Backbone, BootstrapModal, Video, Session, VideoViewTemplate,
				VideoDetailsTemplate) {

	var ShredView = Backbone.View.extend({
		
		// modalHidden: true, 
		// model : Shred 
		videoDetailsTmpl: ".videoDetailsTmpl",
		initialize : function() {
		 	this.model.on('change', this.renderTemplate, this);		 	
		}, 
		
		render : function() {			
			console.log("render in shredview");
			var template = _.template(VideoViewTemplate, {
				"shred" : this.model
			});
			$(this.el).html(template); 
			this.renderTemplate();
			
			// TODO: Update the individual fields instead (use append)
			$('#playVideoModal').modal('show'); 
			return this;
		},
		
		renderTemplate : function() {
			var template = _.template(VideoDetailsTemplate, {
				"shred" : this.model
			});
			$(this.videoDetailsTmpl).html(template); 
		},
		
		events: {
			"click #commentButton" : "saveComment",
			"click #rateButton" : "rateShred",
			"click td .close" : "deleteComment",
		},
		
		deleteComment : function(event) {
			var commentIndex = event.currentTarget.id.split("-")[1];
			this.model.deleteComment(commentIndex);
		},

		rateShred : function(event) {
			event.preventDefault();
			var rateVal = $('input[type=range]').val();
			this.model.addRating(rateVal);
		},
		
		saveComment : function(event) {
			event.preventDefault();
			this.model.addComment($('#commentText').val(), Session.getUser());
		}
	});
 
	return ShredView;

});