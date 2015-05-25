require('../models/seriesModel');
var mongoose = require('mongoose');
var parseString = require('xml2js').parseString;

// var Series = mongoose.model("Serie");	/*To Do!!*/

var _ = require('underscore');
var request = require('request');

var config = require('../config.json');


exports.search = function(req, res){

	var url = "http://www.thetvdb.com/api/GetSeries.php?seriesname=" + req.params.searchString + "&language=fr";

	console.log('url', url);

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			 console.log('body:  \n',body);	
			parseString(body, {explicitRoot: false, explicitArray : false} ,function (err, result) {		
				res.jsonp(result); 
			});
	  	}
	});
};


exports.getSeriesDetails = function(req, res){
	console.log('in getSeriesDetails');
};


exports.getEpisodeDetails = function(req, res){
	console.log('in getEpisodeDetails');
};