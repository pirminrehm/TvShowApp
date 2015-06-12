var app = angular.module('tvshowapp');

app.controller('TestWelcomeController', ['$scope', function($scope){
	$scope.msg = "Hello world";

	$scope.testWelcome = function(){
		$scope.msg = "Hi"
	};
}]);