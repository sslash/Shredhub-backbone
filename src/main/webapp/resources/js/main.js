// Author: Michael Gunnulfsen
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
	// These are path alias that we configured in our bootstrap
    jquery: 'libs/jquery/jquery',
    underscore: 'libs/underscore/underscore', 
    backbone: 'libs/backbone/backbone',
    templates: '../templates',
    bootstrap: 'libs/bootstrap/bootstrap-min', 
    bootstrapModal: 'libs/bootstrap/bootstrap-modal',
    bootstrapDropdown: 'libs/bootstrap/bootstrap-dropdown',
    backboneLocalStorage: 'libs/backbone/backbone-localstorage',
    bootstrapCarousel:'libs/bootstrap/bootstrap-carousel',
    command:'controller/command',
   /* video: 'libs/video/video',*/
    video: 'http://vjs.zencdn.net/c/video',
    session: 'session',
    uploadVideo:'utils/uploadVideo',
    command: 'controller/command'
  }
 
});
 
require([
  // Load our app module and pass it to our definition function
  'app',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize(); 
}); 

