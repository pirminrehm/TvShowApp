//node modules
var mongoose = require('mongoose');
var request = require('request');
var colors = require('colors');
var parseString = require('xml2js').parseString;
var _ = require('underscore');

//own dependencies
var dataSafe = require('../../private/dataSafe.json');
var config = require('../config.json');

//models
require('../models/seriesModel');
var Series = mongoose.model('Series');

require('../models/userModel');
var User = mongoose.model('User');


//logging in der console???
var clog = true;


var mongoUrl = config.dbUrl;
var url = "http://www.thetvdb.com/api/" + dataSafe.tvdbApiKey + "/updates/updates_day.xml";



function forFunctionSafe (startingNr, arrayLength, callback, finalCallback) {
	var i = startingNr;
	var wasLastOne = false;

	function looper () {
		if (i < arrayLength) {
			callback (i++,looper);
		} else {
			if (!wasLastOne) {
				wasLastOne = true;
				finalCallback();
			}
		}
	}	

	looper();
}

_.cloneSafe = function (object) {
	return  JSON.parse(JSON.stringify(object));
}



function convertSeriesForUser (series2Store){
	
	var userSeriesEpisodes = [];

	for(var i=0; i<series2Store.Episode.length; i++){
		if (_.has(series2Store.Episode[i], "id")) {
			var episode = {
				"id" : series2Store.Episode[i].id,
				"w" : false,
				"n" : series2Store.Episode[i].EpisodeName,
				"sNr" : series2Store.Episode[i].SeasonNumber,
				"eNr" : series2Store.Episode[i].EpisodeNumber
			};
			userSeriesEpisodes.push(episode);
		} 
	}

	var userSeries = {
		"name" : series2Store.Series.SeriesName,
		"id" : series2Store.Series.id,
		"bannerUrl" : "",
		"episodes" : userSeriesEpisodes
	};

	if(series2Store.Series.fanart){
		userSeries.bannerUrl = "http://thetvdb.com/banners/" + series2Store.Series.fanart;
	}
	else if(series2Store.Series.banner){
		userSeries.bannerUrl = "http://thetvdb.com/banners/" + series2Store.Series.banner;	
	}
	else{
		userSeries.bannerUrl = "";
	}

	return userSeries;
}



function getSeries  (seriesId, callback) {
	var errmsg = "Something went wrong while get a series from tvd: id:" + seriesId;
	request("http://www.thetvdb.com/api/" + dataSafe.tvdbApiKey + "/series/" + seriesId + "/all", function (errReq, responseTvd, body) {

		if (_.has(responseTvd, "statusCode")  && !errReq) {
			if (responseTvd.statusCode == 200) {
				parseString(body, {explicitRoot: false, explicitArray : false}, function (errParse, series) {		
					
					if(series && !errParse){
						//console.log(series);
						callback("", series);
					} else if (errParse) {
						callback( errParse || errmsg, ""); 
					}
				});
			}
		} else if (errReq) {
			callback(errReq, "");
		} else {
			callback(responseTvd.statusCode || errmsg, "");
		}
	});
};



function findAndUpdateSeries (updates, callback) {
	Series.find(function (errFind, resultSeries){
		if(resultSeries && !errFind){
			if (clog) console.log("findAndUpdateSeries: found all series".cyan);
			var matchingSeries = [];	
			for (var i =0; i<updates.Series.length; i++) {
				for (var j =0; j<resultSeries.length; j++) {
					if (updates.Series[i].id == resultSeries[j].Series.id) {
						matchingSeries.push(resultSeries[j].Series.id);
					}
				}
			}
			if (clog) console.log("findAndUpdateSeries: found matches: ".cyan + matchingSeries);
			var matchingSeriesWithUserSeries = [];
			if (matchingSeries.length != 0) {
				forFunctionSafe (0, matchingSeries.length, function (k, next) {
					Series.findOne({"Series.id":matchingSeries[k]}, function (errLoad, resultSeries){
						if(resultSeries && !errLoad){				
							getSeries(matchingSeries[k],function (errParse, newSeries) {
								if (!errParse) {
									if (clog) console.log("findAndUpdateSeries: start extending series".cyan );

									var series2save = new Series(newSeries);

									// series2save.__v = resultSeries.__v;
									// series2save._id = resultSeries._id;

									newSeriesEpisode = _.cloneSafe(newSeries.Episode);
									var seriesForUser = convertSeriesForUser(newSeries);

									delete resultSeries.Episode;
									delete newSeries.Episode;
									
									resultSeries = _.extend(resultSeries,newSeries);
									resultSeries.Episode = newSeriesEpisode;

									
									matchingSeriesWithUserSeries.push(seriesForUser);
									resultSeries.save(function (errSave, storedSeries){

										if (storedSeries && !errSave) {	
											next();		
										} else {
											callback (errSave || 'Error: update Series failed',"");
										}
									});
								} else {
									callback(errParse, "");
								}
							});
						} else{
							callback (errLoad || 'Error: ' + matchingSeries[k] + ' (Series) not found', "");	
						}		
					});	
				},function () {
					if (clog) console.log("findAndUpdateSeries: updated all series".cyan);
					callback("", matchingSeriesWithUserSeries);
				});
			} else {
				console.log("findAndUpdateSeries: nothing to update found".cyan);
				callback("Nothing to update Found", "");
			}
		}
		else {
			callback (errFind || 'Error: find all Series failed', "");				
		}		
	});
}



