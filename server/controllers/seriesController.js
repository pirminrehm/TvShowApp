require('../models/seriesModel');
var mongoose = require('mongoose');
var parseString = require('xml2js').parseString;
var _ = require('underscore');
var request = require('request');

var tokenController = require('./tokenController');

var Series = mongoose.model('Series');


//logging in der console???
var clog = false;


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

	var seriesId = req.params.seriesId;

	tokenController.verify(req.params.token, function (verified, user) {
		if (verified) {
			if(clog) console.log("Access to restricted area granted");
			
			Series.findOne({'Series.id':seriesId}, function (errLoadSeries, resultSeries){
				if(resultSeries && !errLoadSeries){
					res.send(resultSeries.Series);
				}
				else if(resultSeries === null){
					res.status(500).jsonp({"error":"Error: seriesId not found"});
				}
				else{
					res.status(500).jsonp({"error" : errLoadSeries});
				}
			});
		}
		else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});
};


exports.getEpisodeDetails = function(req, res){

	var episodeId = req.params.episodeId;

	tokenController.verify(req.params.token, function (verified, user) {
		if (verified) {
			if(clog) console.log("Access to restricted area granted");
			
			Series.findOne({'Episode.id':episodeId}, function (errLoadSeries, resultSeries){
				if(resultSeries && !errLoadSeries){

					var foundInEpisodes = -1;

					for(var i=0; i<resultSeries.Episode.length; i++){
						if(resultSeries.Episode[i].id == episodeId){
							foundInEpisodes = i;
							break;
						}
					}

					if(foundInEpisodes >= 0){
						res.send(resultSeries.Episode[foundInEpisodes]);
					}
					else{
						res.status(500).jsonp({"error":"Error: episodeId not found"});
					}
				}
				else if(resultSeries === null){
					res.status(500).jsonp({"error":"Error: episodeId not found"});
				}
				else{
					res.status(500).jsonp({"error" : errLoadSeries});
				}
			});
		}
		else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});
};