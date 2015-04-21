require('../models/serie');
var mongoose = require('mongoose');
var Serie = mongoose.model("Serie");
var _ = require('underscore');

exports.post = function(req, res) {
	var serie = new Serie(req.body);
	serie.save();
	res.jsonp(serie);
};

exports.get = function(req, res) {
	Serie.find().exec(function (err, serie) {
		res.jsonp(serie)
	});
};

exports.show = function(req, res) {
	Serie.load(req.params.serieId, function (err, serie) {
		res.jsonp(serie)
	});
};


exports.put = function(req, res) {
	Serie.load(req.params.serieId, function (err, serie) {

		serie = _.extend(serie, req.body);


		serie.save(function(err) {
			res.jsonp(serie);
		});
	});
};


exports.delete = function(req, res) {
	Serie.load(req.params.serieId, function (err, serie) {
		serie.remove(function (err) {
			res.jsonp(serie);
		});	
	});
};