require('../models/userModel');

var mongoose = require('mongoose');
var _ = require('underscore');

var UserModel = mongoose.model("UserModel");


exports.post = function(req, res) {
	var user = new UserModel(req.body);

	user.userLoginToken = "wird überschrieben";

	//console.log ("\n" + user + "\n");
	user.save();
	res.jsonp(user);
};


exports.show = function(req, res) {
	UserModel.load(req.params.userId, function (err, user) {
		res.jsonp(user)
	});
};


exports.put = function(req, res) {
	UserModel.load(req.params.userId, function (err, user) {

		user = _.extend(user, req.body);




		user.save(function(err) {
			res.jsonp(user);
		});
	});
};


exports.delete = function(req, res) {
	UserModel.load(req.params.userId, function (err, user) {
		user.remove(function (err) {
			res.jsonp(user);
		});	
	});
};



/*
Annahme, dass folgendes nur zum Test war, deswegen auskommentiert:

exports.get = function(req, res) {
	UserModel.find().exec(function (err, user) {
		res.jsonp(user)
	});
};



*/