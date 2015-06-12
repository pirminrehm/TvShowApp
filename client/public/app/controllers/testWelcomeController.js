var app = angular.module('tvshowapp');

app.controller('TestWelcomeController', ['$scope','WelcomeService', function($scope,WelcomeService){
	$scope.msg = "Hello world";

	$scope.property = {email: "y"};

	$scope.testWelcome = function(){
		$scope.msg = "Hi";
	};

	$scope.newList = function(){
		WelcomeService.newList($scope.property)
			.then(function (res){
				$scope.msg = "you have mail";
				alert("mail");
			}, function (err){
				$scope.err = err;
			});

	};

	$scope.getList = function(){

	};
}]);