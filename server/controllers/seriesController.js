require('../models/seriesModel');
var mongoose = require('mongoose');
var parseString = require('xml2js').parseString;
var _ = require('underscore');
var request = require('request');

var dataSafe = require('../../private/dataSafe.json');
var tokenController = require('./tokenController');

var Series = mongoose.model('Series');


//logging in der console
var clog = false;


/*
Sends the search-request to theTvDB, parses the response from xml to json and sends the result back
 */
exports.search = function(req, res){
	var url = "http://www.thetvdb.com/api/GetSeries.php?seriesname=" + req.params.searchString;
	if (clog) console.log("search=" + url);
	if (clog) console.log('url', url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			parseString(body, {explicitRoot: false, explicitArray : false} ,function (err, result) {		
				res.jsonp(result); 
			});
	  	} else if (error) {
			res.status(500).jsonp({"error" : error});
		} else {
			if (!response.statusCode) {
				response.statusCode = "undefined";
			}
			res.status(500).jsonp({"error" : "Error in search request, status: " + response.statusCode});
		}
	});
};


/*
Responds the whole series identified by the seriesId
 */
exports.getSeriesDetails = function(req, res){
	tokenController.verify(req.params.token, function (verified, user) {
		if (verified) {
			var seriesId = req.params.seriesId;
			Series.findOne({'Series.id':seriesId}, function (errLoadSeries, resultSeries){
				if(resultSeries && !errLoadSeries){
					res.send(resultSeries.Series);
				} else if(resultSeries === null){
					res.status(500).jsonp({"error":"Error: seriesId not found"});
				} else{
					res.status(500).jsonp({"error" : errLoadSeries});
				}
			});
		} else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});
};


/*
Responds only one episode of a series
 */
exports.getEpisodeDetails = function(req, res){
	tokenController.verify(req.params.token, function (verified, user) {
		if (verified) {
			var episodeId = req.params.episodeId;
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
					} else{
						res.status(500).jsonp({"error":"Error: episodeId not found"});
					}
				} else if(resultSeries === null){
					res.status(500).jsonp({"error":"Error: episodeId not found"});
				} else{
					res.status(500).jsonp({"error" : errLoadSeries});
				}
			});
		} else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});
};

/**
 * This function is only provided for other controllers and not accessible from outside
 * It Responds the whole series, if the series is not in the mongoDB yet, it will load it from theTvDB
 * @param  {String}   seriesId Id of the requested series
 * @param  {Function} callback responds the series or an error
 */
exports.loadOrImportSeries = function (seriesId, callback) {
	Series.findOne({'Series.id':seriesId}, function (errLoadSeries, resultSeries){
		if(resultSeries && !errLoadSeries){
			if(clog) console.log('Series found in Series DB collection');
			callback(resultSeries);					
		}
		else if(resultSeries === null){
			if(clog) console.log('Have to retrieve series from tvd');
			var url = "http://www.thetvdb.com/api/" + dataSafe.tvdbApiKey + "/series/" + seriesId + "/all";
			request(url, function (errReq, responseTvd, body) {
				if (responseTvd.statusCode == 200 && !errReq) {
					parseString(body, {explicitRoot: false, explicitArray : false}, function (errParse, resultJSON) {		
						if(resultJSON && !errParse){
							var series = new Series(resultJSON);
							series.save(function (errSaveSeries, storedSeries){
								if(storedSeries && !errSaveSeries){
									if (clog) console.log('Success: store "' + storedSeries.Series.SeriesName +  '" in Series DB collection');							
									callback(storedSeries);
								} else if(storedSeries === null){
									callback("", "Error: store series retrieved from TvD failed");
								} else{
									callback("", errSaveSeries);
								}
							});
						} else if(resultJSON === null){
							callback("", "Error: parsing response from TvD into JSON failed");
						} else{
							callback("", errParse);
						}
					});
				} else if(responseTvd.statusCode == 404){
					callback("", "Error: seriesId not found");
				} else{
					callback("", errReq);
				}
			});
		} else{
			callback("", errLoadSeries);
		}
	});
};