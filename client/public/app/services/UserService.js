var app = angular.module('tvshowapp');

app.factory('UserService', ['$http','$q', function($http,$q){

	var url = config.restUrl;

	var doGetUser = function(token){
		var deferred = $q.defer();
		$http.get(url + "/usr/" + token + "/user/all")
			.success(function (response){
				deferred.resolve(response);
			})
			.error(function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	};


	var service = {
		getUser : function (token){return doGetUser(token);}
	};


	return service;
}]);