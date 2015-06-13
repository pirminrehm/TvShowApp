var app = angular.module('tvshowapp');

app.controller('WelcomeController', ['$scope','$location','AuthenticationService', function($scope,$location,AuthenticationService){
	$scope.msg = "Hello world";

	$scope.property = {email: "example@mail.com"};

	$scope.testWelcome = function(){
		$scope.msg = "Hi";
	};


	$scope.newList = function(){
		AuthenticationService.newList($scope.property)
			.then(function (res){
				$scope.msg = "you have mail";
				alert("mail");
				$location.url("/mail");
			}, function (err){
				$scope.err = err;
				console.log('err',err);
			});
	};


	$scope.getList = function(){
		AuthenticationService.getList($scope.property)
			.then(function (res){
				$location.url("/mail");
			}, function (err){
				$scope.err = err;
				console.log('err',err);			
			});
	};
}]);