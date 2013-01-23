define([ 'jquery', 'underscore', 'backbone', 'bootstrapModal', 'session',
		'models/shred' ], function($, _, Backbone, BootstrapModal, Session,
		Shred) {

	var AddShredView = Backbone.View.extend({
		el : "#addShredModalDiv",

		initialize : function() {
			this.model = new Shred();
		},

		setTemplate : function(Template) {
			this.AddShredFormTemplate = Template;
		},

		render : function() {
			var compiledTmpl = _.template(this.AddShredFormTemplate, {});
			$(this.el).html(compiledTmpl);
			$("#addShredModal").modal('show');
		},

		events : {
			"click form #uploadButton" : "postForm"
		},

		progressHandlingFunction : function(e) {
			if (e.lengthComputable) {
				$('progress').attr({
					value : e.loaded,
					max : e.total
				});
			}
		},

		postNewShred : function() {
			var shredder = Session.getUser();
			var that = this;
			console.log("WILL POST!");
			//var video = new FormData( $('#addShredForm')[0] );
			//this.postVideo(video);
			
			
			
			var tags = $('#inputTags').val();
			var tagsArr = tags.split(/,\s*/g);
			var video = new FormData( $('#addShredForm')[0] ); 

			// save the shed
			this.model.save({
				description : $('#inputDescription').val(),
				owner : shredder,
				timeCreated : new Date(),
				videoPath : "",
				videoThumbnail : "",
				shredComments : new Array(),
				tags : tagsArr,
				shredRating : {
					numberOfRaters : 0,
					currentRating : 0
				},
				shredType : 'normal'
			}, {
				success : function() {
					console.log("Save shred success. will save video");
					that.postVideo(video);
				} 
			});
		},

		postForm : function(event) {
			event.preventDefault();
			this.postNewShred();
		},

		postVideo : function(video) {
			var that = this;
	/*		$.ajax({
				url : '/thumbnailCreator/create',
				type : 'POST',
				// Form data
				data : video,
				xhr : function() { // custom xhr
					myXhr = $.ajaxSettings.xhr();
					if (myXhr.upload) { // check if upload property exists
						myXhr.upload.addEventListener('progress',
								that.progressHandlingFunction, false); // for handling the progress of the upload
					}
					return myXhr;
				},
				//Ajax events
				beforeSend : function() {
				},
				success : function(res) {
					console.log('done sending!');
					
					$.ajax({
						url : '/thumbnailCreator/save',
						type : 'POST',
						contentType: 'multipart/form-data',
						// Form data
						data : res,
						xhr : function() { // custom xhr
							myXhr = $.ajaxSettings.xhr();
							if (myXhr.upload) { // check if upload property exists
								myXhr.upload.addEventListener('progress',
										that.progressHandlingFunction, false); // for handling the progress of the upload
							}
							return myXhr;
						},
						//Ajax events
						beforeSend : function() {
						},
						success : function(res) {
							console.log('DONE SAVEING BITCHES!' + res);
							that.$("#addShredModal").modal('hide');
							window.app_router.navigate("#shredPool");
						},
						error : function(res) {
							console.log('error occured: ' + res);
						},
						//Options to tell JQuery not to process data or worry about content-type
						cache : false,
						contentType : false,
						processData : false
					});
					
					
					that.$("#addShredModal").modal('hide');
					window.app_router.navigate("#shredPool");
				},
				error : function(res) {
					console.log('error occured: ' + res);
				},
				//Options to tell JQuery not to process data or worry about content-type
				cache : false,
				contentType : false,
				processData : false
			});*/
			

			$.ajax({
				url : 'shreds/' + this.model.id, //server script to process data
				type : 'POST',
				// Form data
				data : video,
				xhr : function() { // custom xhr
					myXhr = $.ajaxSettings.xhr();
					if (myXhr.upload) { // check if upload property exists
						myXhr.upload.addEventListener('progress',
								that.progressHandlingFunction, false); // for handling the progress of the upload
					}
					return myXhr;
				},
				//Ajax events
				beforeSend : function() {
				},
				success : function(res) {
					console.log('done sending!');
					that.$("#addShredModal").modal('hide');
					window.app_router.navigate("#shredPool");
				},
				error : function(res) {
					console.log('error occured: ' + res);
				},
				//Options to tell JQuery not to process data or worry about content-type
				cache : false,
				contentType : false,
				processData : false
			});
		},
		onProgress : function() {

		},

		beforeSendHandler : function() {

		},

		completeHandler : function() {

		},

		errorHandler : function() {

		},

	});

	return AddShredView;
});