//TODO: add this to the shred uploading function
define([ 'jquery' ], function($) {

	var UploadVideo = function() {}

	UploadVideo.upload = function(options) {
			var that = this;
			$.ajax({
				url : options.url,
				type : 'POST',
				xhr : function() { // custom xhr
					myXhr = $.ajaxSettings.xhr();
					if (myXhr.upload) { // check if upload property
						// exists
						myXhr.upload.addEventListener('progress',
								that.progressHandlingFunction, false);
					}
					return myXhr;
				},
				// Ajax events
				beforeSend : function() { 
				},
				success : function(res) {
					options.callback.call(options.context, res);
				},
				error : function(res) {
					console.log('error occured: ' + res);

				},
				// Form data
				data : options.data,
				// Options to tell JQuery not to process data or
				// worry about content-type
				cache : false,
				contentType : false,
				processData : false
			});
		};
		
		UploadVideo.progressHandlingFunction = function(e) {
			if (e.lengthComputable) {
				$('progress').attr({
					value : e.loaded,
					max : e.total
				});
			}
		}; 
	return UploadVideo;
});
