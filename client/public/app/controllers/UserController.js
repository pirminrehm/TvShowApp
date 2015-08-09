var app = angular.module('tvshowapp');

app.controller('UserController', ['$scope','$routeParams','SearchService','UserService', function($scope,$routeParams,SearchService,UserService){
	
	$scope.cards = [];
	$scope.searchResults = [];
	$scope.searchString = "";
	$scope.searchBarActive = false;

	var token = $routeParams.token;
	$scope.token = token;
	
	var allEpisodesWatched = "You have watched all episodes!";
	var allSeriesNames = ["The Sopranos","Seinfeld","The Twilight Zone","All in the Family","M*A*S*H","The Mary Tyler Moore Show","Mad Men","Cheers","The Wire","The West Wing","The Simpsons","I Love Lucy","Breaking Bad","The Dick Van Dyke Show","Hill Street Blues","Arrested Development","The Daily Show with Jon Stewart","Six Feet Under","Taxi","The Larry Sanders Show","30 Rock","Friday Night Lights","Frasier","Friends","Saturday Night Live","The X-Files","Lost","The Cosby Show","Curb Your Enthusiasm","The Honeymooners","Deadwood","Star Trek","Modern Family","Twin Peaks","NYPD Blue","The Carol Burnett Show","Battlestar Galactica","Sex & The City","Game of Thrones","The Bob Newhart Show","Your Show of Shows","Downton Abbey, Law & Order","Thirtysomething","Homicide: Life on the Street","St. Elsewhere","Homeland","Buffy the Vampire Slayer","The Colbert Report","The Good Wife","Northern Exposure","The Wonder Years","L.A. Law","Sesame Street","Columbo","Fawlty Towers","The Rockford Files","Freaks and Geeks","Moonlighting","Roots","Everybody Loves Raymond","South Park","Playhouse 90","Dexter","My So-Called Life","Golden Girls","The Andy Griffith Show","Roseanne","The Shield","Murphy Brown","Barney Miller","The Odd Couple","Alfred Hitchcock Presents","Monty Python’s Flying Circus","Star Trek: The Next Generation","Upstairs, Downstairs","Get Smart","The Defenders","Gunsmoke","Justified","The Phil Silvers Show","Band of Brothers","Rowan & Martin’s Laugh-In","The Prisoner","Absolutely Fabulous","The Muppet Show","Boardwalk Empire","Will & Grace","Family Ties","Lonesome Dove","Soap","The Fugitive","Late Night with David Letterman","Louie","House of Cards"];

	
	UserService.getUser(token)
		.then(function (res){			
			$scope.cards = res.series;
		}, function (err){
			$scope.err = err;
		});


	$(document.body).click(function(e){
		var $box = $('#search');
		if(!$.contains($box[0], e.target)){
			$scope.searchBarActive = false;
			$scope.$apply();
		}
	});


	$("#search_bar").autocomplete({
		source: allSeriesNames,
		select: function(event, ui) {  
			$scope.searchString = ui.item.value;
			$scope.search();
		}
	});


	function contains(a, obj) {
	    for (var i = 0; i < a.length; i++) {
	        if (a[i] === obj) {
	            return true;
	        }
	    }
	    return false;
	}


	$scope.search = function(){

		if($('#search_bar').hasClass('active') &&  typeof $scope.searchString !== 'undefined' && $scope.searchString != ""){

			$( "#searchResultList" ).fadeIn( "slow", function(){});
			
			SearchService.searchNewSeries(token, $scope.searchString)
				.then(function (res){
					$scope.searchResults = [];
					
					if(Array.isArray(res.Series)){
						$scope.searchResults = res.Series;
					}
					else if(res.Series){
						$scope.searchResults[0] = res.Series;
					}
					else{
						$scope.searchResults = [];
						$("#dialog").dialog();
					}
				}, function (err){
					$scope.err = err;
				});
		} 
		else {
			$('#search_bar').focus();
			$scope.searchBarActive = true;
			$scope.searchString = "";
		}
	};
	
	
	$scope.addSeriesToMyList = function(seriesId, index) {
		
		angular.element('#' + seriesId).removeClass("glyphicon-plus");
		angular.element('#' + seriesId).addClass("glyphicon-time");

		UserService.addSeriesToList(token, seriesId)
			.then(function (res){

				// $scope.cards.push(enhanceSeries(res));
				$scope.cards.push(res);
				angular.element('#' + seriesId).removeClass("glyphicon-time");
				angular.element('#' + seriesId).addClass("glyphicon-ok");

				$( "#searchResultList" ).slideUp( "slow", function() {
    				$scope.searchResults = [];
  				});
				
			}, function (err){
				$scope.err = err;
				angular.element('#' + seriesId).removeClass("glyphicon-time");
				angular.element('#' + seriesId).addClass("glyphicon-plus");
				// alert(err.error);
				// $("#dialog2").dialog();
			});	
	};
	

	$scope.removeSeries = function(card){
		var r = confirm("Delete \"" + card.name + "\" ?");
		if (r === true) {
			UserService.removeSeries(token,card.id)
				.then(function (res){
					$scope.cards.splice($scope.cards.indexOf(card),1);
				}, function (err){
					$scope.err = err;
				});
		}
	};

}]);