// var app = angular.module('tvshowapp');

// app.controller('UserController', ['$scope','$routeParams','SearchService','UserService', function($scope,$routeParams,SearchService,UserService){
	
// 	$scope.cards = [];
// 	$scope.searchResults = [];

// 	var token = $routeParams.token;


// 	UserService.getUser(token)
// 		.then(function (res){
// 			for(var i=0; i<res.series.length; i++){
// 				createNewSeries(res.series[i]);
// 			}
// 		}, function (err){
// 			$scope.err = err;
// 		});

		
		
// 		var allSeriesNames = ["The Sopranos","Seinfeld","The Twilight Zone","All in the Family","M*A*S*H","The Mary Tyler Moore Show","Mad Men","Cheers","The Wire","The West Wing","The Simpsons","I Love Lucy","Breaking Bad","The Dick Van Dyke Show","Hill Street Blues","Arrested Development","The Daily Show with Jon Stewart","Six Feet Under","Taxi","The Larry Sanders Show","30 Rock","Friday Night Lights","Frasier","Friends","Saturday Night Live","The X-Files","Lost","The Cosby Show","Curb Your Enthusiasm","The Honeymooners","Deadwood","Star Trek","Modern Family","Twin Peaks","NYPD Blue","The Carol Burnett Show","Battlestar Galactica","Sex & The City","Game of Thrones","The Bob Newhart Show","Your Show of Shows","Downton Abbey, Law & Order","Thirtysomething","Homicide: Life on the Street","St. Elsewhere","Homeland","Buffy the Vampire Slayer","The Colbert Report","The Good Wife","Northern Exposure","The Wonder Years","L.A. Law","Sesame Street","Columbo","Fawlty Towers","The Rockford Files","Freaks and Geeks","Moonlighting","Roots","Everybody Loves Raymond","South Park","Playhouse 90","Dexter","My So-Called Life","Golden Girls","The Andy Griffith Show","Roseanne","The Shield","Murphy Brown","Barney Miller","The Odd Couple","Alfred Hitchcock Presents","Monty Python’s Flying Circus","Star Trek: The Next Generation","Upstairs, Downstairs","Get Smart","The Defenders","Gunsmoke","Justified","The Phil Silvers Show","Band of Brothers","Rowan & Martin’s Laugh-In","The Prisoner","Absolutely Fabulous","The Muppet Show","Boardwalk Empire","Will & Grace","Family Ties","Lonesome Dove","Soap","The Fugitive","Late Night with David Letterman","Louie","House of Cards"];
		
		
// 		$( "#search_bar" ).autocomplete({
// source: allSeriesNames,

//   select: function( event, ui ) {
  
//   $scope.searchString = ui.item.value;
//   $scope.search();
// 	//console.log(ui.item.value);
//   }
// });

// 	$scope.search = function(){

// 		if($('#search_bar').hasClass('active') &&  typeof $scope.searchString !== 'undefined' && $scope.searchString != ""){
			
// 			console.log('searchString', $scope.searchString);
			
// 			SearchService.searchNewSeries(token,$scope.searchString)
// 				.then(function (res){
					
// 					//console.log('searchString Final', $scope.searchString);
// 					console.log('res in $scope.search', res);
					
// 					$scope.searchResults = [];
// 					if(Array.isArray(res.Series)){
// 						$scope.searchResults = res.Series;
// 					}
// 					else if(res.Series){
// 						$scope.searchResults[0] = res.Series;
// 					}
// 					else{
// 						$scope.searchResults = [];
// 						console.log('no search result');
// 						$("#dialog").dialog();
						
// 						//alert('No search results');
// 					}
// 				}, function (err){
// 					$scope.err = err;
// 				});
// 		} else {
// 			$('#search_button .glyphicon').removeClass('glyphicon-plus');
// 			$('#search_button .glyphicon').addClass('glyphicon-search');
// 			$('#search_bar').addClass('active');
// 			$('#search_button').css('border-top-left-radius', '0px');
// 			$('#search_button').css('border-bottom-left-radius', '0px');
// 			$scope.searchString = [];
// 		}
// 	};
	
	
// 	$scope.addSeriesToMyList = function(seriesId) {
		
