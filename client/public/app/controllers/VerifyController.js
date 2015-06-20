var app = angular.module('tvshowapp');

app.controller('VerifyController', ['$scope','$routeParams','$location','AuthenticationService', function($scope,$routeParams,$location,AuthenticationService){
	
	var token = $routeParams.token;
	
	AuthenticationService.verify(token)
		.then(function (res) {
			$location.url("/user/" + token);
		}, function (err){
			$scope.err = err;
		});

}]);