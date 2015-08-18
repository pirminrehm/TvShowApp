var assert = require('assert');
var supertest = require('supertest');  
var request = require('request');
var mongoose = require('mongoose');
var colors = require('colors');
var parseString = require('xml2js').parseString;
var _ = require('underscore');

//models
require('../models/userModel');
var User = mongoose.model('User');

require('../models/seriesModel');
var Series = mongoose.model('Series');

//own dependencies
var config = require('../config.json');
var data =  require('./testData.json');
var dataSafe = require('../../private/dataSafe.json');



//logging to console?
var clog = false;


//url used in supertest requests
var url = config.testRestUrl;
var mongoUrl = config.dbTestUrl;




/******************************
====== request function =======
*******************************/
exports.req = {};

//helper for post request
exports.req.post = function (data2send, route, status, callback) {
	supertest(url)
		.post(route)
		.send(data2send)
		.expect(status) //Status code
		.expect('Content-Type', /json/) //ist es json?
		.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
		.end(function(err, res) {
			if (clog) console.log(res.body);
			if (err) {
				if (clog) console.log(res.body);
				throw err;
			}
			callback(res.body);
		});
};

//helper for get request
exports.req.get = function (data2send, route, status, callback) {
	supertest(url)
		.get(route)
		.expect(status) //Status code
		.expect('Content-Type', /json/) //ist es json?
		.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
		.end(function(err, res) {
			if (clog) console.log(res.body);
			if (err) {
				if (clog) console.log(res.body);
				throw err;
			}
			callback(res.body);
		});
};

//helper for put request
exports.req.put = function (data2send, route, status, callback) {
	supertest(url)
		.put(route)
		.send(data2send)
		.expect(status) //Status code
		.expect('Content-Type', /json/) //ist es json?
		.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
		.end(function(err, res) {
			if (clog) console.log(res.body);
			if (err) {
				if (clog) console.log(res.body);
				throw err;
			}
			callback(res.body);
		});
};

//helper for delete request
exports.req.delete = function (data2send, route, status, callback) {
	supertest(url)
		.delete(route)
		.expect(status) //Status code
		.expect('Content-Type', /json/) //ist es json?
		.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
		.end(function(err, res) {
			if (clog) console.log(res.body);
			if (err) {
				throw err;
			}
			callback(res.body);
		});
};

//helper to get the updates-day from theTvDB
exports.req.getUpdates = function (callback) {
	errmsg = "D'oh! There went something wrong while checking for new updates!";
	request("http://www.thetvdb.com/api/" + dataSafe.tvdbApiKey + "/updates/updates_day.xml", function (errReq, responseTvd, body) {

		if (responseTvd.statusCode == 200 && !errReq) {

			parseString(body, {explicitRoot: false, explicitArray : false}, function (errParse, updates) {		
				
				if(updates && !errParse){
					callback("", updates);
				} else if (errParse) {
	
					throw errParse || errmsg;
				}
			});
		} else if (errReq) {
			throw responseTvd.statusCode + errReq || errmsg;
		} else {
			throw responseTvd.statusCode || errmsg;
		}
	});
};


//helper to get the a series from theTvDB
exports.req.getSeries= function (seriesId, callback) {
	var errmsg = "D'oh! There went something wrong while get a series from tvd: id:" + seriesId;
	request("http://www.thetvdb.com/api/" + dataSafe.tvdbApiKey + "/series/" + seriesId + "/all", function (errReq, responseTvd, body) {

		if (responseTvd.statusCode == 200 && !errReq) {

			parseString(body, {explicitRoot: false, explicitArray : false}, function (errParse, series) {		
				
				if(series && !errParse){
					callback(series);
				} else if (errParse) {
					throw errParse || errmsg; 
				}
			});
		} else if (errReq) {
			throw responseTvd.statusCode + errReq || errmsg;
		} else {
			throw responseTvd.statusCode || errmsg;
		}
	});
};



