var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
var winston = require('winston');


var url = 'http://localhost:3000';

var data = {
	 profil1 : {
	  	userId: 100123,
		userLoginToken: "abcdefg133562abcd",
		name: "Testo Testan",
		series: null
	  },

	profil2 : {
	  	userId: 100567,
		userLoginToken: "oipioiop879789oipoiiop",
		name: "Maxi Mustermann",
		series: null
	  }
}


 
describe('Init', function() {

    before(function (done) {   
        mongoose.connect('mongodb://localhost/testdb', function(){
            mongoose.connection.db.dropDatabase(function(){
            	console.log("  Success: dropDatabase \n");
                done()
            })
            
    	})

	})


	describe('New User 1', function() {
		it('should insert User 1', function(done) {

		request(url)
		.post('/user')
		.send(data.profil2)
		.expect(200) //Status code
		.expect('Content-Type', /json/) //ist es json?
		.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
		.end(function(err, res) {
		      if (err) {
		        throw err;
		      }


		      data.user2_id = res.body._id;
		      
		      res.should.have.status;
		      res.status.should.be.exactly(200);  
		      done();
		    });
		});
	});



	describe('New User 2', function() {
		it('should insert User 2', function(done) {

		request(url)
		.post('/user')
		.send(data.profil1)
		.expect(200) //Status code
		.expect('Content-Type', /json/) //ist es json?
		.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
		.end(function(err, res) {
		      if (err) {
		        throw err;
		      }


		      data.userId1 = res.body._id;
		      
		      res.should.have.status;
		      res.status.should.be.exactly(200);  
		      done();
		    });
		});
	});



	describe('Get User 1', function() {
		it('should get the User 1', function(done) {


		request(url)
		.get('/user/' + data.userId1)
		.expect(200) //Status code
		.expect('Content-Type', /json/) //ist es json?
		.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
		.end(function(err, res) {
		      if (err) {
		        throw err;
		      }

		    


		      assert.equal(data.profil1.userId, res.body.userId, "userId stimmt nicht überein");
		      assert.notEqual(data.profil1.userLoginToken, res.body.userLoginToken, "userLoginToken wurde nicht überschrieben");
		      assert.equal(data.profil1.name, res.body.name, "name stimmt nicht überein");
		      assert.equal(data.profil1.series, res.body.series, "series stimmt nicht überein");




		      
		      res.should.have.status;
		      res.status.should.be.exactly(200);     
		      done();
		    });
		});
	});


	describe('Insert User 1 agin', function() {
			it('should not insert User 1, is already inserted', function(done) {

			request(url)
			.post('/user')
			.send(data.profil1)
			.expect(200) //Status code
			.expect('Content-Type', /json/) //ist es json?
		.expect('Content-Type', 'application/json; charset=utf-8' ) //ist es utf8?
			.end(function(err, res) {
			      if (err) {
			        throw err;
			      }
			      
			      res.should.have.status;
			      res.status.should.be.exactly(400);  
			      done();
			    });
			});
		});
});

