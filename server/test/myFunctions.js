var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
var colors = require('colors');

//models
require('../models/userModel');
var User = mongoose.model('User');

require('../models/seriesModel');
var Series = mongoose.model('Series');

//own dependencies
var config = require('../config.json');
var data =  require('./testData.json');



//logging to console?
var clog = false;


//url used in supertest requests
var url = config.testRestUrl;
var mongoUrl = config.dbTestUrl;




/******************************
====== request function =======
*******************************/
exports.req = {};

exports.req.post = function (data2send, route, status, callback) {
	request(url)
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


exports.req.get = function (data2send, route, status, callback) {
	request(url)
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

exports.req.put = function (data2send, route, status, callback) {
	request(url)
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

exports.req.delete = function (data2send, route, status, callback) {
	request(url)
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




/******************************
===== own assert function =====
*******************************/
exports.myAssert = function (body2parse, defined2parse, callback) {
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
	callback();
};





/******************************
====== insert functions =======
*******************************/
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



