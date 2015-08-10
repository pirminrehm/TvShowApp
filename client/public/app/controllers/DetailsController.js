var app = angular.module('tvshowapp');

app.controller('DetailController', ['$scope','$location','$routeParams','$modal','SeriesService','UserService', function($scope,$location,$routeParams,$modal,SeriesService,UserService){

	var token = $routeParams.token;
	var seriesId = $routeParams.seriesId;
	var userSeries;
	var allEpisodesWatched = "You have watched all episodes!";
	$scope.token = token;
	

	UserService.getUser(token)
		.then(function (res){
			for(var i=0; i<res.series.length; i++){
				if (res.series[i].id == seriesId) {
					userSeries = res.series[i];
					break;
				}
			}
			if (userSeries) {
				$scope.userSeries = userSeries;
			} else {
				$scope.err = "Error";
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


	$scope.setEpisodeWatched = function (episode) {
		UserService.setWatched(token, !episode.w, episode.id)
			.then(function (res){
				episode.w = !episode.w;
				$scope.$broadcast('update');
			}, function (err){
				$scope.err = err;
				episode.w = episode.w;
				$scope.apply();
		});	
	};


	$scope.showInformation = function(episode) {
		
		var episodeDetails, modalInstance;

		SeriesService.getEpisodeDetails(token, episode.id)
			.then(function (res){
				episodeDetails = res;

				modalInstance = $modal.open({			
					templateUrl: 'app/templates/modals/modalEpisodeDetails.html',
					controller: ["$scope", "$modalInstance", "details", "seriesName", function ($scope, $modalInstance, details, seriesName){
							$scope.details = details;
							$scope.seriesName = seriesName;
							$scope.close = function () {$modalInstance.dismiss('cancel');};
					}],
					resolve: {
						details: function () {return episodeDetails;},
						seriesName: function () {return $scope.userSeries.name;}				
					}
				});

			}, function (err){
				$scope.err = err;
			});

		modalInstance.result.then(function () {
			console.log('modal dismal');
		}, function () {});
	};

}]);