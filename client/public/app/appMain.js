
var app = angular.module("tvshowapp", []);

app.controller("HomeController", function($scope, $http){
	$scope.message = "Hallo Codebitches";

	$scope.cards = [];

	$scope.addSeries = function() {
		//var arr = JSON.parse(jsonData);

		//alert(object.series[0]._id);

		for(var i = 0; i < object.series.length; i++) {
			var episodeAllCount = 0;
			var eipsodeWatchedCount = 0;
			var curEpisodeName = "";
			for(var j = 0; j < object.series[i].episodes.length; j++) {
				episodeAllCount++;
				if(object.series[i].episodes[j].watched){
					eipsodeWatchedCount++;
					curEpisodeName = object.series[i].episodes[j].id;
				}
			}

			$scope.cards.push(new Series(object.series[i].name, episodeAllCount, eipsodeWatchedCount, curEpisodeName));

		}
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
		templateUrl: '/app/templates/seriesMain.html',
		replace: true,
		transclude: false,
		scope: {
			aCard: '=myCard'
		}


	};
});