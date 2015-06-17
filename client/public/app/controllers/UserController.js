var app = angular.module('tvshowapp');

app.controller('UserController', ['$scope','$routeParams','SearchService', function($scope,$routeParams,SearchService){
	
	$scope.cards = [];
	$scope.searchResults = [];

	var token = $routeParams.token;

	console.log("in UserController");


	$scope.search = function(){
		
		


		if($('#search_bar').hasClass('active')){
			// alert("in search");
			console.log('searchString', $scope.searchString);

			SearchService.searchNewSeries(token,$scope.searchString)
				.then(function (res){
				$scope.addSearchSeries(res);
					//console.log('res', res);
				}, function (err){
					$scope.err = err;
				});



		}
		else{
			$('#search_button .glyphicon').removeClass('glyphicon-plus');
			$('#search_button .glyphicon').addClass('glyphicon-search');
			$('#search_bar').addClass('active');
			$('#search_button').css('border-top-left-radius', '0px');
			$('#search_button').css('border-bottom-left-radius', '0px');
		}




	};
	
	$scope.addSearchSeries = function(seriesArray) {
		console.log("arr", seriesArray);
		//var arr = JSON.parse(jsonData);



		for(var i = 0; i < seriesArray.Series.length; i++) {
			$scope.searchResults.push(new SearchResult(seriesArray.Series[i].id, seriesArray.Series[i].SeriesName));

		}
	};

	
	
	$scope.addSeriesToMyList = function(seriesId) {
		console.log("addSeries", seriesId);
		//var arr = JSON.parse(jsonData);
		
		
		"http://localhost:3000/usr/token/79c25df0ec4bf2d92872a299c299685f426a3602/series/" + seriesId
		
		

		seriesArray = exampleSeriesArray;

		for(var i = 0; i < seriesArray.series.length; i++) {
			var episodeAllCount = 0;
			var eipsodeWatchedCount = 0;
			var curEpisodeName = "";
			for(var j = 0; j < seriesArray.series[i].episodes.length; j++) {
				episodeAllCount++;
				if(seriesArray.series[i].episodes[j].watched){
					eipsodeWatchedCount++;
					curEpisodeName = seriesArray.series[i].episodes[j].id;
				}
			}

			$scope.cards.push(new Series(seriesArray.series[i]._id, seriesArray.series[i].name, episodeAllCount, eipsodeWatchedCount, curEpisodeName));

		}
	};
	
	
	$scope.addAllSeries = function(seriesArray) {
		console.log("addSeries", seriesArray);
		//var arr = JSON.parse(jsonData);

seriesArray = exampleSeriesArray;

		for(var i = 0; i < seriesArray.series.length; i++) {
			var episodeAllCount = 0;
			var eipsodeWatchedCount = 0;
			var curEpisodeName = "";
			for(var j = 0; j < seriesArray.series[i].episodes.length; j++) {
				episodeAllCount++;
				if(seriesArray.series[i].episodes[j].watched){
					eipsodeWatchedCount++;
					curEpisodeName = seriesArray.series[i].episodes[j].id;
				}
			}

			$scope.cards.push(new Series(seriesArray.series[i]._id, seriesArray.series[i].name, episodeAllCount, eipsodeWatchedCount, curEpisodeName));

		}
	};
	
	$scope.progressBarUpdate = function(id, incrementAmount){
		console.log(incrementAmount);
		
		
	
		//alert(incrementAmount);
	var progressBar = $("#" + id).find('.progress-bar');
	console.log(progressBar);
	//get number of episodes in current season
	//var nrTotal = ...
	//get new current percentage
	//var curPerc = curEpisode / nrTotal;
	var newPerc = parseFloat($(progressBar).attr("aria-valuenow")) + incrementAmount;
	console.log(newPerc);
	//console.log(newPerc);
	if(newPerc >= 100){
		//progressBarFull(id);
		newPerc = 100;
		$(progressBar).removeClass('progress-bar-warning').addClass('progress-bar-success');
		
		$("#" + id).find('.label').removeClass('label-warning').addClass('label-success');
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