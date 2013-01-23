	// Used to copy-paste in stuff
define([
], function(){
	
	var Session =  function() {		
	};
		
		Session.getUser = function() {
			var user = sessionStorage.getItem("user");
			if ( user ) {
				return JSON.parse(user);
			} else {
				return null;
			}
		};
		
		Session.getTopShreds = function() {
			return JSON.parse(sessionStorage.getItem("topShreds"));
		};
		
		Session.setTopShreds = function(topShreds) {
			sessionStorage.setItem("topShreds", topShreds);
		};
		
		Session.setUser = function(user) {
			var jsonUser = JSON.stringify(user);
			sessionStorage.setItem("user", jsonUser);
		};

  return Session; 
});