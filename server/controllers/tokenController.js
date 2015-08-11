require('../models/userModel');
var mongoose = require('mongoose');
var User = mongoose.model('User');


/**
 * tokenController.verify function is before every action called where user date or authentication is needet.
 * The function serachs in the mongoDB for an corresponding user to a token.
 * If there is one and this user is also validatet, the controller responds the user.
 * For easy and clear checking for an correct user, it also responds via boolean if the verification was successsfully or not.
 * @param  {String}   token     the token to check for
 * @param  {Function} callback  responds the user if verification was successfully.
 */
exports.verify = function (token, callback) {
	User.findOne({"token":token}, function (err, resultUser){
		if(resultUser && !err){
			if (resultUser.token == token && resultUser.validated) {
				callback(true, resultUser);
			} else {
				callback(false);
			}			
		}
		else if(resultUser === null){
			callback(false);
		}
		else {
			console.log('err', err);
			callback(false);
		}
	});	
};