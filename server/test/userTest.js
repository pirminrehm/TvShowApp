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
				console.log(res.body);
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
				console.log(res.body);
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
				console.log(res.body);
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
	insert.user (data.accTest, function() { 
		server.close(function() {
			console.log("  Success: close Connection \n".green);  
			done();
		});
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
		this.timeout(5000);
		it('should post the mail tvshowapp-test1@7kw.de', function(done){ 
			req.post(data.acc1, "/usr/register", 200, function(body) {
				myAssert (body.message, "You should recieve an Email with your login token",  done);
			});
		});

		it('should post the mail tvshowapp-test2@7kw.de', function(done) {
			req.post(data.acc2, "/usr/register", 200, function(body) {
				myAssert (body.message, "You should recieve an Email with your login token",  done);
			});
		});

		describe('Failure'.yellow, function() {
			beforeEach(function(done) {
				insert.user (data.acc1, function() { done(); });
			});

			it('should not create an account for tvshowapp-test1@7kw.de', function(done) {
				req.post(data.acc1, "/usr/register", 500, function(body) {
					myAssert (body.error, "For this email an account already exists",  done);
				});
			});
		});
	});


	describe('User Verification'.yellow, function() {
		beforeEach(function(done) {
			insert.user (data.acc1, function() { insert.user (data.acc2,  done); });
		});
			
		it('should verify tvshowapp-test2@7kw.de', function(done) {
			req.get("", "/usr/register/verify/"+data.acc2.token, 200, function(body) {
				var valUser = data.acc2;
				valUser.validated = true;
				myAssert (body, valUser,  done);
			});
		});

		it('should not verify tvshowapp-test1@7kw.de because it already is', function(done) {
			req.get("", "/usr/register/verify/"+data.acc1.token, 500, function(body) {
				myAssert (body.error, "Your token is already validated for " + data.acc1.email,  done);
			});
		});

		it('should not verify an not existing token', function(done) {
			req.get("", "/usr/register/verify/"+"ab", 500, function(body) {
				myAssert (body.error, "We could't find your user token",  done);
			});
		});

	});


	describe('User Operations'.yellow, function() {
		describe('add series'.yellow, function() {	
			beforeEach(function(done) {
				insert.user (data.acc1,  done);
			});
			describe('which is already in the mongo', function() {	
				beforeEach(function(done) {
					insert.series (data.houseOfCards[0], done);
				});
				it('should add a new series to user 1', function(done) {
					req.get("", "/usr/token/"+ data.acc1.token + "/series/"+ data.houseOfCards.Series.id, 200, function(body) {
						myAssert(body, data.acc4.series[0],  done); //acc1 + series = acc4
					});
				});
			});
			describe('which is not yet in the mongo', function() {	
				this.timeout(5000);
				it('should add a new series to user 1', function(done) {
					req.get("", "/usr/token/"+ data.acc1.token + "/series/"+ data.houseOfCards.Series.id, 200, function(body) {
						myAssert(body,  data.acc4.series[0] ,  done);  //acc1 + series = acc4
					});
				});
			});
			describe('failures', function() {	
				//special case: just possible if a series is deleted from the mongo, but the user hat it still
				describe('add series again which is not yet in the mongo', function() {
					beforeEach(function(done) {
						insert.user (data.acc3,  done);//acc3 = user2 but verified and with one series
					});
					it('should try to add a series again', function(done) {
						req.get("", "/usr/token/"+ data.acc3.token + "/series/"+data.acc3.series[0].id, 500, function(body) {
							myAssert(body.error, "Series already in users list",  done);	
						});
					});
				});
				//common case
				describe('add series again which is alreade in the mongo', function() {
					beforeEach(function(done) {
						insert.user (data.acc3, function() { insert.series (data.houseOfCards, function() {  done(); }); }); //acc3 = acc2 but verified and with one series
					});
					it('should try to add a series again', function(done) {
						req.get("", "/usr/token/"+ data.acc3.token + "/series/"+data.acc3.series[0].id, 500, function(body) {
							myAssert(body.error, "Series already in users list",  done);	
						});
					});
				});

				it('should try to get a series with wrong id', function(done) {
					req.get("", "/usr/token/"+ data.acc1.token + "/series/1", 500, function(body) {
						myAssert(body.error, "Error: seriesId not found", done);
					});
				});

				it('should try to get a series with wrong token', function(done) {
					req.get("", "/usr/token/"+ "blub" + "/series/"+ data.houseOfCards.Series.id, 500, function(body) {
						myAssert(body.error, "We could't find your user token", done);
					});
				});
			});

		});

		describe('remove series'.yellow, function() {	
			describe('from user 2', function() {
				beforeEach(function(done) {
					insert.user (data.acc6, function() { done(); }); //acc3 = user2 but verified and with one series
				});
				it('should remove a series from user 1', function(done) {
					req.delete("", "/usr/token/"+ data.acc6.token + "/series/"+ data.acc6.series[1].id, 200, function(body) {
						myAssert(body, data.acc4,  done); //acc 3 - series = acc5
					});
				});

				it('should remove two series from user 1', function(done) {
					req.delete("", "/usr/token/"+ data.acc6.token + "/series/"+ data.acc6.series[1].id, 200, function(body) {
						req.delete("", "/usr/token/"+ data.acc6.token + "/series/"+ data.acc6.series[0].id, 200, function(body) {
							myAssert(body, data.acc1, done); //acc 3 - series = acc5
						});
					});
				});
			});	

			describe('failures', function() {
				beforeEach(function(done) {
					insert.user (data.acc1, function() { done(); });
				});	
				it('should try to remove a series with wrong id', function(done) {
					req.delete("", "/usr/token/"+ data.acc1.token + "/series/1", 500, function(body) {
						myAssert(body.error, "Error: seriesId not found",  done);
					});
				});

				it('should try to remove a series with wrong token', function(done) {
					req.delete("", "/usr/token/"+ "blub" + "/series/"+ data.houseOfCards.Series.id, 500, function(body) {
						myAssert(body.error, "We could't find your user token",  done);
					});
				});
			});
		});

		describe('get user'.yellow, function() {
			beforeEach(function(done) {
				insert.user (data.acc6,  done);
			});
			describe('successfull', function() {	
				it('should get the whole user', function(done) {
					req.get("", "/usr/token/"+ data.acc6.token + "/user/all", 200, function(body) {
						myAssert (body,data.acc6,  done);
					});
				});
			});
			describe('failures', function() {	
				it('should try to get the user with wrong token', function(done) {
					req.get("", "/usr/token/"+ "blub" + "/user/all", 500, function(body) {
						myAssert(body.error, "Error: User not found",  done);
					});
				});
			});
		});

		describe('mark an episode'.yellow, function() {	
			beforeEach(function(done) {
				insert.user (data.acc7,  done);
			});

			describe('as watched', function() {
				it('should mark an episode (index:0) from an series (index:0) as watched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ true +"/episode/"+ data.acc7.series[0].episodes[0].id , 200, function(body) {
						myAssert (body.series[0].episodes[0].w, true,  done);
					});
				});
				it('should mark an episode (index:5) from an series (index:0) as watched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ true +"/episode/"+ data.acc7.series[0].episodes[5].id , 200, function(body) {
						myAssert (body.series[0].episodes[5].w, true, done);
					});
				});
				it('should mark an episode (index:1) from an series (index:1) as watched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ true +"/episode/"+ data.acc7.series[1].episodes[1].id , 200, function(body) {
						myAssert (body.series[1].episodes[1].w, true,  done);
					});
				});
				it('should mark an episode (index:6) from an series (index:1) as watched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ true +"/episode/"+ data.acc7.series[1].episodes[6].id , 200, function(body) {
						myAssert (body.series[1].episodes[6].w, true,  done);
					});
				});
			});

			describe('as unwatched', function() {
				it('should mark an episode (index:1) from an series (index:0) as unwatched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ false +"/episode/"+ data.acc7.series[0].episodes[1].id , 200, function(body) {
						myAssert (body.series[0].episodes[1].w, false,  done);
					});
				});
				it('should mark an episode (index:2) from an series (index:0) as unwatched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ false +"/episode/"+ data.acc7.series[0].episodes[2].id , 200, function(body) {
						myAssert (body.series[0].episodes[2].w, false,  done);
					});
				});
				it('should mark an episode (index:1) from an series (index:1) as unwatched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ false +"/episode/"+ data.acc7.series[1].episodes[1].id , 200, function(body) {
						myAssert (body.series[1].episodes[1].w, false,  done);
					});
				});
				it('should mark an episode (index:2) from an series (index:1) as unwatched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ false +"/episode/"+ data.acc7.series[1].episodes[2].id , 200, function(body) {
						myAssert (body.series[1].episodes[2].w, false,  done);
					});
				});
			});

			describe('failures', function() {
				it('should try to mark an episode as unwatched with wrong episode id', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ false +"/episode/"+ "00" , 500, function(body) {
						myAssert (body.error,"Error: episodeId not found",  done);
					});
				});

				it('should try to mark an episode as unwatched with wrong token', function(done) {
					req.put("", "/usr/token/"+ "blub" + "/watched/"+ false +"/episode/"+ "00" , 500, function(body) {
						myAssert (body.error,"We could't find your user token",  done);
					});
				});

			});
		});

		describe('mark an season'.yellow, function() {	
			beforeEach(function(done) {
				insert.user (data.acc3,  done);
			});
			describe('as watched', function() {
				it.skip('should mark all episodes of an season as watched', function(done) {
					req.put("", "/usr/token/"+ data.acc3.token + "/watched/"+ true +"/season/"+ data.acc3.series[0].episodes[0].season , 200, function(body) {
						myAssert (body, data.acc8,  done);
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