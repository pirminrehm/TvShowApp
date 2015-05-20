var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
var colors = require('colors');
var config = require('../config.json');


var data =  require('./testData.json');
var server = require('../bin/www');


//logging to console?
var clog = false;

var url = config.testRestUrl;

var displayErrorMsg = false;


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



 
describe('Test:', function() {

    before(function (done) {

		server.listen(function() {console.log(" Success: listen".green);});

		mongoose.connection.on('open', function(){
	        mongoose.connection.db.dropDatabase(function(){
	        	console.log("  Success: dropDatabase \n".green);  
	            done();
	    	});
		});
	});

	after(function(done){
		server.close(function() {
			console.log("  Success: close Connection \n".green);  
			done();
		});
	});


	describe('Post Register Account'.yellow, function() {

			it('should create an account for tvshowapp-test1@7kw.de', function(done) {
			request(url)
			.post('/usr/register')
			.send(data.acc1)
			.expect(200) //Status code
			.expect('Content-Type', /json/) //ist es json?
			.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
			.end(function(err, res) {
			      if (err) {
			        throw err;
			      }

			      if (clog) console.log (res.body);

			      data.acc1.token = res.body.token;

			      done();

			    });
			});

			it('should create an account for tvshowapp-test2@7kw.de', function(done) {
			request(url)
			.post('/usr/register')
			.send(data.acc2)
			.expect(200) //Status code
			.expect('Content-Type', /json/) //ist es json?
			.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
			.end(function(err, res) {
			      if (err) {
			        throw err;
			      }

			      if (clog) console.log (res.body);

			      data.acc2.token = res.body.token;
			     

			      done();

			    });
			});

			it('should not create an account for p@7kw.de', function(done) {
			request(url)
			.post('/usr/register')
			.send(data.acc1)
			.expect(500) //Status code
			.expect('Content-Type', /json/) //ist es json?
			.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
			.end(function(err, res) {
			      if (err) {
			        throw err;
			      }

			      if (clog) console.log (res.body);

			      done();

			    });
			});


			it('should not create an account for foobar@7kw.de', function(done) {
			request(url)
			.post('/usr/register')
			.send(data.acc3)
			.expect(500) //Status code
			.expect('Content-Type', /json/) //ist es json?
			.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
			.end(function(err, res) {
			      if (err) {
			        throw err;
			      }

			      if (clog) console.log (res.body);

			      done();

			    });
			});


			it('should verify tvshowapp-test1@7kw.de', function(done) {
			request(url)
			.get('/usr/register/verify/'+data.acc1.token)
			.expect(200) //Status code
			.expect('Content-Type', /json/) //ist es json?
			.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
			.end(function(err, res) {
			      if (err) {
			        throw err;
			      }

			      if (clog) console.log (res.body);

			      done();

			    });
			});


			it('should not verify tvshowapp-test1@7kw.de because it already is', function(done) {
			request(url)
			.get('/usr/register/verify/'+data.acc1.token)
			.expect(500) //Status code
			.expect('Content-Type', /json/) //ist es json?
			.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
			.end(function(err, res) {
			      if (err) {
			        throw err;
			      }

			      if (clog) console.log (res.body);

			      done();

			    });
			});



			it('should not verify an not existing token', function(done) {
			request(url)
			.get('/usr/register/verify/'+"ab")
			.expect(500) //Status code
			.expect('Content-Type', /json/) //ist es json?
			.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
			.end(function(err, res) {
			      if (err) {
			        throw err;
			      }

			      if (clog) console.log (res.body);

			      done();

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

	});
});