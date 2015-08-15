var should = require('should'); 
var assert = require('assert'); 
var colors = require('colors');
var mongoose = require('mongoose');
var _ = require('underscore');


//own dependencies
var data =  require('./testData.json');
var crawlerController = require('../crawler/crawlerController');


//myFunctions
var myFunctions = require('./myFunctions');
var myAssert = myFunctions.myAssert;
var req = myFunctions.req;
var findOne = myFunctions.findOne;
var insert = myFunctions.insert;
var forFunctionSafe = myFunctions.forFunctionSafe;
var convertSeriesForUser = myFunctions.convertSeriesForUser;
_.cloneSafe = myFunctions.cloneSafe;


/******************************
====== config variables =======
*******************************/


//logging to console?
var clog = false;



/******************************
========== main test ==========
*******************************/


beforeEach(function (done) {
        mongoose.connection.db.dropDatabase(function(){
        	//console.log("  Success: dropDatabase \n".green);  
            done();
    	});
});


/*

Generating Test Data:
	- get last updates-file from tvd +++
	- convert +++
	- use first series "S" +++
		- load series +++
		- remove last episode
		- store result
		- add series to user
		- add some other series to user

Testing:
	- execute crawler
	- result: series "S" should have one episodes (the deleted) more

*/



//main describe over all Tests
describe('Crawler-Test:'.red, function() {

	describe('Update missing episode'.yellow, function() {
		this.timeout(40000);
		beforeEach (function (done) {
			req.getUpdates (function (err, updates) {
				//forFunctionSafe (startingNr, < array.lenght , callback, finalCallback)
				forFunctionSafe (0, updates.Series.length, function (i,next) {
					req.getSeries (updates.Series[i].id, function (series) {	
					//series should at least have 10 episodes --> realistic test			
						if (series.Episode.length >= 10) {

							var userSeriesBefore = convertSeriesForUser(series);
							data.userEpisodeLenght = userSeriesBefore.episodes.length;
							data.userSeriesBefore = userSeriesBefore;

							delete series.Episode[series.Episode.length -1];
							insert.series(series, function () {
								var myUser = _.cloneSafe(data.acc6);
								myUser.series.push(convertSeriesForUser(series));
								insert.user(myUser, function() {
									done();
								});
							});
						} else {
							next();
						}
					});
				}, function() {});
			});
		});

		it('should test the test', function (done){			
			findOne.user (data.acc6.token, function (user) {
				myAssert(user.series[user.series.length -1].episodes.length, data.userEpisodeLenght -1, function () {});
				myAssert (user.series[user.series.length -1].episodes[user.series[user.series.length -1].episodes.length -1],data.userSeriesBefore.episodes[data.userSeriesBefore.episodes.length -2], done);
			});				
		});

		it('should update one missing episode in a series in user', function (done){
			crawlerController.getUpdates (function (err) {
				if (!err) {
					findOne.user (data.acc6.token, function (user) {
						myAssert(user.series[user.series.length -1].episodes.length, data.userEpisodeLenght, function () {});
						myAssert (user.series[user.series.length -1].episodes[user.series[user.series.length -1].episodes.length -1],data.userSeriesBefore.episodes[data.userSeriesBefore.episodes.length -1], done);
					});
				} else {
					throw err;
				}
			});
		});		
	});



	describe('Update episode details in series'.yellow, function() {
		this.timeout(40000);
		beforeEach (function (done) {
			req.getUpdates (function (err, updates) {
				//forFunctionSafe (startingNr, < array.lenght , callback, finalCallback)
				forFunctionSafe (0, updates.Series.length, function (i,next) {
					req.getSeries (updates.Series[i].id, function (series) {	
					//series should at least have 10 episodes --> realistic test			
						if (series.Episode.length >= 10) {

							data.originalSeries = _.cloneSafe(series);

							series.Episode[2].EpisodeName = "Now my name is Horst";
							series.Episode[5].EpisodeName = "Now my name is Jhon";
							series.Episode[7].EpisodeName = "Now my name is Kevin";
							series.Episode[8].EpisodeName = "Now my name is Codebitches";
							series.Episode[3].FirstAired = "a long time ago";
							series.Episode[4].Overview = "the old overview";

							insert.series(series, function () {
								insert.user(data.acc6, function() {
									done();
								});
							});
						} else {
							next();
						}
					});
				}, function() {});
			});
		});

		
		it('should test the test', function (done){

			findOne.series (data.originalSeries.id, function (series) {
				myAssert (series.Episode[2].EpisodeName, "Now my name is Horst");
				myAssert (series.Episode[5].EpisodeName, "Now my name is Jhon");
				myAssert (series.Episode[7].EpisodeName, "Now my name is Kevin");
				myAssert (series.Episode[8].EpisodeName, "Now my name is Codebitches");
				myAssert (series.Episode[3].FirstAired, "a long time ago");
				myAssert (series.Episode[4].Overview, "the old overview", done);
			});
		});

		it('should update some episode details', function (done){
			crawlerController.getUpdates (function (err) {
				if (!err) {
					findOne.series (data.originalSeries.id, function (series) {
						myAssert (series.Episode[2].EpisodeName, data.originalSeries.Episode[2].EpisodeName);
						myAssert (series.Episode[5].EpisodeName, data.originalSeries.Episode[5].EpisodeName);
						myAssert (series.Episode[7].EpisodeName, data.originalSeries.Episode[7].EpisodeName);
						myAssert (series.Episode[8].EpisodeName, data.originalSeries.Episode[8].EpisodeName);
						myAssert (series.Episode[3].FirstAired,  data.originalSeries.Episode[3].FirstAired);
						myAssert (series.Episode[4].Overview,    data.originalSeries.Episode[4].Overview, done);
					});
				} else {
					throw err;
				}
			});
		});		
	});

describe('Update series details in series'.yellow, function() {
		this.timeout(40000);
		beforeEach (function (done) {
			req.getUpdates (function (err, updates) {
				//forFunctionSafe (startingNr, < array.lenght , callback, finalCallback)
				forFunctionSafe (0, updates.Series.length, function (i,next) {
					req.getSeries (updates.Series[i].id, function (series) {	
					//series should at least have 10 episodes --> realistic test			
						if (series.Episode.length >= 10) {

							data.originalSeries = _.cloneSafe(series);

							series.Series.banner = "This is the old Banner";
							series.Series.Actors = "These are the old actors";
							series.Series.Genre = "This is the old genre";

							insert.series(series, function () {
								insert.user(data.acc6, function() {
									done();
								});
							});
						} else {
							next();
						}
					});
				}, function() {});
			});
		});

		
		it('should test the test', function (done){

			findOne.series (data.originalSeries.id, function (series) {
				myAssert (series.Series.banner, "This is the old Banner");
				myAssert (series.Series.Actors, "These are the old actors");
				myAssert (series.Series.Genre, "This is the old genre", done);
			});
		});

		it('should update some series details', function (done){
			crawlerController.getUpdates (function (err) {
				if (!err) {
					findOne.series (data.originalSeries.id, function (series) {
						myAssert (series.Series.banner, data.originalSeries.Series.banner);
						myAssert (series.Series.Actors, data.originalSeries.Series.Actors);
						myAssert (series.Series.Genre, data.originalSeries.Series.Genre, done);
					});
				} else {
					throw err;
				}
			});
		});		
	});
});