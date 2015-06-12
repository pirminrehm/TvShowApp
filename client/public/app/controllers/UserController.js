var app = angular.module('tvshowapp');

app.controller('UserController', ['$scope','$routeParams', function($scope,$routeParams){
	
	$scope.cards = [];

	console.log("in UserController");

	$scope.addSeries = function() {
		console.log("test1");
		//var arr = JSON.parse(jsonData);

		alert(object.series[0]._id);

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

			$scope.cards.push(new Series(object.series[i]._id, object.series[i].name, episodeAllCount, eipsodeWatchedCount, curEpisodeName));

		}
	};
	
	$scope.progressBarUpdate = function(id, incrementAmount){
		//console.log(incrementAmount);
		console.log(id);
		
	
		//alert(incrementAmount);
	var progressBar = $("#" + id).find('.progress-bar');
	console.log(progressBar);
	//get number of episodes in current season
	//var nrTotal = ...
	//get new current percentage
	//var curPerc = curEpisode / nrTotal;
	var newPerc = parseInt($(progressBar).attr("aria-valuenow")) + incrementAmount;
	//console.log(newPerc);
	if(newPerc >= 100){
		//progressBarFull(id);
		newPerc = 100;
		$(progressBar).removeClass('progress-bar-warning').addClass('progress-bar-success');
		$(id).removeClass('label-warning').addClass('label-success');
		$(id).html('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
	}
	$(progressBar).attr("aria-valuenow", newPerc);
	$(progressBar).css({width: newPerc + "%"});
	};
	
		/**/
	/*
	$http.get("http://localhost:3000/series").success(function(response){
		$scope.series = response;
	}).error(function(err) {
		$scope.error = err;
	});
	*/
}]);