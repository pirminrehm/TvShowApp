require('../models/userModel');

var mongoose = require('mongoose');
var _ = require('underscore');

var UserModel = mongoose.model("UserModel");


exports.post = function(req, res) {
	var user = new UserModel(req.body);
	user.save();
	res.jsonp(user);
};

exports.get = function(req, res) {
	UserModel.find().exec(function (err, user) {
		res.jsonp(user)
	});
};

exports.show = function(req, res) {
	UserModel.load(req.params.serieId, function (err, user) {
		res.jsonp(user)
	});
};


exports.put = function(req, res) {
	UserModel.load(req.params.serieId, function (err, user) {

		user = _.extend(user, req.body);


		user.save(function(err) {
			res.jsonp(user);
		});
	});
};


exports.delete = function(req, res) {
	UserModel.load(req.params.serieId, function (err, user) {
		user.remove(function (err) {
			res.jsonp(user);
		});	
	});
};