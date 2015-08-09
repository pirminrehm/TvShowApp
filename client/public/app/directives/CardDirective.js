var app = angular.module('tvshowapp');

app.directive('card', ['$routeParams', 'UserService', function($routeParams, UserService){
	return {
		scope: {
			card: '=',
			removecard: '&',
			small: '='
		},
		restrict: 'E',
		templateUrl: '/app/templates/card.html',
		link: function($scope, iElm, iAttrs) {

			$scope.token = $routeParams.token;
			var allEpisodesWatched = "You have watched all episodes!";

			enhanceSeries();
			

			/**
			 * calculates necessary information, which are not provided by the server
			 * @val {float}		episodeWidth: 	width of the <div> in the progressbar representing the respective episode
			 * @val {bool}		allWatched:  	is true when all episodes are watched, otherwise is's false
			 * @val {String}	curEpsiodeName: name of the first unwatched episode
			 * @val {int}		curEpisodeNr: 	number of the first unwachted episode
			 * @val {int}		curSeasonNr: 	season number of the first unwachted episode
			 */
			function enhanceSeries(){
				
				var j;
				$scope.card.episodeWidth = 100.4/$scope.card.episodes.length;
				$scope.card.curEpisodeName = "";
				$scope.card.allWatched = false;

				for(j = 0; j < $scope.card.episodes.length; j++) {

					//search for the first unwatched episode
					if(!$scope.card.episodes[j].w && $scope.card.curEpisodeName === ""){
						setCurrentSeriesProperties($scope.card, $scope.card.episodes[j].n, $scope.card.episodes[j].eNr, $scope.card.episodes[j].sNr);
						break;
					}
				}

				// if all epsiode are watched
				if(j == $scope.card.episodes.length){
					setCurrentSeriesProperties($scope.card, allEpisodesWatched, $scope.card.episodes[j-1].eNr, $scope.card.episodes[j-1].sNr);
					$scope.card.allWatched = true;
				}

			}


			/**
			 * setter function, which sets the properties of the card according to the parameters
			 * @param {object} 	card current series
			 * @param {string} 	name name of the first unwachted episode
			 * @param {int} 	eNr  number of the first unwachted episode
			 * @param {[type]} sNr  seanon number of the first unwachted episode
			 */
			function setCurrentSeriesProperties (card, name, eNr, sNr) {
				card.curEpisodeName = name;
				card.curEpisodeNr = eNr;
				card.curSeasonNr = sNr;
			}


			/**
			 * is called when the series is completely watched and sets the properties accordingly
			 * @param  {object} card current series
			 */
			function setCurrentSeriesPropertiesAllWatched (card) {
				card.curEpisodeName = allEpisodesWatched;
				card.allWatched = true;
			}


			/**
			 * update an episode as watched on the server
			 * @param {object} 	card	series of the episode
			 * @param {int} 	j  		index of the epsiode in the epsiode array
			 */
			function setEpisodeWatched (card, j) {
				UserService.setWatched($scope.token, true, card.episodes[j].id)
					.then(function (res){
						card.episodes[j].w = true;
					}, function (err){
						$scope.err = err;
						card.episodes[j].w = false;
					});
			}


			/**
			 * the 'update' channel is used to trigger the enhaceSeries() function when episodes are set to (un)watched 
			 * the broadcast event is triggered in the controllers/Detailscontroller.js
			 */
			$scope.$on('update', function(){
				enhanceSeries();
			});


			/**
			 * provides the functionality behind the "+1" button
			 * @param  {object} card current series
			 */
			$scope.progressUpdate = function(card){
		
				for(var j = 0; j < card.episodes.length; j++) {
					
					if(!card.episodes[j].w){

						//all episodes are wachted
						if(j == card.episodes.length - 1){
							setCurrentSeriesPropertiesAllWatched(card);
						}

						//the next episode is already watched
						else if (card.episodes[j+1].w){
							
							var k;

							//search for the next unwatched episode
							for(k=j+2; k < card.episodes.length; k++){
								
								//if an unwatched episode is found, take it
								if(!card.episodes[k].w){
									setCurrentSeriesProperties(card, card.episodes[k].n, card.episodes[k].eNr, card.episodes[k].sNr);
									break;
								}
							}

							//if all episodes are watched
							if(k == card.episodes.length){
								setCurrentSeriesPropertiesAllWatched(card);			
							}
						}

						//take the following episode
						else{
							setCurrentSeriesProperties(card, card.episodes[j+1].n, card.episodes[j+1].eNr, card.episodes[j+1].sNr);
						}
						
						setEpisodeWatched(card, j);
						break;
					}
				}
			};
		}
	};
}]);