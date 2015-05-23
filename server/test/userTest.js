var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
var colors = require('colors');

//models
require('../models/userModel');
var User = mongoose.model('User');

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
		      if (err) {
		        throw err;
		      }
		      callback(res.body);
		});
};

req.delete = function (data2send, route, status, callback) {
	request(url)
		.post(route)
		.expect(status) //Status code
		.expect('Content-Type', /json/) //ist es json?
		.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
		.end(function(err, res) {
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
	//is there at least one episode
	/*
	if (body.series.length !== 0) {
		if (body.series[0].episodes) {
			for (var i; i<body.series.length; i++) {
				for (var j; j<body.series[i].episodes.length; j++ ) {
					delete body.series[i].episodes[j]._id;
				}
			}
		}
 	}
 	*/
	assert.equal(body,defined);
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
	describe('Mail for registration '.yellow, function() {
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
	});

	describe('Send a registred mail for registraton'.yellow, function() {
		beforeEach(function(done) {
			insert.user (data.acc1, function() { done(); });
		});

		it('should not create an account for tvshowapp-test1@7kw.de', function(done) {
			req.post(data.acc1, "/usr/register", 500, function(body) {
				myAssert (body.error, "For this email an account already exists", function () {done() ;});
			});
		});
	});


	describe('Verify Accounts'.yellow, function() {
		beforeEach(function(done) {
			insert.user (data.acc1, function() { insert.user (data.acc2, function() { done(); }); });
		});
			
		it('should verify tvshowapp-test2@7kw.de', function(done) {
			req.get("", "/usr/register/verify/"+data.acc2.token, 200, function(body) {
				myAssert (body, "Your account is now verified", function () {done() ;});
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
});







/*


			it('daten von tvd holen', function(done) {
			request(url)
			.get('/series/searchresult/search/' + "big%20bang")
			.expect(200) //Status code
			//.expect('Content-Type', /json/) //ist es json?
			//.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
			.end(function(err, res) {
			      if (err) {
			        throw err;
			      }

			      console.log (res.body);

			      done();

			    });
			});



*/




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