// 		// Test glyphicon glyphicon-time
// 		$('#' + seriesId).removeClass("glyphicon-plus");
// 		$('#' + seriesId).addClass("glyphicon-time");

// 		UserService.addSeriesToList(token, seriesId)
// 			.then(function (res){
// 				createNewSeries(res);
// 				$('#' + seriesId).removeClass("glyphicon-time");
// 				$('#' + seriesId).addClass("glyphicon-ok");

// 				$( "#searchResultList" ).fadeOut( "slow", function() {
//     				// Animation complete.
//     				$scope.searchResults = [];
//   				});
				
// 			}, function (err){
// 				$scope.err = err;
// 			});	
// 	};


// 	function createNewSeries(series){
	
// 	console.log('series in createNewSeries', series);
		
// 		var episodeAllCount = 0;
// 		var eipsodeWatchedCount = 0;
// 		var curEpisodeName = "";
// 		for(var j = 0; j < series.episodes.length; j++) {
// 			episodeAllCount++;
// 			if(series.episodes[j].watched){
// 				eipsodeWatchedCount++;
// 				//curEpisodeName = series.episodes[j].id;
// 			} else if(curEpisodeName == ""){
			
// 				//curEpisodeNr = series.episodes[j].
// 				curEpisodeName = series.episodes[j].name;
// 			}
// 		}
// 		$scope.cards.push(new Series(series.id, series.name, series.bannerUrl,episodeAllCount, eipsodeWatchedCount, curEpisodeName, series.episodes));
// 	}
	
	

	
// 	$scope.progressBarUpdate = function(id, incrementAmount){
// 		console.log(incrementAmount);
		
// 		//episodeNr muss watched=true gesetzt werden
		
// 		for(var i = 0; i < $scope.cards.length; i++) {
// 			if($scope.cards[i]._id == id){
			
// 				for(var j = 0; j < $scope.cards[i].episodes.length; j++) {
// 					if(!$scope.cards[i].episodes[j].watched){
// 						$scope.cards[i].episodeTitle = $scope.cards[i].episodes[j+1].name;
// 						$scope.cards[i].episodes[j].watched = true;
// 						UserService.setWatched(token, true, $scope.cards[i].episodes[j].id).then(function (res){
// 							console.log("success");
// 						}, function (err){
// 							$scope.err = err;
// 							//$scope.cards[i].episodes[j].watched = false;
// 						});	
						
						
// 						break;
// 					}
// 				}
				
			
			
				
// 			}
		
// 		}
		
// 		//this.episodeNr = 'S010101';

		
	
// 		//alert(incrementAmount);
// 	var progressBar = $("#" + id).find('.progress-bar');
// 	//console.log(progressBar);
// 	//get number of episodes in current season
// 	//var nrTotal = ...
// 	//get new current percentage
// 	//var curPerc = curEpisode / nrTotal;
// 	var newPerc = parseFloat($(progressBar).attr("aria-valuenow")) + incrementAmount;
// 	//console.log(newPerc);
// 	//console.log(newPerc);
// 	if(newPerc >= 100){
// 		//progressBarFull(id);
// 		newPerc = 100;
// 		$(progressBar).removeClass('progress-bar-warning').addClass('progress-bar-success');
		
// 		$("#" + id).find('.label').removeClass('label-warning').addClass('label-success');
// 	}
// 	$(progressBar).attr("aria-valuenow", newPerc);
// 	$(progressBar).css({width: newPerc + "%"});
// 	};
	
// 		/**/
// 	/*
// 	$http.get("http://localhost:3000/series").success(function(response){
// 		$scope.series = response;
// 	}).error(function(err) {
// 		$scope.error = err;
// 	});
// 	*/
// }]);

var app = angular.module('tvshowapp');

