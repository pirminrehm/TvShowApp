var app = angular.module('tvshowapp');

app.controller('WelcomeController', ['$scope','$location','AuthenticationService', function($scope,$location,AuthenticationService){

$scope.email = "";

	$scope.newList = function(){
		console.log({"email" : $scope.email});
		if ($scope.email) {
			AuthenticationService.newList({"email" : $scope.email})
				.then(function (res){
					$scope.msg = "you have mail";
					alert("mail");
					$location.url("/mail");
				}, function (err){
					$scope.err = err;
					console.log('err',err);
				});
		} else {
			$scope.err = {};
			$scope.err.error ="This wasn't an email adress"; 
		}
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