var app = angular.module("series", []);

app.controller("HomeController", function($scope, $http){
	$scope.message = "Hallo Codebitches";

	$http.get("http://localhost:3000/series").success(function(response){
		$scope.series = response;
	}).error(function(err) {
		$scope.error = err;
	});
});