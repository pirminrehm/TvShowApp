var app = angular.module( 'tvshowapp' );

app.controller( 'DetailController', [ '$scope','$location','$routeParams','$modal','SeriesService','UserService', function( $scope,$location,$routeParams,$modal,SeriesService,UserService ) {

	var token = $routeParams.token;
	var seriesId = $routeParams.seriesId;
	var userSeries;
	$scope.token = token;

	UserService.getUser( token )
		.then( function( res ) {

			//search for the relevant series stored by the user
			for ( var i = 0; i < res.series.length; i++ ) {
				if ( res.series[ i ].id == seriesId ) {
					userSeries = res.series[ i ];
					break;
				}
			}
			if ( userSeries ) {
				$scope.userSeries = userSeries;
			} else {

				// $scope.err = "Error";
				notification.notify( 'error',  "We were unable to find the series in your account" );
			}
		}, function( err ) {

			// $scope.err = err;
			if ( !err ) {err = { error:"We were unable to load your list" };}
			notification.notify( 'error',  err.error );
		} );

	SeriesService.getSeriesDetails( token, seriesId )
		.then( function( res ) {
			$scope.seriesDetails = res;
		}, function( err ) {

			// $scope.err = err;
			if ( !err ) {err = { error:"We were unable to details for this series" };}
			notification.notify( 'error',  err.error );
		} );

	$scope.setEpisodeWatched = function( episode ) {
		UserService.setWatched( token, !episode.w, episode.id )
			.then( function( res ) {
				episode.w = !episode.w;

				//the card directive is listening on the 'update' channel
				$scope.$broadcast( 'update' );
			}, function( err ) {

				// $scope.err = err;
				// episode.w = episode.w;
				if ( !err ) {err = { error: "We were unable to update this episode" };}
				notification.notify( 'error',  err.error );
		} );
	};

	$scope.showInformation = function( episode ) {

		var episodeDetails, modalInstance;

		SeriesService.getEpisodeDetails( token, episode.id )
			.then( function( res ) {
				episodeDetails = res;

				modalInstance = $modal.open( {
					templateUrl: 'app/templates/modals/modalEpisodeDetails.html',
					controller: [ "$scope", "$modalInstance", "details", "seriesName", function( $scope, $modalInstance, details, seriesName ) {
							$scope.details = details;
							$scope.seriesName = seriesName;
							$scope.close = function() {$modalInstance.dismiss( 'cancel' );};
					} ],
					resolve: {
						details: function() {return episodeDetails;},
						seriesName: function() {return $scope.userSeries.name;}
					}
				} );

			}, function( err ) {

				// $scope.err = err;
				if ( !err ) {err = { error: "We were unable to load details for this episode" };}
				notification.notify( 'error',  err.error );
			} );

		modalInstance.result.then( function() {}, function() {} );
	};

} ] );
