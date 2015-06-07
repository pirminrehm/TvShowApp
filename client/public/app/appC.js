function Card() {
	this.name = 'Bob';
	this.phone = '1234567';
}

var app = angular.module("series", []);

app.controller("HomeController", function($scope, $http){
	$scope.message = "Hallo Codebitches";

	$scope.cards = [];

	$scope.addCard = function() {
		$scope.cards.push(new Card());
	};








		/**/
	/*
	$http.get("http://localhost:3000/series").success(function(response){
		$scope.series = response;
	}).error(function(err) {
		$scope.error = err;
	});
	*/
});

app.directive('myCard', function(){
	return {
		restrict: 'A',
		template: '<div>{{aCard.name}} {{aCard.phone}}</div>',
		replace: true,
		transclude: false,
		scope: {
			aCard: '=myCard'
		}
	};
});

