	// Used to copy-paste in stuff
define([
], function(){
	
	
	// TODO: Create a singleton implementation of session
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
		
		Session.setUser = function(user) {
			var jsonUser = JSON.stringify(user);
			sessionStorage.setItem("user", jsonUser);
		};

  return Session; 
});