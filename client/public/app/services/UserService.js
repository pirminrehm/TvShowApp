var app = angular.module('tvshowapp');

app.factory('UserService', ['$http','$q', function($http,$q){

	var url = config.restUrl;

	var doGetUser = function(token){
		var deferred = $q.defer();
		$http.get(url + "/usr/token/" + token + "/user/all")
			.success(function (response){
				deferred.resolve(response);
			})
			.error(function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	};


	var doAddSeriesToList = function(token,seriesId){
		var deferred = $q.defer();
		$http.get(url + "/usr/token/" + token + "/series/" + seriesId)
			.success(function (response){
				deferred.resolve(response);
			})
			.error(function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	};


	var service = {
		getUser : function (token){return doGetUser(token);},
		addSeriesToList : function (token,seriesId){return doAddSeriesToList(token,seriesId);}
	};


	return service;
}]);