require('../models/seriesModel');
var mongoose = require('mongoose');

// var Series = mongoose.model("Serie");	/*To Do!!*/

var _ = require('underscore');
var request = require('request');

var config = require('../config.json');


exports.search = function(req, res){

	var url = "http://www.thetvdb.com/api/GetSeries.php?seriesname=" + req.params.searchString;

	console.log('url', url);

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// console.log('body',body);			
			res.send(body); 
	  	}
	});
};

