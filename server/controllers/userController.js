var mongoose = require('mongoose');
var crypto = require('crypto');
var stringify = require('json-stringify-safe');
var colors = require('colors');
var email = require('emailjs');
var emailValidator = require("email-validator");
var request = require('request');
var _ = require('underscore');
var parseString = require('xml2js').parseString;

var tokenController = require('./tokenController');
var seriesController = require('./seriesController');
var dataSafe = require('../../private/dataSafe.json');

require('../models/userModel');
var User = mongoose.model('User');





//logging in der console???
var clog = false;


var smtpServer  = email.server.connect({
   user:    dataSafe.mailUser, 
   password: dataSafe.mailPassword, 
   host:    dataSafe.mailHost, 
   ssl:     false,
   tls:     true,
   port:    587
});





/**
 * Saves an user to the mongoDB
 * @param  {Object}   user     user 2 save
 * @param  {String}   action   the task from where the function had been calles, needed for error message and console logging
 * @param  {Function} callback responds the stored user or an error
 */
function saveUser(user,action, callback){
	user.save(function (errSave, storedUser){
		if (storedUser && !errSave){
			if(clog) console.log("Success: update user " + action);
			callback (storedUser);
		}
		else if(storedUser === null){
			if(clog) console.log("Error: update user failed " + action);
		}
		else {
			if(clog) console.log(errSave);
			callback ("",errSave);
		}
	});
}


/*
Sends the token to an email if requested from the client
 */
exports.postTokenViaMail = function (req, res) {

	function sendMail(token, callback) {
		smtpServer.send({
			text:    "Hello!\nAccess your account here: " + "http://localhost:8080/#/welcome/"+token + "\nYour TvShowApp-Team", 
			from:    dataSafe.mailUser, 
			to:      req.body.email,
			subject: "Token for TvShowApp",
			attachment: [{data:"Hello!<br>Access your account <a href='http://localhost:8080/#/welcome/"+token + "'>here!</a><br>Your TvShowApp-Team", alternative:true}]
		},function(err, message) { 
			if(err) {
				if(clog) console.log(err);
				callback(err);
			} else {
				callback();
			}	
		});
	}

	User.findOne({"email":req.body.email}, function (err, resultUser){
		if(resultUser && !err){
			sendMail(resultUser.token, function (errMail) {
				if (!errMail) {
					res.jsonp ({"message":"Email successfull send"});
				} else {
					res.status(500).jsonp({"error":errMail});
				}
			});
		}
		else if(resultUser === null){
			var errorMessage1 = "Not an accout registered for this Mail";
			if(clog) console.log(errorMessage1);
			res.status(500).jsonp({"error":errorMessage1});
		}
		else {
			if(clog) console.log('error'.red, err);
			res.status(500).jsonp({"error":err});
		}
	});
};


/*
Generates an new account for an new email
 */
exports.registerAccount = function (req, res) {

	function sendMail(token, callback) {
		smtpServer.send({
			text:    "Hello!\nVerify your account here: " + "http://localhost:8080/#/verify/"+token + "\nYour TvShowApp-Team", 
			from:    dataSafe.mailUser, 
			to:      req.body.email,
			subject: "Token for TvShowApp",
			attachment: [{data:"Hello!<br>Verify your account <a href='http://localhost:8080/#/verify/"+token + "'>here!</a><br>Your TvShowApp-Team", alternative:true}]
		},function(err, message) { 
			if(err) {
				if(clog) console.log(err);
				callback(err);
			} else {
				callback();
			}	
		});
	}

	/*
	Create the token from the current date time in ms and the request body
	 */
	function createToken (callback) {
		var shasum = crypto.createHash('sha1');
		var date = new Date().getTime();
		var salt = date + req.body;
		shasum.update(salt);
		callback(shasum.digest('hex'));
	}

	/*
	Tries to create an new token and checks if it is already in use.
	If the token is already in use, it tries it again and again
	 */
	function createAndCheckToken (callback) {
		createToken(function(token) {
			User.findOne({"token":token}, function (err, resultToken){
				if(resultToken && !err){
					if(clog) console.log("duplicated hash");
					callback(createAndCheckToken());
				}
				else if(resultToken === null){
					if(clog) console.log("correct hash");
					callback(token);
				}
				else {
					if(clog) console.log('err', err);
					callback(token, err);
				}
			});
		});
	}

	/*
	Checks wether the mail is already in use or not and if it is part of the body
	 */
	function checkMail (callback) {
		if(_.has(req.body, "email")) {
			if (/\S/.test(req.body.email)) {
				User.findOne({"email":req.body.email}, function (err, resultMail){
					if(resultMail && !err){
						if(clog) console.log("duplicated mail");
						callback("duplicated");
					}
					else if(resultMail === null){
						if (emailValidator.validate(req.body.email)) {
							if(clog) console.log("correct mail");
							callback();
						} else {
							callback ("invalide email");
						}
					}
					else {
						if(clog) console.log("err: ", err);
						callback(err);
					}
				});
			} else {
				callback ("invalide email");
			}
		} else {
			callback ("invalide email");
		}
	}

	function insertUser (token, callback) {
		user2save =req.body;
		_.extend(user2save, {"token":token,"validated" : false});
		var user = new User(user2save);
		user.save(function (err, storedUser) {		
			callback(err, storedUser);
		});
	}	

	checkMail(function (errCheckMail) {	
	 	if (!errCheckMail) {
			createAndCheckToken(function (token, errToken) {
				if (!errToken) {
					sendMail(token, function (errSendMail) {
						if (!errSendMail) {
							insertUser(token, function (errStore, storedUser){
								if (storedUser && !errStore) {
									res.jsonp({"message" : "You should recieve an Email with your login token"});
								} else if(storedUser === null){
									res.status(500).jsonp({"error":"Error: insert user failed"});
								} else {
									res.status(500).jsonp({"error":errStore});
								}
							});
						} else {
							res.status(500).jsonp({"error":errSendMail});
						}
					});
				} else {
					res.status(500).jsonp({"error":errToken});
				}
			});
		} else if (errCheckMail == "duplicated") {
			res.status(500).jsonp({"error":"For this email an account already exists"});
		} else {
			res.status(500).jsonp({"error":errCheckMail});					
		}
	});
};


