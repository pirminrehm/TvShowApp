var app = angular.module( 'tvshowapp' );

app.controller( 'VerifyController', [ '$scope','$routeParams','$location','AuthenticationService', function( $scope,$routeParams,$location,AuthenticationService ) {

	var token = $routeParams.token;

	AuthenticationService.verify( token )
		.then( function( res ) {
			notification.notify( 'success',  "Your account was verified" );
			$location.url( "/user/" + token );
		}, function( err ) {
			if ( !err ) {err = { error:"We were unable to verify your account" };}
			notification.notify( 'error',  err.error );
		} );

} ] );
