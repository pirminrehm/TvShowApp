require('../models/userModel');
var mongoose = require('mongoose');
var User = mongoose.model('User');



exports.verify = function (token, ret) {

	User.findOne({"token":token}, function (err, resultUser){
		if(resultUser && !err){
			if (resultUser.token == token && resultUser.validated) {
				ret(true);
			} else {
				ret(false);
			}
			
		}
		else if(resultUser === null){
			ret(false);

		}
		else {
			console.log('err', err);
			ret(false);
		}
	});

	
};