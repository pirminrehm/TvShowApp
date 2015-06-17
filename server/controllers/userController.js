require('../models/userModel');
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
var dataSafe = require('../../private/dataSafe.json');

var User = mongoose.model('User');
var Series = mongoose.model('Series');




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


//console.log();


exports.test = function(req, res) {
	if(clog) console.log(req.params.token);
	tokenController.verify(req.params.token, function (verified, user) {
		if (verified) {
			res.jsonp({"message" : "Access to restricted area granted"});
		} else {
			res.status(500).jsonp({"message" : "Access to restricted area denied"});
		}
	});
};


//POST
exports.postTokenViaMail = function (req, res) {

function sendMail(token, callback) {
		dateControll = new Date().getTime();
		smtpServer.send({
			text:    "Hello!\nAccess your account here: " + "http://localhost:8080/#/welcome/"+token + "\nYour TvShowApp-Team", 
			from:    dataSafe.mailUser, 
			to:      req.body.email,
			subject: "Token for TvShowApp"
		},  function(err, message) { 
				if(err) {
					if(clog) console.log(err);
				}
					callback(err);
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


//POST
exports.registerAccount = function (req, res) {


	function sendMail(token, callback) {
		dateControll = new Date().getTime();
		smtpServer.send({
			text:    "Hello!\nVerify your account here: " + "http://localhost:8080/#/verify/"+token + "\nYour TvShowApp-Team", 
			from:    dataSafe.mailUser, 
			to:      req.body.email,
			subject: "Token for TvShowApp"
		},  function(err, message) { 
				if(err) {
					if(clog) console.log(err);
				}
					callback(err);
			});

	}

	function createToken (callback) {
		var shasum = crypto.createHash('sha1');
		var date = new Date().getTime();
		var salt = date + req.body;
		shasum.update(salt);
		callback(shasum.digest('hex'));
	}

	
	//für richtiges model updaten!!!
	function checkToken (callback) {

		createToken(function(token) {

			User.findOne({"token":token}, function (err, resultToken){
				if(resultToken && !err){
					if(clog) console.log("duplicated hash");
					callback(checkToken());
				}
				else if(resultToken === null){
					if(clog) console.log("correct hash");
					callback(true, "", token);

				}
				else {
					if(clog) console.log('err', err);
					callback(false, err, token);
				}
			});
		});
	}


	function checkMail (callback) {
		if(_.has(req.body, "email")) {
			if (/\S/.test(req.body.email)) {
				User.findOne({"email":req.body.email}, function (err, resultMail){
					if(resultMail && !err){
						if(clog) console.log("duplicated mail");
						callback(false, "duplicated");
					}
					else if(resultMail === null){
						if(clog) console.log("correct mail");
						callback(true, "");

					}
					else {
						if(clog) console.log("err: ", err);
						callback(false, err);
					}
				});
			} else {
				callback (false, "invalide email")
			}
		} else {
			callback (false, "invalide email")
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
	
	function init () {

		dateControll =new Date().getTime();

		checkMail(function (success, error) {	
		 	if (emailValidator.validate(req.body.email) && success) {
				checkToken(function(success, err, token) {
					if (success) {
						sendMail(token, function(err) {
							if (err) {
								res.status(500).jsonp({"error":err});
							}
							else {
								insertUser(token, function(err, storedUser){
									if (storedUser && !err) {
										if(clog) console.log('Success: insert user');
										res.jsonp({"message" : "You should recieve an Email with your login token"});
									} 
									else if(storedUser === null){
										var errorMessage = 'Error: insert user failed';
										if(clog) console.log(errorMessage);
										res.status(500).jsonp({"error":errorMessage});
									}
									else {
										if(clog) console.log('error', err);
										res.status(500).jsonp({"error":err});
									}
								});
							}
						});

					} else {
						res.status(500).jsonp({"error":err});
					}
				});
			} else if (error == "duplicated") {
				res.status(500).jsonp({"error":"For this email an account already exists"});
			} else {
				res.status(500).jsonp({"error":error});
					
			}
		});
	}

	init();

	

};



exports.verifyAccount = function (req, res) {

	User.findOne({"token":req.params.token}, function (err, resultUser){
		if(resultUser && !err){
			if (resultUser.validated) {
				res.status(500).jsonp({"error" : "Your token is already validated for " + resultUser.email});
			} else {
				resultUser.validated = true;
				resultUser.save(function (err, storedUser) {
					res.jsonp(storedUser);
					//res.jsonp({"message" : "Your account is now verified"});
				});
			}
		}
		else if(resultUser === null){
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
		else {
			res.status(500).jsonp({"error" : err});			
		}
	});
};



function addSeriesToUser(series2Store,user,res){
	
	var userSeriesEpisodes = [];

	for(var i=0; i<series2Store.Episode.length; i++){
		var episode = {
			"id" : series2Store.Episode[i].id,
			"watched" : false
		};
		userSeriesEpisodes.push(episode);
	}

	var userSeries = {
		"name" : series2Store.Series.SeriesName,
		"id" : series2Store.Series.id,
		"bannerUrl" : "http://thetvdb.com/banners/" + series2Store.Series.fanart,
		"episodes" : userSeriesEpisodes
	};

	user.series.push(userSeries);
	saveUser(user, res, "Success: update user (added series)", "Error: update user failed (added series)");
}


function saveUser(user, res, logTextSucces, resTextError){
	user.save(function (errSave, storedUser){
		if (storedUser && !errSave){
			if (clog) console.log(logTextSucces);
			// console.log('storedUser', storedUser);
			res.jsonp(storedUser);
		}
		else if(storedUser === null){
			res.status(500).jsonp({"error" : resTextError});
		}
		else {
			res.status(500).jsonp({"error" : errSave});
		}
	});
}


exports.addSeriesToList = function(req, res){

	var seriesId = req.params.seriesId;

	tokenController.verify(req.params.token, function (verified, user) {
		if (verified) {
			if(clog) console.log("Access to restricted area granted");
			
			var foundInUsersList = false;
			for(var i=0; i<user.series.length; i++){
				if(user.series[i].id == seriesId){
					foundInUsersList = true;
					break;
				}
			}

			if(foundInUsersList){				
				res.status(500).jsonp({"error":"Series already in users list"});
			}
			else{
				if(clog) console.log('Series is NOT in users list');

				Series.findOne({'Series.id':seriesId}, function (errLoadSeries, resultSeries){
					if(resultSeries && !errLoadSeries){
						if(clog) console.log('Series found in Series DB collection');
						addSeriesToUser(resultSeries, user, res);						
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
												console.log('Success: store "' + storedSeries.Series.SeriesName +  '" in Series DB collection');							
												addSeriesToUser(storedSeries, user, res);
											}
											else if(storedSeries === null){
												res.status(500).jsonp({"error" : "Error: store series retrieved from TvD failed"});
											}
											else{
												res.status(500).jsonp({"error" : errSaveSeries});
											}
										});
									}
									else if(resultJSON === null){
										res.status(500).jsonp({"error" : "Error: parsing response from TvD into JSON failed"});
									}
									else{
										res.status(500).jsonp({"error" : errParse});
									}
								});
							}
							else if(responseTvd.statusCode == 404){
								res.status(500).jsonp({"error":"Error: seriesId not found"});
							}							
							else{
								res.status(500).jsonp({"error" : errReq});
							}
						});
					}
					else{
						res.status(500).jsonp({"error" : errLoadSeries});
					}
				});
			}
		} 
		else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});	
};