exports.verifyAccount = function (req, res) {
	User.findOne({"token":req.params.token}, function (errLoad, resultUser){
		if(resultUser && !errLoad){
			if (resultUser.validated) {
				res.status(500).jsonp({"error" : "Your token is already validated for " + resultUser.email});
			} else {
				resultUser.validated = true;
				resultUser.save(function (errSave, storedUser) {
					if (!errSave) {
						res.jsonp(storedUser);
					} else if (storedUser === null) {
						res.status(500).jsonp({"error" : "We could't validate you, please try again."});
					} else {
						res.status(500).jsonp({"error" :errSave });
					}
				});
			}
		}
		else if(resultUser === null){
			res.status(500).jsonp({"error" : "We could't find your user token"});
		} else {
			res.status(500).jsonp({"error" : err});			
		}
	});
};


/*
Adds a series to an user by generating the user-data.
The function first checks, if the series is alredy used by the user, if not it starts the import.
The import of the series is organized by the function seriesController.loadOrImportSeries
 */
exports.addSeriesToList = function(req, res){

	function addSeriesToUser(series2Store,user,callback){	
		var userSeriesEpisodes = [];
		for(var i=0; i<series2Store.Episode.length; i++){
			var episode = {
				"id" : series2Store.Episode[i].id,
				"w" : false,
				"n" : series2Store.Episode[i].EpisodeName,
				"sNr" : series2Store.Episode[i].SeasonNumber,
				"eNr" : series2Store.Episode[i].EpisodeNumber
			};
			userSeriesEpisodes.push(episode);
		}
		var userSeries = {
			"name" : series2Store.Series.SeriesName,
			"id" : series2Store.Series.id,
			"bannerUrl" : "",
			"episodes" : userSeriesEpisodes
		};
		if (series2Store.Series.fanart){
			userSeries.bannerUrl = "http://thetvdb.com/banners/" + series2Store.Series.fanart;
		} else if(series2Store.Series.banner){
			userSeries.bannerUrl = "http://thetvdb.com/banners/" + series2Store.Series.banner;	
		} else{
			userSeries.bannerUrl = "";
		}
		user.series.push(userSeries);
		callback (user);
	}

	tokenController.verify(req.params.token, function (verified, user) {
		if (verified && req.params.seriesId) {			
			var seriesId = req.params.seriesId;
			var foundInUsersList = false;
			for(var i=0; i<user.series.length; i++){
				if(user.series[i].id == seriesId){
					foundInUsersList = true;
					break;
				}
			}
			if(!foundInUsersList){	
				if(clog) console.log('Series is NOT in users list');
				seriesController.loadOrImportSeries (seriesId, function (series, errLoadSeries) {
					if (!errLoadSeries) {
						addSeriesToUser(series, user, function(updatedUser) {
							saveUser(user,"(added series)", function (savedUser, errSaveUser) {
								if (!errSaveUser) {
									var newSeries = {};
									for(var i=0; i<savedUser.series.length; i++){
										if(savedUser.series[i].id == seriesId){
											newSeries = savedUser.series[i];
											break;
										}
									}
									if (newSeries) {
										if (clog) console.log("Success: found series in user (added series)");
										res.jsonp(newSeries);
									} else {
										if (clog) console.log("Unknown Error, please try again");
										res.status(500).jsonp({"error" : "Unknown Error, please try again"});
									}									
								} else {
									if (clog) console.log(errSaveUser);
									res.status(500).jsonp({"error" : errSaveUser});
								}
							});
						});
					} else {
						res.status(500).jsonp({"error" : errLoadSeries});
					}
				});			
			} else {
				res.status(500).jsonp({"error":"Series already in users list"});
			}
		} else if (!(req.params.seriesId)) {
			res.status(500).jsonp({"error" : "Invalide Data received"});
		} else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});	
};


