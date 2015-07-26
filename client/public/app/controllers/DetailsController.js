var app = angular.module('tvshowapp');

app.controller('DetailController', ['$sce', '$scope','$location','SeriesService','$routeParams','UserService', function($sce, $scope,$location, SeriesService, $routeParams, UserService){

	var token = $routeParams.token;
	var seriesId = $routeParams.seriesId;
	var userSeries;

	

	function enhanceSeries(series){
		var progressBarString = "";
		var lastEpisodeSeasonNr = series.episodes[0].sNr;
		series.episodeWidth = "width: " + 100.4/series.episodes.length + "%;";
		
		series.episodeAllCount = series.episodes.length;
		series.eipsodeWatchedCount = 0;
		series.curEpisodeName = "";
		series.incrementAmount = (1/series.episodeAllCount) * 100 + 0.0000000001;
		series.allWatched = false;

		for(var j = 0; j < series.episodes.length; j++) {
		
			//watchedPercentage
			if(series.episodes[j].w){
				series.eipsodeWatchedCount++;
			} else if(series.curEpisodeName === ""){
				series.curEpisodeName = series.episodes[j].n;
				series.curEpisodeNr = series.episodes[j].eNr;
				series.curSeasonNr = series.episodes[j].sNr;
			}
			if(j == series.episodes.length - 1 && series.curEpisodeName === ""){
				series.curEpisodeName = allEpisodesWatched;
				series.curEpisodeNr = series.episodes[j].eNr;
				series.curSeasonNr = series.episodes[j].sNr;
				series.allWatched = true;
			}
			
			
			
			var progressBarStatus = series.episodes[j].w ? " watched" : "";
			var seasonEndBorderStyle = "";
			if(lastEpisodeSeasonNr != series.episodes[j].sNr){
				seasonEndBorderStyle = " border-left: 1px solid #666";
			}
			lastEpisodeSeasonNr = series.episodes[j].sNr;
			progressBarString += "<div class='epi" + progressBarStatus + "' style='width: " + 100/series.episodes.length + "%;" + seasonEndBorderStyle + "'></div>";

		}

		series.progressBar = $sce.trustAsHtml(progressBarString);
		return series;
	}


	UserService.getUser(token)
		.then(function (res){
			for(var i=0; i<res.series.length; i++){
				if (res.series[i].id == seriesId) {
					userSeries = res.series[i];
				}
			}
			if (userSeries) {
				enhanceSeries(userSeries);
				$scope.userSeries = userSeries;
			}else {
				$scope.err
			}
		}, function (err){
			$scope.err = err;
	});


	SeriesService.getSeriesDetails(token,seriesId)
		.then(function (res){
			$scope.seriesDetails = res;
		}, function (err){
			$scope.err = err;
			console.log('err',err);			
	});
	

	$scope.progressBarUpdate = function(card){
				
		for(var j = 0; j < card.episodes.length; j++) {
			
			if(!card.episodes[j].w){

				if(j == card.episodes.length - 1){
					card.curEpisodeName = allEpisodesWatched;
					card.allWatched = true;
				}
				else{
					card.curEpisodeName = card.episodes[j+1].n;
					card.curEpisodeNr = card.episodes[j+1].eNr;
					card.curSeasonNr = card.episodes[j+1].sNr;
				}
				
				setEpisodeWatched(card, j);
				break;
			}					
		}

		function setEpisodeWatched (card, j) {
			UserService.setWatched(token, true, card.episodes[j].id)
				.then(function (res){
					card.episodes[j].w = true;
				}, function (err){
					$scope.err = err;
					card.episodes[j].w = false;
				});
		}
			
		var progressBar = $("#" + card._id).find('.progress-bar');
		var newPerc = parseFloat($(progressBar).attr("aria-valuenow")) + card.incrementAmount;
		if(newPerc >= 100){
			newPerc = 100;
			$(progressBar).removeClass('progress-bar-warning').addClass('progress-bar-success');		
			$("#" + card._id).find('.label').removeClass('label-warning').addClass('label-success');
		}
		
		$(progressBar).attr("aria-valuenow", newPerc);
		$(progressBar).css({width: newPerc + "%"});
	};
	


	$scope.setEpisodeWatched = function (episode) {
		UserService.setWatched(token, !episode.w, episode.id)
			.then(function (res){
				episode.w = !episode.w;
			}, function (err){
				$scope.err = err;
				episode.w = episode.w;
		});	
	}





}]);