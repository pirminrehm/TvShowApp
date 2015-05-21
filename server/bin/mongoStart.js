var mongoose = require('mongoose');


exports.connect = function (mongoUrl, callback) {

	mongoose.connect(mongoUrl);
	var db = mongoose.connection;

	db.on('error', function () {
		callback(false);
	});


	db.on('open', function () {
		callback(true);
	  
	});


};


