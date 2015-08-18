var app = angular.module( 'tvshowapp' );

app.controller( 'UserController', [ '$scope','$routeParams','$modal','SearchService','UserService', function( $scope,$routeParams,$modal,SearchService,UserService ) {

	var token = $routeParams.token;
	$scope.cards = [];
	$scope.searchResults = [];
	$scope.searchString = "";
	$scope.searchBarActive = false;
	$scope.token = token;
	$scope.loadingFinished = false;

	$scope.allSeriesNames = [ "The Sopranos","Seinfeld","The Twilight Zone","All in the Family","M*A*S*H","The Mary Tyler Moore Show","Mad Men","Cheers","The Wire","The West Wing","The Simpsons","I Love Lucy","Breaking Bad","The Dick Van Dyke Show","Hill Street Blues","Arrested Development","The Daily Show with Jon Stewart","Six Feet Under","Taxi","The Larry Sanders Show","30 Rock","Friday Night Lights","Frasier","Friends","Saturday Night Live","The X-Files","Lost","The Cosby Show","Curb Your Enthusiasm","The Honeymooners","Deadwood","Star Trek","Modern Family","Twin Peaks","NYPD Blue","The Carol Burnett Show","Battlestar Galactica","Sex & The City","Game of Thrones","The Bob Newhart Show","Your Show of Shows","Downton Abbey, Law & Order","Thirtysomething","Homicide: Life on the Street","St. Elsewhere","Homeland","Buffy the Vampire Slayer","The Colbert Report","The Good Wife","Northern Exposure","The Wonder Years","L.A. Law","Sesame Street","Columbo","Fawlty Towers","The Rockford Files","Freaks and Geeks","Moonlighting","Roots","Everybody Loves Raymond","South Park","Playhouse 90","Dexter","My So-Called Life","Golden Girls","The Andy Griffith Show","Roseanne","The Shield","Murphy Brown","Barney Miller","The Odd Couple","Alfred Hitchcock Presents","Monty Python's Flying Circus","Star Trek: The Next Generation","Upstairs, Downstairs","Get Smart","The Defenders","Gunsmoke","Justified","The Phil Silvers Show","Band of Brothers","Rowan & Martin's Laugh-In","The Prisoner","Absolutely Fabulous","The Muppet Show","Boardwalk Empire","Will & Grace","Family Ties","Lonesome Dove","Soap","The Fugitive","Late Night with David Letterman","Louie","House of Cards" ];


	UserService.getUser( token )
		.then( function( res ) {
			console.log( 'res', res );
			$scope.cards = res.series;
			$scope.loadingFinished = true;
		}, function( err ) {

			if ( !err ) {err = { error:"We were unable to load your series" };}
			notification.notify( 'error',  err.error );
			$scope.loadingFinished = true;
		} );

	function contains( a, obj ) {
	    for ( var i = 0; i < a.length; i++ ) {
	        if ( a[ i ] === obj ) {
	            return true;
	        }
	    }
	    return false;
	}

	//reduce the search input field when clicking somewhere else than the search bar
	$( document.body ).click( function( e ) {
		var $box = $( '#search' );
		if ( !$.contains( $box[ 0 ], e.target ) ) {
			$scope.searchBarActive = false;
			$scope.$apply();
		}
	} );

	//send a search request immediately when the user has selected an item from the autocomplete
	$scope.onSelect = function( $item, $model, $label ) {
	    $scope.searchString = $item;
		$scope.search();
	};

	$scope.search = function() {

		if ( $( '#search_bar' ).hasClass( 'active' ) && $scope.searchString !== "" ) {

			$( "#searchResultList" ).fadeIn( "slow", function() {} );

			SearchService.searchNewSeries( token, $scope.searchString )
				.then( function( res ) {
					$scope.searchResults = [];

					//more than one search result
					if ( Array.isArray( res.Series ) ) {
						$scope.searchResults = res.Series;
					}

					//if there's just one search result, it is not returned from the server in an array
					else if ( res.Series ) {
						$scope.searchResults[ 0 ] = res.Series;
					}

					//no search results
					else {
						$scope.searchResults = [];

						// $("#dialog").dialog();
						notification.notify( 'info',  "We were unable to find any search results for \"" + $scope.searchString + "\"" );

					}
				}, function( err ) {

					if ( !err ) {err = { error:"We were unable to get your search results" };}
					notification.notify( 'error',  err.error );
				} );
		}

		//expand the search bar and put the focus on it
		else {
			angular.element( '#search_bar' ).focus();
			$scope.searchBarActive = true;
			$scope.searchString = "";
		}
	};

	$scope.addSeriesToMyList = function( seriesId, index ) {

		angular.element( '#' + seriesId ).removeClass( "glyphicon-plus" );
		angular.element( '#' + seriesId ).addClass( "glyphicon-time" );

		UserService.addSeriesToList( token, seriesId )
			.then( function( res ) {

				$scope.cards.push( res );
				angular.element( '#' + seriesId ).removeClass( "glyphicon-time" );
				angular.element( '#' + seriesId ).addClass( "glyphicon-ok" );

				$( "#searchResultList" ).slideUp( "slow", function() {
    				$scope.searchResults = [];
  				} );

				notification.notify( 'success',  "We added <strong>" + res.name + "</strong> to your list", {
					behaviour: {
				        htmlMode: true
				    }
				} );

			}, function( err ) {

				angular.element( '#' + seriesId ).removeClass( "glyphicon-time" );
				angular.element( '#' + seriesId ).addClass( "glyphicon-plus" );

				// alert(err.error);
				// $("#dialog2").dialog();

				$( "#searchResultList" ).slideUp( "slow", function() {
    				$scope.searchResults = [];
  				} );

				if ( !err ) {err = { error:"We were unable to add the series to your list" };}
				notification.notify( 'error',  err.error );
			} );
	};

	$scope.removeSeries = function( card ) {

		var modalInstance = $modal.open( {
			templateUrl: 'app/templates/modals/modalConfirmAction.html',
			controller: [ "$scope", "$modalInstance", "title", "text", function( $scope, $modalInstance, title, text ) {
				$scope.title = title;
				$scope.text = text;
				$scope.ok = function() {$modalInstance.close();};
				$scope.cancel = function() {$modalInstance.dismiss( 'cancel' );};
			} ],
			resolve: {
				title: function() {return "Are you sure?";},
				text: function() {return "Delete your series \"" + card.name + "\" ?";}
			}
		} );

		modalInstance.result.then( function() {
			UserService.removeSeries( token, card.id )
				.then( function( res ) {
					var seriesName = card.name;
					$scope.cards.splice( $scope.cards.indexOf( card ), 1 );
					notification.notify( 'success',  "We removed <strong>" + seriesName + "</strong> from your list", {
						behaviour: {
					        htmlMode: true
					    }
					} );
				}, function( err ) {

					if ( !err ) {err = { error:"We were unable to remove the series from your list" };}
					notification.notify( 'error',  err.error );
				} );
		}, function() {} );
	};

} ] );
