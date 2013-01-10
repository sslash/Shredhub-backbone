(function($){

var uploadDefaults = {
  progress: $.noop,
  load:     $.noop,
  method:   "POST"
};

$.upload = function(file, options){
  options = $.extend( {}, uploadDefaults, options);
  this.f = file;
  var that = this;
  $.ajax({
    url: options.url,
    type: options.method,
    success: options.success,
    processData: false,
    contentType: "multipart/form-data",
    
    beforeSend: function(xhr){
     // var upload = xhr.upload;
      //upload.addEventListener("progress", options.progress, false);
      //upload.addEventListener("load", options.load, false);
      
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.setRequestHeader("X-File-Name", this.data.name);
      xhr.setRequestHeader("X-File-Size", this.data.size);
    }, 
    
    data: file
  });
};

})(jQuery);