function Series(title, episodeAllCount, eipsodeWatchedCount, curEpisodeName) {

	//alert(episodeAllCount);
	this.percWatched = (eipsodeWatchedCount/episodeAllCount) * 100;
	this.progressBar = this.percWatched >= 100 ?
		'<span class="label label-warning" onclick="progressBarUpdate(this)">+1</span>' :
		'<span class="label label-success" onclick="progressBarUpdate(this)"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></span>';
	//alert(this.percWatched);
	this.title = title;
	this.episodeNr = 'S010101';
	this.episodeTitle = 'testTitle';
	/*
	 //'<span class="label label-warning" onclick="progressBarUpdate(this, true)">+1</span>' +


	 if(newPerc >= 100){
	 //progressBarFull(context);
	 newPerc = 100;
	 $(progressBar).removeClass('progress-bar-warning').addClass('progress-bar-success');
	 $(context).removeClass('label-warning').addClass('label-success');
	 $(context).html('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
	 }
	 */
}

var jsonData = '{' +
	'"_id": "5574356ed110c0b8184148ca",' +
	'"token": "79c25df0ec4bf2d92872a299c299685f426a3602",' +
	'"validated": true,' +
	'"email": "tvshowapp-test1@7kw.de",' +
	'"__v": 1,' +
	'"series":' +
	'	[' +
	'		{' +
	'		"name": "House of Cards (US)",' +
	'		"id": "262980",' +
	'		"_id": "557435e39c840bbc0c247385",' +
	'			"episodes":' +
	'				[' +
	'					{' +
	'						"id": 4411361,' +
	'						"watched": true,' +
	'						"_id": "557435e39c840bbc0c2473ac"' +
	'					},' +
	'					{' +
	'						"id": 4481708,' +
	'						"watched": false,' +
	'						"_id": "557435e39c840bbc0c2473ab"' +
	'					}' +
	'				]' +
	'		},' +
	'		{' +
	'		"name": "Big Bang Theory (US)",' +
	'		"id": "262980",' +
	'		"_id": "557435e39c840bbc0c247385",' +
	'			"episodes":' +
	'				[' +
	'					{' +
	'						"id": 4411361,' +
	'						"watched": true,' +
	'						"_id": "557435e39c840bbc0c2473ac"' +
	'					},' +
	'					{' +
	'						"id": 4481708,' +
	'						"watched": true,' +
	'						"_id": "557435e39c840bbc0c2473ab"' +
	'					}' +
	'				]' +
	'		}' +
	'	]' +
	'}';


//angular.module('tvshowapp', ['tvshowapp.filters', 'tvshowapp.services', 'tvshowapp.directives', 'ngSanitize']);
var app = angular.module("tvshowapp", []);

app.controller("HomeController", function($scope, $http){
	$scope.message = "Hallo Codebitches";

	$scope.cards = [];

	$scope.addSeries = function() {
		var arr = JSON.parse(jsonData);


		for(var i = 0; i < arr.series.length; i++) {
			var episodeAllCount = 0;
			var eipsodeWatchedCount = 0;
			var curEpisodeName = "";
			for(var j = 0; j < arr.series[i].episodes.length; j++) {
				episodeAllCount++;
				if(arr.series[i].episodes[j].watched){
					eipsodeWatchedCount++;
					curEpisodeName = arr.series[i].episodes[j].id;
				}
			}

			$scope.cards.push(new Series(arr.series[i].name, episodeAllCount, eipsodeWatchedCount, curEpisodeName));



		}

		/*
		$scope.cards.forEach(function (){
			alert("hi");
			progressBarUpdate(this, false);
		});
*/

	};








		/**/
	/*
	$http.get("http://localhost:3000/series").success(function(response){
		$scope.series = response;
	}).error(function(err) {
		$scope.error = err;
	});
	*/
});

/*
app.directive('myCard', function(){
	return {
		restrict: 'A',
		template: '<div>{{aCard.name}} {{aCard.phone}}</div>',
		replace: true,
		transclude: false,
		scope: {
			aCard: '=myCard'
		}
	};
});
*/
app.directive('myCard', function(){
	return {
		restrict: 'A',
		template:
'<div class="col-xs-12 col-sm-6 col-md-4">'+
	'<div class="progress">' +
		'<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="{{ aCard.percWatched }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ aCard.percWatched }}%;">' +
		'</div>' +
	'</div>' +
	'<div class="series" style="background-image:url(http://thetvdb.com/banners/fanart/original/262980-11.jpg);"> ' +
		'<div class="series-inner"> ' +
			'<div class="series-inner-title"> ' +
				'<div class="left"> ' +
					'<h2>{{aCard.title}}</h2> ' +
					'<p>{{aCard.episodeNr}}: {{aCard.episodeTitle}}</p> ' +
				'</div> ' +
				'<div class="right"> ' +
					'<h4><span class="label label-warning" onclick="progressBarUpdate(this)">+1</span></h4> ' +
					//'<h4 ng-bind-html="progressBarHtml"></h4> ' +
				'</div> ' +
				'<div class="clear"></div>' +
	'		</div>' +
	'	</div>' +
	'</div>' +
'</div>'	,



		replace: true,
		transclude: false,
		scope: {
			aCard: '=myCard'
		}


	};
});

/*
 '<div class="progress">' +
 '<div class="progress-bar progress-bar-warning" role="progressbar" ' +
 'aria-valuenow="{{aCard.percWatched}}" aria-valuemin="0" aria-valuemax="100" style="width: {{aCard.percWatched}}%;"></div>' +
 '</div>' +
 '<div class="series" style="background-image:url(http://thetvdb.com/banners/fanart/original/262980-11.jpg); background-size:100%;"> ' +
 '<div class="series-inner"> ' +
 '<div class="series-inner"> ' +
 '<div class="series-inner-title"> ' +
 '<div class="left"> ' +
 '<h2>{{aCard.title}}</h2> ' +
 '<p>{{aCard.episodeNr}}: {{aCard.episodeTitle}}</p> ' +
 '</div> ' +
 '<div class="right"> ' +
 '<h4><span class="label label-warning">+1</span></h4> ' +
 '</div> ' +
 '<div class="clear"></div> </div>		</div>		</div>		</div>'
 */
/*
 template: '<div><h2>{{aCard.title}}</h2> {{aCard.episodeNr}} ' +
 '{{aCard.episodeTitle}}</div>',
 */