/*
Deletes a series from an user
 */
exports.deleteSeriesFromList = function(req, res){
	tokenController.verify(req.params.token, function (verified, user) {
		if (verified && req.params.seriesId) {
			var seriesId = req.params.seriesId;
			if(clog) console.log("Access to restricted area granted");			
			var deleteIndex = -1;
			for(var i=0; i<user.series.length; i++){
				if(user.series[i].id == seriesId){
					deleteIndex = i;
					break;
				}
			}
			if(deleteIndex >= 0){				
				if(clog) console.log('user', user);
				if(clog) console.log('Series in users list');
				user.series.splice(deleteIndex,1);
				saveUser(user, "(delete series)", function(savedUser, errSaveUser) {
					if (!errSaveUser) {
						res.jsonp(savedUser);
					} else {
						res.status(500).jsonp({"error":errSaveUser});
					}
				});
			} else{
				res.status(500).jsonp({"error":"Error: seriesId not found"});
			}
		} else if (!(req.params.seriesId)) {
			res.status(500).jsonp({"error" : "Invalide Data received"});
		} else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});
};


exports.getAllUserInformation = function(req, res){
	tokenController.verify(req.params.token, function (verified, user) {
		if (verified) {
			res.jsonp(user);
		} else {
			res.status(500).jsonp({"error":"Error: User not found"});
		}
	});
};


/*
Sets a single episode from an user as watched
 */
exports.updateEpisodeWatched = function(req, res){
	tokenController.verify(req.params.token, function (verified, user) {
		if (verified && req.params.episodeId && req.params.bool) {
			if (req.params.bool == "true" || req.params.bool == "false") {
				var episodeId = req.params.episodeId;	
				var foundInEpisodes = false;
				for(var i=0; i<user.series.length; i++){
					for(var j=0; j<user.series[i].episodes.length; j++){
						if(user.series[i].episodes[j].id == episodeId){
							user.series[i].episodes[j].w = req.params.bool;
							foundInEpisodes = true;
							break;
						}
					}
				}
				if(foundInEpisodes){
					saveUser(user, "(mark episode)", function(savedUser, errSaveUser) {
						if (!errSaveUser) {
							res.jsonp(savedUser);
						} else {
							res.status(500).jsonp({"error":errSaveUser});
						}
					});
				} else{
					res.status(500).jsonp({"error":"Error: episodeId not found"});
				}
			} else {
				res.status(500).jsonp({"error" : "Invalide boolean"});
			}
		} else if (!(req.params.episodeId && req.params.bool)) {
			res.status(500).jsonp({"error" : "Invalide Data received"});
		} else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});
};

/*
Sets a whole season from an user as watched
 */
exports.updateSeasonWatched = function(req, res){
	tokenController.verify(req.params.token, function (verified, user) {
		if (verified && req.params.seasonNr && req.params.seriesId && req.params.bool) {
			if (req.params.bool == "true" || req.params.bool == "false") {
				var seasonNr = req.params.seasonNr;
				var seriesId = req.params.seriesId;					
				var foundAtLeastOne = false;	
				var foundSeries = false;
				for(var i=0; i<user.series.length; i++){
					if (seriesId == user.series[i].id) {
						foundSeries = true;
						for(var j=0; j<user.series[i].episodes.length; j++){
							if(user.series[i].episodes[j].sNr == seasonNr){
								user.series[i].episodes[j].w = req.params.bool;
								foundAtLeastOne = true;
							}
						}
					}
				}
				if(foundAtLeastOne){
					saveUser(user, "(mark season)", function(savedUser, errSaveUser) {
						if (!errSaveUser) {
							res.jsonp(savedUser);
						} else {
							res.status(500).jsonp({"error":errSaveUser});
						}
					});
				} else if (!foundSeries) {
					res.status(500).jsonp({"error":"Error: Series in user not found"});
				} else {
					res.status(500).jsonp({"error":"Error: Season in user not found"});
				}
			} else {
				res.status(500).jsonp({"error" : "Invalide boolean"});
			}
		} else if (!(req.params.seasonNr && req.params.seriesId && req.params.bool)) {
			res.status(500).jsonp({"error" : "Invalide data received"});
		} else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});
};