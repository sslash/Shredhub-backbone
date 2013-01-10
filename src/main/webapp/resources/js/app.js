// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router', // Request router.js
  //'vm',
  'events',
  'command',
  'session'
], function($, _, Backbone, Router, /*Vm,*/ Events, Command, Session){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    Router.initialize();
  };

  return { 
    initialize: initialize
  };
});