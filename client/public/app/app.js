var app = angular.module('tvshowapp', ["ngRoute"]);

var config = {
	"restUrl" : "http://localhost:3000"
};


app.config(function($routeProvider) {
	$routeProvider
		.when("/welcome", {
			templateUrl: "/app/templates/welcome.html",
			controller: "WelcomeController"
		})
		.when("/user/:token", {
			templateUrl: "/app/templates/user.html",
			controller: "UserController"
		})
		.when("/mail", {
			templateUrl: "/app/templates/mail.html",
			controller: "MailController"
		})
		.when("/verify/:token", {
			templateUrl: "/app/templates/verify.html",
			controller: "VerifyController"
		})
		.otherwise({redirectTo: '/welcome'});
});