var app = angular.module( 'tvshowapp' );

app.controller( 'MailController', [ '$scope', function( $scope ) {
	$scope.cards = [
		{
			name: "Breaking Bad",
			bannerUrl: "http://thetvdb.com/banners/fanart/original/81189-21.jpg",
			percWatched: 25,
			curSeasonNr: 1,
			curEpisodeNr: 4,
			curEpisodeName: "Cancer Man"
		},
		{
			name: "How I Met Your Mother",
			bannerUrl: "http://thetvdb.com/banners/fanart/original/75760-59.jpg",
			percWatched: 100,
			curSeasonNr: 9,
			curEpisodeNr: 24,
			curEpisodeName: "Last Forever (2)"
		},
		{
			name: "Suits",
			bannerUrl: "http://thetvdb.com/banners/fanart/original/247808-70.jpg",
			percWatched: 60,
			curSeasonNr: 3,
			curEpisodeNr: 5,
			curEpisodeName: "Shadow of a Doubt"
		}

	];
} ] );
