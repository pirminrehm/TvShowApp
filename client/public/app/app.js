var app = angular.module( 'tvshowapp', [ "ngRoute", "angular.filter", "ui.bootstrap", "ngAnimate" ] );

var config = {
	restUrl: "http://" + window.location.hostname + ":3000"
};

app.config( [ "$routeProvider", function( $routeProvider ) {
	$routeProvider
		.when( "/welcome", {
			templateUrl: "/app/templates/welcome.html",
			controller: "WelcomeController"
		} )
		.when( "/user/:token", {
			templateUrl: "/app/templates/user.html",
			controller: "UserController"
		} )
		.when( "/mail", {
			templateUrl: "/app/templates/mail.html",
			controller: "MailController"
		} )
		.when( "/verify/:token", {
			templateUrl: "/app/templates/verify.html",
			controller: "VerifyController"
		} )
		.when( "/details/:token/:seriesId", {
			templateUrl: "/app/templates/detail.html",
			controller: "DetailController"
		} )
		.otherwise( { redirectTo: '/welcome' } );
} ] );

app.run( [ function() {
	notification.addProfile( 'info-mail', {
    	notification: {
	        position: [ 'middle', 'top' ],
	        distances: [ 20, 70, 10 ],
	        color: '#2574A9'
	    },
		behaviour: {
	    	autoHide: true,
	        htmlMode: true
	    }
	} );
} ] );
