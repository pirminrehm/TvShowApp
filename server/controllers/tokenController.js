require('../models/userModel');
var mongoose = require('mongoose');
var User = mongoose.model('User');



exports.verify = function (token, callback) {

	User.findOne({"token":token}, function (err, resultUser){
		if(resultUser && !err){
			if (resultUser.token == token && resultUser.validated) {
				callback(true, resultUser);
			} else {
				callback(false, resultUser);
			}
			
		}
		else if(resultUser === null){
			callback(false, resultUser);

		}
		else {
			console.log('err', err);
			callback(false, resultUser);
		}
	});

	
};