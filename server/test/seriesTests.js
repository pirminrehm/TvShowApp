var should = require('should'); 
var assert = require('assert'); 
var colors = require('colors');
var mongoose = require('mongoose');


//own dependencies
var config = require('../config.json');
var data =  require('./testData.json');
var server = require('../bin/www');
var mongoStart = require('../bin/mongoStart');
var loggingStart = require('../bin/loggingStart');


var myFunctions = require('./myFunctions');
var myAssert = myFunctions.myAssert;
var req = myFunctions.req;
var insert = myFunctions.insert;


/* Account overview

acc1 = validated, test1, 0 series
acc4= acc1 + houseOfCards
acc6 = acc4 + himym

acc2 = not validated, test2, 0 series
acc5 = acc2 + validated
acc3 = acc2 + validated + house of Cards (index 1 and 2 are true)
acc7 = acc3 +himym (index 1 and 2 are true)

*/


/******************************
====== config variables =======
*******************************/

//logging to console?
var clog = false;



describe('Series-Test:'.red, function() {
	beforeEach(function(done) {
		insert.user (data.acc1, function() {
			insert.series (data.houseOfCards, function() { done(); });
		});
	});
	describe('get series'.yellow, function() {	
		describe('successfull', function() {
			it('should get meta infos about a series', function(done) {
				req.get("", "/series/token/"+ data.acc1.token + "/series/"+data.houseOfCards.Series.id+"/details", 200, function(body) {
					myAssert (body, data.houseOfCards.Series,  done);
				});
			});
		});
		describe('failures', function() {
			it('should try to get meta infos about a series with a wrong series id', function(done) {
				req.get("", "/series/token/"+ data.acc1.token + "/series/"+"00"+"/details", 500, function(body) {
					myAssert (body.error, "Error: seriesId not found" ,  done);
				});
			});
			it('should try to get meta infos about a series with wrong token', function(done) {
				req.get("", "/series/token/"+ "blub" + "/series/"+"00"+"/details", 500, function(body) {
					myAssert (body.error,"We could't find your user token", done);
				});
			});
		});
	});

	describe('get episode'.yellow, function() {	
		describe('successfull', function() {
			it('should get meta infos about an episode', function(done) {
				req.get("", "/series/token/"+ data.acc1.token + "/episode/"+ data.acc3.series[0].episodes[0].id +"/details", 200, function(body) {
					myAssert (body, data.houseOfCards.Episode[0],  done);
				});
			});
		});

		describe('failures', function() {
			it('should try to get meta infos about an episode with a wrong series id', function(done) {
				req.get("", "/series/token/"+ data.acc1.token + "/episode/"+"00"+"/details", 500, function(body) {
					myAssert (body.error, "Error: episodeId not found" ,  done);
				});
			});
			it('should try to get meta infos about an episode with wrong token', function(done) {
				req.get("", "/series/token/"+ "blub" + "/episode/"+"00"+"/details", 500, function(body) {
					myAssert (body.error,"We could't find your user token",  done);
				});
			});
		});
	});

	describe('search for series'.yellow, function() {	
		it('should get meta infos about a series', function(done) {
			req.get("", "/series/token/"+ data.acc1.token + "/searchresult/search/the%20simpsons", 200, function(body) {
				//assert maybe will get wrong, if other series witht "simpson" are added to theTvDB
				myAssert (body, data.simpsonsSearchResult,  done);
			});
		});
	});
});