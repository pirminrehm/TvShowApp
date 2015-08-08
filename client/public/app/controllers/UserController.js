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
			for(var i=0; i<res.series.length; i++){
				enhanceSeries(res.series[i]);
			}
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


	function enhanceSeries(series){

		series.episodeWidth = 100.4/series.episodes.length;
		series.curEpisodeName = "";
		series.allWatched = false;

		var j;

		for(j = 0; j < series.episodes.length; j++) {
		
			//search for the first unwatched episode
			if(!series.episodes[j].w && series.curEpisodeName === ""){
				setCurrentSeriesProperties(series, series.episodes[j].n, series.episodes[j].eNr, series.episodes[j].sNr);
				break;
			}
			
		}

		// if all epsiode are watched
		if(j == series.episodes.length){
			setCurrentSeriesProperties(series, allEpisodesWatched, series.episodes[j-1].eNr, series.episodes[j-1].sNr);
			series.allWatched = true;
		}

		return series;

		function setCurrentSeriesProperties (series, name, eNr, sNr) {
			series.curEpisodeName = name;
			series.curEpisodeNr = eNr;
			series.curSeasonNr = sNr;
		}
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

				$scope.cards.push(enhanceSeries(res));
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
		var r = confirm("Delete this series?");
		if (r === true) {
			UserService.removeSeries(token,card.id)
				.then(function (res){
					$scope.cards.splice($scope.cards.indexOf(card),1);
				}, function (err){
					$scope.err = err;
				});
		}
	};

	
	$scope.progressBarUpdate = function(card){
		
		for(var j = 0; j < card.episodes.length; j++) {
			
			if(!card.episodes[j].w){

				//all episodes are wachted
				if(j == card.episodes.length - 1){
					updateCardAllEpisodesWatched(card);
				}

				//the next episode is already watched
				else if (card.episodes[j+1].w){
					
					var k;

					//search for the next unwatched episode
					for(k=j+2; k < card.episodes.length; k++){
						
						//if an unwatched episode is found, take it
						if(!card.episodes[k].w){
							updateCardNextUnwatchedEpisode(card, k, card.episodes[k].n, card.episodes[k].eNr, card.episodes[k].sNr);
							break;
						}
					}

					//if all episodes are watched
					if(k== card.episodes.length){
						card.curEpisodeName = allEpisodesWatched;
						card.allWatched = true;				
					}
				}

				//take the following episode
				else{
					updateCardNextUnwatchedEpisode(card, j+1, card.episodes[j+1].n, card.episodes[j+1].eNr, card.episodes[j+1].sNr);
				}
				
				setEpisodeWatched(card, j);
				break;
			}
		}

		function setEpisodeWatched (card, j) {
			UserService.setWatched(token, true, card.episodes[j].id)
				.then(function (res){
					card.episodes[j].w = true;
				}, function (err){
					$scope.err = err;
					card.episodes[j].w = false;
				});
		}

		function updateCardAllEpisodesWatched (card) {
			card.curEpisodeName = allEpisodesWatched;
			card.allWatched = true;
		}

		function updateCardNextUnwatchedEpisode (card, index, n, eNr, sNr) {
		 	card.curEpisodeName = card.episodes[index].n;
			card.curEpisodeNr = card.episodes[index].eNr;
			card.curSeasonNr = card.episodes[index].sNr;
		} 
	};	
		
}]);