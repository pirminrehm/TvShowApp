var app = angular.module('tvshowapp');

app.factory('SearchService', ['$http','$q', function($http,$q){

	var url = config.restUrl;

	var doSearchNewSeries = function(token, searchString){
		var deferred = $q.defer();
		$http.get(url + "/series/token/" + token + "/searchresult/search/" + searchString)
			.success(function (response){
				deferred.resolve(response);
			})
			.error(function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	};


	var service = {
		searchNewSeries : function(token,searchString){return doSearchNewSeries(token,searchString);}
	};


	return service;
	
}]);