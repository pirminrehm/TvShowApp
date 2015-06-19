var app = angular.module('tvshowapp');

app.controller('UserController', ['$scope','$routeParams','SearchService','UserService', function($scope,$routeParams,SearchService,UserService){
	
	$scope.cards = [];
	$scope.searchResults = [];

	var token = $routeParams.token;


	UserService.getUser(token)
		.then(function (res){
			for(var i=0; i<res.series.length; i++){
				createNewSeries(res.series[i]);
			}
		}, function (err){
			$scope.err = err;
		});


	$scope.search = function(){

		if($('#search_bar').hasClass('active') &&  typeof $scope.searchString !== 'undefined' && $scope.searchString != ""){
			
			console.log('searchString', $scope.searchString);
			
			SearchService.searchNewSeries(token,$scope.searchString)
				.then(function (res){
					
					//console.log('searchString Final', $scope.searchString);
					console.log('res in $scope.search', res);
					
					$scope.searchResults = [];
					if(Array.isArray(res.Series)){
						$scope.searchResults = res.Series;
					}
					else if(res.Series){
						$scope.searchResults[0] = res.Series;
					}
					else{
						$scope.searchResults = [];
						console.log('no search result');
						alert('No search results');
					}
				}, function (err){
					$scope.err = err;
				});
		} else {
			$('#search_button .glyphicon').removeClass('glyphicon-plus');
			$('#search_button .glyphicon').addClass('glyphicon-search');
			$('#search_bar').addClass('active');
			$('#search_button').css('border-top-left-radius', '0px');
			$('#search_button').css('border-bottom-left-radius', '0px');
		}
	};
	
	
	$scope.addSeriesToMyList = function(seriesId) {
		
		UserService.addSeriesToList(token, seriesId)
			.then(function (res){
				createNewSeries(res);
			}, function (err){
				$scope.err = err;
			});	
	};


	function createNewSeries(series){
	
	console.log('series in createNewSeries', series);
		
		var episodeAllCount = 0;
		var eipsodeWatchedCount = 0;
		var curEpisodeName = "";
		for(var j = 0; j < series.episodes.length; j++) {
			episodeAllCount++;
			if(series.episodes[j].watched){
				eipsodeWatchedCount++;
				curEpisodeName = series.episodes[j].id;
			}
		}
		$scope.cards.push(new Series(series.id, series.name, series.bannerUrl,episodeAllCount, eipsodeWatchedCount, curEpisodeName));
	}
	
	
// $scope.addSearchSeries = function(seriesArray) {
// 	console.log("seriesArray in addSearchSeries", seriesArray);
// 	for(var i = 0; i < seriesArray.Series.length; i++) {
// 		$scope.searchResults.push(new SearchResult(seriesArray.Series[i].id, seriesArray.Series[i].SeriesName));

// 	}
// };


	// function addUserDataToMainList(user){
	// 	for(var i = 0; i < user.series.length; i++) {
	// 		var episodeAllCount = 0;
	// 		var eipsodeWatchedCount = 0;
	// 		var curEpisodeName = "";
	// 		for(var j = 0; j < user.series[i].episodes.length; j++) {
	// 			episodeAllCount++;
	// 			if(user.series[i].episodes[j].watched){
	// 				eipsodeWatchedCount++;
	// 				curEpisodeName = user.series[i].episodes[j].id;
	// 			}
	// 		}

	// 		$scope.cards.push(new Series(user.series[i].id, user.series[i].name, episodeAllCount, eipsodeWatchedCount, curEpisodeName));

	// 	}
	// }


	// function addSeriesToMainList(user){
	// 	for(var i = 0; i < user.series.length; i++) {
	// 		var episodeAllCount = 0;
	// 		var eipsodeWatchedCount = 0;
	// 		var curEpisodeName = "";
	// 		for(var j = 0; j < user.series[i].episodes.length; j++) {
	// 			episodeAllCount++;
	// 			if(user.series[i].episodes[j].watched){
	// 				eipsodeWatchedCount++;
	// 				curEpisodeName = user.series[i].episodes[j].id;
	// 			}
	// 		}

	// 		$scope.cards.push(new Series(user.series[i].id, user.series[i].name, episodeAllCount, eipsodeWatchedCount, curEpisodeName));

	// 	}
	// }

	
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