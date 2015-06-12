var app = angular.module('tvshowapp', ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider
		.when("/welcome", {
			templateUrl: "/app/templates/testWelcome.html",
			controller: "TestWelcomeController"
		})		
		.otherwise({redirectTo: '/welcome'});
		

});