exports.deleteSeriesFromList = function(req, res){

	var seriesId = req.params.seriesId;

	tokenController.verify(req.params.token, function (verified, user) {
		if (verified) {
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
				saveUser(user, res, "Success: update user (delete series)", "Error: update user failed (delete series)");
			}
			else{
				res.status(500).jsonp({"error":"Error: seriesId not found"});
			}
		} 
		else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});
};


exports.getAllUserInformation = function(req, res){

	tokenController.verify(req.params.token, function (verified, user) {
		if (verified) {
			if(clog) console.log("Access to restricted area granted");
			res.send(user);
		}
		else {
			res.status(500).jsonp({"error":"Error: User not found"});
		}
	});
};


exports.updateEpisodeWatched = function(req, res){

	var episodeId = req.params.episodeId;

	tokenController.verify(req.params.token, function (verified, user) {
		if (verified) {
			if(clog) console.log("Access to restricted area granted");
			
			var foundInEpisodes = false;			

			for(var i=0; i<user.series.length; i++){
				for(var j=0; j<user.series[i].episodes.length; j++){
					if(user.series[i].episodes[j].id == episodeId){
						user.series[i].episodes[j].watched = req.params.bool;
						foundInEpisodes = true;
						break;
					}
				}
			}

			if(foundInEpisodes){
				saveUser(user, res, "Success: update user (mark episode)", "Error: update user failed (mark episode)");
			}
			else{
				res.status(500).jsonp({"error":"Error: episodeId not found"});
			}
		}
		else {
			res.status(500).jsonp({"error" : "We could't find your user token"});
		}
	});
};