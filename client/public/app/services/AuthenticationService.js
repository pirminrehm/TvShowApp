var app = angular.module('tvshowapp');

app.factory('AuthenticationService', ['$http','$q', function($http,$q){

	var url = config.restUrl;

	var doNewList = function(email){
		var deferred = $q.defer();
		$http.post(url + "/usr/register", email)
			.success(function (response){
				deferred.resolve(response);
			})
			.error(function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	};


	var doGetList = function(email){
		var deferred = $q.defer();
		$http.post(url + "/usr/mail/get", email)
			.success(function (response){
				deferred.resolve(response);
			})
			.error(function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	};


	var service = {
		newList : function(email){return doNewList(email);},
		getList : function(email){return doGetList(email);}
	};


	return service;
}]);