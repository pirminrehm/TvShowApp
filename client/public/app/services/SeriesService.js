var app = angular.module('tvshowapp');

app.factory('SeriesService', ['$http','$q', function($http,$q){

	var url = config.restUrl;


	var doGetSeriesDetails = function(token, seriesId){
		var deferred = $q.defer();
		$http.get(url + "/series/token/" + token + "/series/" + seriesId + "/details")
			.success(function (response){
				deferred.resolve(response);
			})
			.error(function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	};


	var doGetEpisodeDetails = function(token, episodeId){
		var deferred = $q.defer();
		$http.get(url + "/series/token/" + token + "/episode/" + episodeId + "/details")
			.success(function (response){
				deferred.resolve(response);
			})
			.error(function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	};


	var service = {
		getSeriesDetails : function(token,seriesId){return doGetSeriesDetails(token,seriesId);},
		getEpisodeDetails : function(token,episodeId){return doGetEpisodeDetails(token,episodeId);}
	};


	return service;
	
}]);