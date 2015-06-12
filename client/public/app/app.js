var app = angular.module('tvshowapp', ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider
		.when("/welcome", {
			templateUrl: "/app/templates/testWelcome.html",
			controller: "TestWelcomeController"
		})
		.when("/user/:token", {
			templateUrl: "/app/templates/user.html",
			controller: "UserController"
		})
		.otherwise({redirectTo: '/welcome'});
		

});