/******************************
===== own assert function =====
*******************************/
exports.myAssert = function (body2parse, defined2parse, callback) {

	// console.log(body2parse);
	// console.log(defined2parse);
	

	//safe clone  of data --> new objects for deletions
	var body = JSON.parse(JSON.stringify(body2parse));
	var defined = JSON.parse(JSON.stringify(defined2parse));
	delete body._id;
	delete body.__v;

	// console.log("Assert body:".green);
	// console.log(body);
	// console.log("Assert defined:".green);
	// console.log(defined);

	if (body.hasOwnProperty("series")) {
		for (var i=0; i<body.series.length; i++) {
			delete body.series[i]._id;

			if (body.series[i].hasOwnProperty("episodes")) {
				for (var j=0; j<body.series[i].episodes.length; j++ ) {
					delete body.series[i].episodes[j]._id;
				}
			}
	 	}
	}

	if (body.hasOwnProperty("episodes")) {
		for (var i=0; i<body.episodes.length; i++) {
			delete body.episodes[i]._id;
		}
	}

	assert.deepEqual(body,defined);
	
	//optional callback
	if (typeof callback === 'function') {
		callback();
	} 
};





/******************************
====== insert functions =======
*******************************/
//helpers for mongoose safe functions
exports.insert = {};

exports.insert.user = function (user2save, callback) {
	var user = new User(user2save);
	user.save(function (err, storedUser) {		
		if (storedUser && !err) {
			callback ();
		} 
		else if(storedUser === null){
			throw ("insert user failed");
		}
		else {
			throw (err);
		}
	});
};


exports.insert.series = function (series2save, callback) {
	var series = new Series(series2save);
	series.save(function (err, storedSeries) {		
		if (storedSeries && !err) {
			callback ();
		} 
		else if(storedSeries === null){
			throw ("insert series failed");
		}
		else {
			throw (err);
		}
	});
};





/******************************
========= safer clone =========
*******************************/
exports.cloneSafe = function (object) {
	return  JSON.parse(JSON.stringify(object));
};




/******************************
===== safe for function =======
*******************************/
//enables a safe for loop with a function, asynchronous or synchronous
exports.forFunctionSafe  = function (startingNr, arrayLength, callback, finalCallback) {
	var i = startingNr;
	var wasLastOne = false;

	function looper () {
		if (i < arrayLength) {
			callback (i++,looper);
		} else {
			if (!wasLastOne) {
				wasLastOne = true;
				finalCallback();
			}
		}
	}	

	looper();
};


/******************************
===  convert series for user ===
*******************************/
exports.convertSeriesForUser = function (series2Store){
	//console.log(series2Store);
	
	var userSeriesEpisodes = [];

	for(var i=0; i<series2Store.Episode.length; i++){
		if (_.has(series2Store.Episode[i], "id")) {
			var episode = {
				"id" : series2Store.Episode[i].id,
				"w" : false,
				"n" : series2Store.Episode[i].EpisodeName,
				"sNr" : series2Store.Episode[i].SeasonNumber,
				"eNr" : series2Store.Episode[i].EpisodeNumber
			};
			userSeriesEpisodes.push(episode);
		} 
	}

	var userSeries = {
		"name" : series2Store.Series.SeriesName,
		"id" : series2Store.Series.id,
		"bannerUrl" : "",
		"episodes" : userSeriesEpisodes
	};

	if(series2Store.Series.fanart){
		userSeries.bannerUrl = "http://thetvdb.com/banners/" + series2Store.Series.fanart;
	}
	else if(series2Store.Series.banner){
		userSeries.bannerUrl = "http://thetvdb.com/banners/" + series2Store.Series.banner;	
	}
	else{
		userSeries.bannerUrl = "";
	}

	return userSeries;
};




/******************************
===== findOne functions =======
*******************************/
//helpers for mongoose findOne functions
exports.findOne = {};

exports.findOne.user = function (token, callback) {
	User.findOne({"token": token}, function (errLoad, resultUser){
		if(resultUser && !errLoad){
			callback(resultUser);
		}
		else if(resultUser === null){
			var errorMessage = 'Error: ' + token + ' (User) not found';			
			throw errorMessage;
		}
		else{
			throw errLoad;
		}		
	});
};


exports.findOne.series = function (seriesId, callback) {
	Series.findOne({"id": seriesId}, function (errLoad, resultSeries){
		if(resultSeries && !errLoad){
			callback(resultSeries);
		}
		else if(resultSeries === null){
			var errorMessage = 'Error: ' + seriesId + ' (Series) not found';			
			throw errorMessage;
		}
		else{
			throw errLoad;
		}		
	});
};