app.controller('UserController', ['$scope','$routeParams','SearchService','UserService', function($scope,$routeParams,SearchService,UserService){
	
	$scope.cards = [];
	$scope.searchResults = [];

	var token = $routeParams.token;

	var allEpisodesWatched = "You have watched all episodes!";


	UserService.getUser(token)
		.then(function (res){
			console.log('res user', res);
			for(var i=0; i<res.series.length; i++){
				enhanceSeries(res.series[i]);
			}
			$scope.cards = res.series;
			console.log('$scope.cards', $scope.cards);
		}, function (err){
			$scope.err = err;
		});


		function enhanceSeries(series){

			series.episodeAllCount = series.episodes.length;
			series.eipsodeWatchedCount = 0;
			series.curEpisodeName = "";
			series.incrementAmount = (1/series.episodeAllCount) * 100 + 0.0000000001;
			episodeNr = 'S010101';

			for(var j = 0; j < series.episodes.length; j++) {
				if(series.episodes[j].w){
					series.eipsodeWatchedCount++;
				} else if(series.curEpisodeName == ""){
					series.curEpisodeName = series.episodes[j].n;
					series.curEpisodeNr = series.episodes[j].eNr;
				}
				if(j == series.episodes.length - 1 && series.curEpisodeName == ""){
					series.curEpisodeName = allEpisodesWatched;
					series.curEpisodeNr = series.episodes[j].eNr;
				}
			}
			series.percWatched = (series.eipsodeWatchedCount/series.episodeAllCount) * 100;
			console.log('eipsodeWatchedCount', series.eipsodeWatchedCount);
			return series;
			
		}

		
		
		var allSeriesNames = ["The Sopranos","Seinfeld","The Twilight Zone","All in the Family","M*A*S*H","The Mary Tyler Moore Show","Mad Men","Cheers","The Wire","The West Wing","The Simpsons","I Love Lucy","Breaking Bad","The Dick Van Dyke Show","Hill Street Blues","Arrested Development","The Daily Show with Jon Stewart","Six Feet Under","Taxi","The Larry Sanders Show","30 Rock","Friday Night Lights","Frasier","Friends","Saturday Night Live","The X-Files","Lost","The Cosby Show","Curb Your Enthusiasm","The Honeymooners","Deadwood","Star Trek","Modern Family","Twin Peaks","NYPD Blue","The Carol Burnett Show","Battlestar Galactica","Sex & The City","Game of Thrones","The Bob Newhart Show","Your Show of Shows","Downton Abbey, Law & Order","Thirtysomething","Homicide: Life on the Street","St. Elsewhere","Homeland","Buffy the Vampire Slayer","The Colbert Report","The Good Wife","Northern Exposure","The Wonder Years","L.A. Law","Sesame Street","Columbo","Fawlty Towers","The Rockford Files","Freaks and Geeks","Moonlighting","Roots","Everybody Loves Raymond","South Park","Playhouse 90","Dexter","My So-Called Life","Golden Girls","The Andy Griffith Show","Roseanne","The Shield","Murphy Brown","Barney Miller","The Odd Couple","Alfred Hitchcock Presents","Monty Python’s Flying Circus","Star Trek: The Next Generation","Upstairs, Downstairs","Get Smart","The Defenders","Gunsmoke","Justified","The Phil Silvers Show","Band of Brothers","Rowan & Martin’s Laugh-In","The Prisoner","Absolutely Fabulous","The Muppet Show","Boardwalk Empire","Will & Grace","Family Ties","Lonesome Dove","Soap","The Fugitive","Late Night with David Letterman","Louie","House of Cards"];
		
		
		$( "#search_bar" ).autocomplete({
source: allSeriesNames,

  select: function( event, ui ) {
  
  $scope.searchString = ui.item.value;
  $scope.search();
	//console.log(ui.item.value);
  }
});

	$scope.search = function(){

		if($('#search_bar').hasClass('active') &&  typeof $scope.searchString !== 'undefined' && $scope.searchString != ""){
			
			console.log('searchString', $scope.searchString);
			
			SearchService.searchNewSeries(token,$scope.searchString)
				.then(function (res){
					
					//console.log('searchString Final', $scope.searchString);
					console.log('res in $scope.search', res);
					
					$scope.searchResults = [];
					if(Array.isArray(res.Series)){
						$scope.searchResults = res.Series;
					}
					else if(res.Series){
						$scope.searchResults[0] = res.Series;
					}
					else{
						$scope.searchResults = [];
						console.log('no search result');
						$("#dialog").dialog();
						
						//alert('No search results');
					}
				}, function (err){
					$scope.err = err;
				});
		} else {
			$('#search_button .glyphicon').removeClass('glyphicon-plus');
			$('#search_button .glyphicon').addClass('glyphicon-search');
			$('#search_bar').addClass('active');
			$('#search_button').css('border-top-left-radius', '0px');
			$('#search_button').css('border-bottom-left-radius', '0px');
			$scope.searchString = [];
		}
	};
	
	
	$scope.addSeriesToMyList = function(seriesId) {
		
		// Test glyphicon glyphicon-time
		$('#' + seriesId).removeClass("glyphicon-plus");
		$('#' + seriesId).addClass("glyphicon-time");

		UserService.addSeriesToList(token, seriesId)
			.then(function (res){
				
				// createNewSeries(res);
				console.log('res', res);
				$scope.cards.push(enhanceSeries(res));

				$('#' + seriesId).removeClass("glyphicon-time");
				$('#' + seriesId).addClass("glyphicon-ok");

				$( "#searchResultList" ).fadeOut( "slow", function() {
    				// Animation complete.
    				$scope.searchResults = [];
  				});
				
			}, function (err){
				$scope.err = err;
			});	
	};


	function createNewSeries(series){
	
	console.log('series in createNewSeries', series);
		
		var episodeAllCount = 0;
		var eipsodeWatchedCount = 0;
		var curEpisodeName = "";
		for(var j = 0; j < series.episodes.length; j++) {
			episodeAllCount++;
			if(series.episodes[j].watched){
				eipsodeWatchedCount++;
				//curEpisodeName = series.episodes[j].id;
			} else if(curEpisodeName == ""){
			
				//curEpisodeNr = series.episodes[j].
				curEpisodeName = series.episodes[j].name;
			}
		}
		$scope.cards.push(new Series(series.id, series.name, series.bannerUrl,episodeAllCount, eipsodeWatchedCount, curEpisodeName, series.episodes));
	}
	
	

	
	$scope.progressBarUpdate = function(id, incrementAmount){
		console.log(incrementAmount);
		
		//episodeNr muss watched=true gesetzt werden
		
		for(var i = 0; i < $scope.cards.length; i++) {
			if($scope.cards[i]._id == id){
			
				for(var j = 0; j < $scope.cards[i].episodes.length; j++) {
					if(!$scope.cards[i].episodes[j].w){

						if(j == $scope.cards[i].episodes.length-1){
							$scope.cards[i].curEpisodeName = allEpisodesWatched;
						}
						else{
							$scope.cards[i].curEpisodeName = $scope.cards[i].episodes[j+1].n;
							$scope.cards[i].curEpisodeNr = $scope.cards[i].episodes[j+1].eNr;
						}
						
						$scope.cards[i].episodes[j].w = true;
							UserService.setWatched(token, true, $scope.cards[i].episodes[j].id).then(function (res){
								console.log("success");
							}, function (err){
								$scope.err = err;
								//$scope.cards[i].episodes[j].watched = false;
							});	
						
						
						break;
					}
				}
				
			
			
				
			}
		
		}
		
		//this.episodeNr = 'S010101';

		
	
		//alert(incrementAmount);
	var progressBar = $("#" + id).find('.progress-bar');
	//console.log(progressBar);
	//get number of episodes in current season
	//var nrTotal = ...
	//get new current percentage
	//var curPerc = curEpisode / nrTotal;
	var newPerc = parseFloat($(progressBar).attr("aria-valuenow")) + incrementAmount;
	//console.log(newPerc);
	console.log(newPerc);
	if(newPerc >= 100){
		//progressBarFull(id);
		newPerc = 100;
		$(progressBar).removeClass('progress-bar-warning').addClass('progress-bar-success');
		
		$("#" + id).find('.label').removeClass('label-warning').addClass('label-success');
	}
	$(progressBar).attr("aria-valuenow", newPerc);
	$(progressBar).css({width: newPerc + "%"});
	};
	
		/**/
	/*
	$http.get("http://localhost:3000/series").success(function(response){
		$scope.series = response;
	}).error(function(err) {
		$scope.error = err;
	});
	*/
}]);