var app = angular.module('tvshowapp');

app.controller('DetailController', ['$scope', '$location', '$routeParams', '$modal', 'SeriesService', 'UserService', function($scope, $location, $routeParams, $modal, SeriesService, UserService) {

    var token = $routeParams.token;
    var seriesId = $routeParams.seriesId;
    var userSeries;
    $scope.token = token;
    $scope.loadingFinished = false;

    $scope.statusDetails = {
        open: true
    };
    

    //load user data
    UserService.getUser(token)
        .then(function(res) {

            for (var i = 0; i < res.series.length; i++) {
                if (res.series[i].id == seriesId) {
                    userSeries = res.series[i];
                    break;
                }
            }
            if (userSeries) {
                $scope.userSeries = userSeries;
                $scope.loadingFinished = true;
            } else {
                notification.notify('error', "We were unable to find the series in your account");
                $scope.loadingFinished = true;
            }
        }, function(err) {
            if (!err) {
                err = {
                    error: "We were unable to load your list"
                };
                $scope.loadingFinished = true;
            }
            notification.notify('error', err.error);
        });

    //load series data
    SeriesService.getSeriesDetails(token, seriesId)
        .then(function(res) {
            $scope.seriesDetails = res;
        }, function(err) {
            if (!err) {
                err = {
                    error: "We were unable to details for this series"
                };
            }
            notification.notify('error', err.error);
        });

    $scope.setEpisodeWatched = function(episode) {
        angular.element('#e' + episode.id + " span").html("");
        angular.element('#e' + episode.id + " span").addClass("glyphicon glyphicon-time");
        UserService.setWatched(token, !episode.w, episode.id)
            .then(function(res) {
                episode.w = !episode.w;
                $scope.$broadcast('update');
            }, function(err) {
                if (episode.w) {
                    angular.element('#e' + episode.id + " span").removeClass("glyphicon-time");
                    angular.element('#e' + episode.id + " span").addClass("glyphicon-ok");
                } else {
                    angular.element('#e' + episode.id + " span").removeClass("glyphicon glyphicon-time");
                    angular.element('#e' + episode.id + " span").html("+1");
                }
                if (!err) {
                    err = {
                        error: "We were unable to update this episode"
                    };
                }
                notification.notify('error', err.error);
            });
    };

    //show details of an episode in a modal
    $scope.showInformation = function(episode) {
        var episodeDetails;
        SeriesService.getEpisodeDetails(token, episode.id)
            .then(function(res) {
                episodeDetails = res;
                var modalInstance = $modal.open({
                    templateUrl: 'app/templates/modals/modalEpisodeDetails.html',
                    controller: ["$scope", "$modalInstance", "details", "seriesName", function($scope, $modalInstance, details, seriesName) {
                        $scope.details = details;
                        $scope.seriesName = seriesName;
                        $scope.close = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    }],
                    resolve: {
                        details: function() {
                            return episodeDetails;
                        },
                        seriesName: function() {
                            return $scope.userSeries.name;
                        }
                    }
                });

            }, function(err) {
                if (!err) {
                    err = {
                        error: "We were unable to load details for this episode"
                    };
                }
                notification.notify('error', err.error);
            });

    };
}]);