function getUpdatesFromTvD (callback) {
	errmsg = "Something went wrong while checking for new updates!";
	request("http://www.thetvdb.com/api/" + dataSafe.tvdbApiKey + "/updates/updates_day.xml", function (errReq, responseTvd, body) {

		if (_.has(responseTvd, "statusCode") && !errReq) {
			if (responseTvd.statusCode == 200) {
				parseString(body, {explicitRoot: false, explicitArray : false}, function (errParse, updates) {		
					
					if(updates && !errParse){
						callback("", updates);
					} else if (errParse) {
		
						callback( errParse || errmsg,"");
					}
				});
			}
		} else if (errReq) {
			callback(errReq,"");
		} else {
			callback( responseTvd.statusCode || errmsg,"");
		}
	});
};


function updateUsers (matchingSeriesWithUserSeries, callback) {
	forFunctionSafe(0,matchingSeriesWithUserSeries.length, function (i, next) {
		if (clog) console.log("updateUsers: update users for series: ".cyan + matchingSeriesWithUserSeries[i].id);
		User.find({"series.id":matchingSeriesWithUserSeries[i].id},function (errLoad,resultUsers) {
			if (!errLoad && resultUsers) {
				forFunctionSafe(0,resultUsers.length, function (j, innerNext) {
					var currentUser = resultUsers[j];
					var seriesIndex = -1;
					for (var k = 0; k<currentUser.series.length; k++) {
						if (currentUser.series[k].id == matchingSeriesWithUserSeries[i].id) {
							seriesIndex = k;
							break;
						}
					}
					if (seriesIndex != -1) {
						var userSeriesLength = matchingSeriesWithUserSeries[i].episodes.length;
						var diff = userSeriesLength - currentUser.series[seriesIndex].episodes.length;
						for (var k = diff; k>0; k--) {
							currentUser.series[seriesIndex].episodes.push(matchingSeriesWithUserSeries[i].episodes[userSeriesLength - diff]);
						}
						currentUser.save(function (errSave, savedUser) {
							if (savedUser && !errSave) {								
								innerNext (); 
							} else {
								callback (errSave || "Problems while saved User: " + currentUser._id);
							}
						});
					} else {
						callback("This is an error, occured in matchingSeriesWithUserSeries, which normally could not appear.")
					}					
				}, function () {
					if (clog) console.log("updateUsers: succcessfully updated users for series: ".cyan + matchingSeriesWithUserSeries[i].id);
					next();
				});
			} else {
				callback (errLoad || "Error while find users for update");
			}
		});
	}, function () {
		callback("");
	});
}


exports.getUpdates = function (callback) {
	if (clog) console.log("start crawler update".cyan);
	getUpdatesFromTvD( function (errParse, updates) {				
		if(updates && !errParse){
			if (clog) console.log("got all updates converted to JSON".cyan);
			findAndUpdateSeries(updates,function (errSeries, matchingSeriesWithUserSeries) {		
				if (!errSeries) {
					if (clog) console.log("found all matching series and updated them".cyan);
					updateUsers(matchingSeriesWithUserSeries, function (errUsers) {				
						callback(errUsers);
					});
				} else {
					callback(errSeries);
				}						
			});
		} else  {
			callback(errParse);
		}
	});
};