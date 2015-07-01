var mongoose = require('mongoose');


exports.connect = function (mongoUrl, callback) {

	mongoose.connect(mongoUrl);
	var db = mongoose.connection;

	db.on('error', function (err) {
		console.log(err);
		callback(false);
	});


	db.on('open', function () {
		callback(true);
	  
	});


};

exports.close = function (callback) {
	mongoose.connection.close( function () {
		callback();
	});
};


