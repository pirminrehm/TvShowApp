require('../models/seriesModel');
var mongoose = require('mongoose');
<<<<<<< HEAD
// var Series = mongoose.model("Serie");	/*To Do!!*/
=======
//var Series = mongoose.model("Serie");	/*To Do!!*/
>>>>>>> 980a4020f10c97f21a5fbb44a141ba396388cb57
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

