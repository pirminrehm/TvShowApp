var should = require('should'); 
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
var server = require('../bin/www');
var mongoStart = require('../bin/mongoStart');




/******************************
====== config variables =======
*******************************/

//logging to console?
var clog = false;


//url used in supertest requests
var url = config.testRestUrl;
var mongoUrl = config.dbTestUrl;




/******************************
====== request function =======
*******************************/
var req = {};

req.post = function (data2send, route, status, callback) {
	request(url)
		.post(route)
		.send(data2send)
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


req.get = function (data2send, route, status, callback) {
	request(url)
		.get(route)
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

req.put = function (data2send, route, status, callback) {
	request(url)
		.put(route)
		.send(data2send)
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

req.delete = function (data2send, route, status, callback) {
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
var myAssert = function (body, defined, callback) {
	delete body._id;
	delete body.__v;

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

	assert.deepEqual(body,defined);
	callback();
};





/******************************
====== insert functions =======
*******************************/
var insert = {};

insert.user = function (user2save, callback) {
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


insert.series = function (series2save, callback) {
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
========== main test ==========
*******************************/
before(function (done) {
	mongoStart.connect(mongoUrl, function(success) {
		if (success) {
			console.log("Success: Connected MongoDB ".green +"(Database: " +  mongoUrl + ")");
			server.listen( function () {
				console.log("Success: Server is listening".green);
				done();
			});
		} else {
			throw('Connection to mongoDB refused'.red);

		}
	});
});

after(function (done){
	server.close(function() {
		console.log("  Success: close Connection \n".green);  
		done();
	});
});

beforeEach(function (done) {
        mongoose.connection.db.dropDatabase(function(){
        	//console.log("  Success: dropDatabase \n".green);  
            done();
    	});
});


//main describe over all Tests 
describe('Test:', function() {
	describe('User Registration'.yellow, function() {
		it('should post the mail tvshowapp-test1@7kw.de', function(done){ 
			req.post(data.acc1, "/usr/register", 200, function(body) {
				myAssert (body.message, "You should recieve an Email with your login token", function () {done();});
			});
		});

		it('should post the mail tvshowapp-test2@7kw.de', function(done) {
			req.post(data.acc2, "/usr/register", 200, function(body) {
				myAssert (body.message, "You should recieve an Email with your login token", function () {done();});
			});
		});

		describe('Failure'.yellow, function() {
			beforeEach(function(done) {
				insert.user (data.acc1, function() { done(); });
			});

			it('should not create an account for tvshowapp-test1@7kw.de', function(done) {
				req.post(data.acc1, "/usr/register", 500, function(body) {
					myAssert (body.error, "For this email an account already exists", function () {done() ;});
				});
			});
		});
	});


	describe('User Verification'.yellow, function() {
		beforeEach(function(done) {
			insert.user (data.acc1, function() { insert.user (data.acc2, function() { done(); }); });
		});
			
		it('should verify tvshowapp-test2@7kw.de', function(done) {
			req.get("", "/usr/register/verify/"+data.acc2.token, 200, function(body) {
				var valUser = data.acc2;
				valUser.validated = true;
				myAssert (body, valUser, function () {done() ;});
			});
		});

		it('should not verify tvshowapp-test1@7kw.de because it already is', function(done) {
			req.get("", "/usr/register/verify/"+data.acc1.token, 500, function(body) {
				myAssert (body.error, "Your token is already validated for " + data.acc1.email, function () {done() ;});
			});
		});

		it('should not verify an not existing token', function(done) {
			req.get("", "/usr/register/verify/"+"ab", 500, function(body) {
				myAssert (body.error, "We could't find your user token", function () {done() ;});
			});
		});

	});


	describe('User Operations'.yellow, function() {
		//each user operations test has user 1 
		beforeEach(function(done) {
			insert.user (data.acc1, function() { done(); });
		});

		describe('add series'.yellow, function() {	
			describe('which is already in the mongo', function() {	
				beforeEach(function(done) {
					insert.series (data.houseOfCards, function() {  done(); });
				});
				it('should add a new series to user 1', function(done) {
					req.get("", "/usr/token/"+ data.acc1.token + "/series/"+ data.houseOfCards.Series.id, 200, function(body) {
						should.equal(body.series.length, 1);
						myAssert(body, data.acc4, function() {	 done(); }); //acc1 + series = acc4
					});
				});
			});
			describe('which is not yet in the mongo', function() {	
				it('should add a new series to user 1', function(done) {
					req.get("", "/usr/token/"+ data.acc4.token + "/series/"+ data.houseOfCards.Series.id, 200, function(body) {
						should.equal(body.series.length, 1); 
						myAssert(body, data.acc4, function() {	 done(); });  //acc1 + series = acc4
					});
				});
			});
			describe('failures', function() {	
				it('should try to get a series with wrong id', function(done) {
					req.get("", "/usr/token/"+ data.acc1.token + "/series/1", 500, function(body) {
						myAssert(body.error, "Error: seriesId not found", function() { done(); });	
					});
				});

				it('should try to get a series with wrong token', function(done) {
					req.get("", "/usr/token/"+ "blub" + "/series/"+ data.houseOfCards.Series.id, 500, function(body) {
						myAssert(body.error, "We could't find your user token", function() { done(); });	
					});
				});
			});

		});

		describe('remove series'.yellow, function() {	
			describe('from user 2', function() {
				beforeEach(function(done) {
					insert.user (data.acc3, function() { done(); }); //acc3 = user2 but verified and with one series
				});
				it('should remove a series from user 2', function(done) {
					req.delete("", "/usr/token/"+ data.acc3.token + "/series/"+ data.houseOfCards.Series.id, 200, function(body) {
						should.equal(body.series.length, 0); done();
					});
				});
			});	

			describe('failures', function() {	
				it('should try to remove a series with wrong id', function(done) {
					req.delete("", "/usr/token/"+ data.acc1.token + "/series/1", 500, function(body) {
						myAssert(body.error, "Error: seriesId not found", function() { done(); });	
					});
				});

				it('should try to remove a series with wrong token', function(done) {
					req.delete("", "/usr/token/"+ "blub" + "/series/"+ data.houseOfCards.Series.id, 500, function(body) {
						myAssert(body.error, "We could't find your user token", function() { done(); });	
					});
				});
			});
		});

		describe('get user'.yellow, function() {
			describe('successfull', function() {	
				it('should get the whole user', function(done) {
					req.get("", "/usr/token/"+ data.acc1.token + "/user/all", 200, function(body) {
						myAssert (body,data.acc1, function () {done() ;});
					});
				});
			});
			describe('failures', function() {	
				it('should try to get the user with wrong token', function(done) {
					req.get("", "/usr/token/"+ "blub" + "/user/all", 500, function(body) {
						myAssert(body.error, "Error: User not found", function() { done(); });	
					});
				});
			});
		});

		describe('mark an episode'.yellow, function() {	
			beforeEach(function(done) {
				insert.user (data.acc3, function() { done(); }); //acc3 = user2 but verified and with one series
			});

			describe('as watched', function() {
				it('should mark an episode as watched', function(done) {
					req.put("", "/usr/token/"+ data.acc3.token + "/watched/"+ true +"/episode/"+ data.acc3.series[0].episodes[0].id , 200, function(body) {
						myAssert (body.series[0].episodes[0].watched, true, function () {done() ;});
					});
				});
			});

			describe('as unwatched', function() {
				it('should mark an episode as unwatched', function(done) {
					req.put("", "/usr/token/"+ data.acc3.token + "/watched/"+ false +"/episode/"+ data.acc3.series[0].episodes[1].id , 200, function(body) {
						myAssert (body.series[0].episodes[1].watched, false, function () {done() ;});
					});
				});
			});

			describe('failures', function() {
				it('should try to mark an episode as unwatched with wrong episode id', function(done) {
					req.put("", "/usr/token/"+ data.acc3.token + "/watched/"+ false +"/episode/"+ "00" , 500, function(body) {
						myAssert (body.error,"Error: episodeId not found", function () {done() ;});
					});
				});

				it('should try to mark an episode as unwatched with wrong token', function(done) {
					req.put("", "/usr/token/"+ "blub" + "/watched/"+ false +"/episode/"+ "00" , 500, function(body) {
						myAssert (body.error,"We could't find your user token", function () {done() ;});
					});
				});

			});
		});
	});



	describe('Series based requests'.yellow, function() {
		beforeEach(function(done) {
			insert.user (data.acc1, function() {
				insert.series (data.houseOfCards, function() { done(); });
			});
		});
		describe('get series'.yellow, function() {	
			describe('successfull', function() {
				it('should get meta infos about a series', function(done) {
					req.get("", "/series/token/"+ data.acc1.token + "/series/"+data.houseOfCards.Series.id+"/details", 200, function(body) {
						myAssert (body, data.houseOfCards.Series, function () {done() ;});
					});
				});
			});
			describe('failures', function() {
				it('should try to get meta infos about a series with a wrong series id', function(done) {
					req.get("", "/series/token/"+ data.acc1.token + "/series/"+"00"+"/details", 500, function(body) {
						myAssert (body.error, "Error: seriesId not found" , function () {done() ;});
					});
				});
				it('should try to get meta infos about a series with wrong token', function(done) {
					req.get("", "/series/token/"+ "blub" + "/series/"+"00"+"/details", 500, function(body) {
						myAssert (body.error,"We could't find your user token", function () {done() ;});
					});
				});
			});
		});

		describe('get episode'.yellow, function() {	
			describe('successfull', function() {
				it('should get meta infos about an episode', function(done) {
					req.get("", "/series/token/"+ data.acc1.token + "/episode/"+ data.acc3.series[0].episodes[0].id +"/details", 200, function(body) {
						myAssert (body, data.houseOfCards.Episode[0], function () {done() ;});
					});
				});
			});

			describe('failures', function() {
				it('should try to get meta infos about an episode with a wrong series id', function(done) {
					req.get("", "/series/token/"+ data.acc1.token + "/episode/"+"00"+"/details", 500, function(body) {
						myAssert (body.error, "Error: episodeId not found" , function () {done() ;});
					});
				});
				it('should try to get meta infos about an episode with wrong token', function(done) {
					req.get("", "/series/token/"+ "blub" + "/episode/"+"00"+"/details", 500, function(body) {
						myAssert (body.error,"We could't find your user token", function () {done() ;});
					});
				});
			});
		});
	});
});








/*

var objToStr = function (obj) {
	var output = "\n";
		for (var property in obj) {
			
			if (typeof(obj[property]) === 'object') {
 				output += "  " +property +":"+ objToStr(obj[property]);
			} else {	
				output +="     "+ property + ": " + obj[property]+"; \n";
			}
		}			
	return output;
};


*/