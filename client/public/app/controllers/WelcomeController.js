var app = angular.module( 'tvshowapp' );

app.controller( 'WelcomeController', [ '$scope','$location','AuthenticationService', function( $scope,$location,AuthenticationService ) {

	$scope.email = "";

	$scope.newList = function() {
		if ( $scope.email ) {
			AuthenticationService.newList( { "email": $scope.email } )
				.then( function( res ) {
					notification.notify( 'info-mail',  "<p><strong>You have mail!</strong>  Please check your mail account.</p>" );
					$location.url( "/mail" );
				}, function( err ) {

					if ( !err ) {err = { error:"We were unable to create a new list" };}
					notification.notify( 'error',  err.error );
				} );
		} else {
			notification.notify( 'error',  "This wasn't an email adress" );
		}
	};

	$scope.getList = function() {
		if ( $scope.email ) {
			AuthenticationService.getList( $scope.email )
				.then( function( res ) {
					notification.notify( 'info-mail',  "<p><strong>You have mail!</strong>  Please check your mail account.</p>" );
					$location.url( "/mail" );
				}, function( err ) {

					if ( !err ) {err = { error:"We were unable to get your list" };}
					notification.notify( 'error',  err.error );
			} );
		} else {
			notification.notify( 'error',  "This wasn't an email adress" );
		}
	};

} ] );
