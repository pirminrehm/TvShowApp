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


/******************************
====== config variables =======
*******************************/
var mongoUrl = config.dbTestUrl;



before(function (done) {
	mongoStart.connect(mongoUrl, function(success) {
		if (success) {
			console.log("Success: Connected MongoDB ".green +"(Database: " +  mongoUrl + ")");
			loggingStart.setLogging (false, function() {
				server.listen( function () {
					console.log("Success: Server is listening".green);
					done();
				});
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
			mongoStart.close(function() {
				console.log("Success: Closed connection to MongoDB ".green);
				done();
			});
		});
	});	
});


beforeEach(function (done) {
        mongoose.connection.db.dropDatabase(function(){
        	//console.log("  Success: dropDatabase \n".green);  
            done();
    	});
});
