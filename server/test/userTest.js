var should = require('should'); 
var assert = require('assert'); 
var colors = require('colors');
var mongoose = require('mongoose');


//own dependencies
var config = require('../config.json');
var data =  require('./testData.json');
var server = require('../bin/www');
var mongoStart = require('../bin/mongoStart');
var loggingStart = require('../bin/loggingStart');


var myFunctions = require('./myFunctions');
var myAssert = myFunctions.myAssert;
var req = myFunctions.req;
var insert = myFunctions.insert;


/* Account overview

acc1 = validated, test1, 0 series
acc4= acc1 + houseOfCards
acc6 = acc4 + himym

acc2 = not validated, test2, 0 series
acc5 = acc2 + validated
acc3 = acc2 + validated + house of Cards (index 1 and 2 are true)
acc7 = acc3 +himym (index 1 and 2 are true)

*/


/******************************
====== config variables =======
*******************************/

//logging to console?
var clog = false;


//main describe over all Tests 
describe('User-Test:'.red, function() {
	describe('User Registration'.yellow, function() {
		this.timeout(10000);
		it('should post the mail tvshowapp-test1@7kw.de', function(done){ 
			req.post(data.acc1, "/usr/register", 200, function(body) {
				myAssert (body.message, "You should recieve an Email with your login token",  done);
			});
		});

		it('should post the mail tvshowapp-test2@7kw.de', function(done) {
			req.post(data.acc2, "/usr/register", 200, function(body) {
				myAssert (body.message, "You should recieve an Email with your login token",  done);
			});
		});

		describe('Failure'.yellow, function() {
			beforeEach(function(done) {
				insert.user (data.acc1, function() { done(); });
			});

			it('should not create an second account for tvshowapp-test1@7kw.de', function(done) {
				req.post(data.acc1, "/usr/register", 500, function(body) {
					myAssert (body.error, "For this email an account already exists",  done);
				});
			});

			it('should try to sign up with a wrong email (check1)', function(done) {
				req.post({"email":"@"}, "/usr/register", 500, function(body) {
					myAssert (body.error, "invalide email",  done);
				});
			});

			it('should try to sign up with a wrong email (check2)', function(done) {
				req.post({"email":"@d."}, "/usr/register", 500, function(body) {
					myAssert (body.error, "invalide email",  done);
				});
			});

			it('should try to sign up with a wrong email (check3)', function(done) {
				req.post({"email":{}}, "/usr/register", 500, function(body) {
					myAssert (body.error, "invalide email",  done);
				});
			});

			it('should try to sign up with a wrong email (check4)', function(done) {
				req.post({"nix":"nix"}, "/usr/register", 500, function(body) {
					myAssert (body.error, "invalide email",  done);
				});
			});

			it('should try to sign up with a wrong email (check5)', function(done) {
				req.post({}, "/usr/register", 500, function(body) {
					myAssert (body.error, "invalide email",  done);
				});
			});
		});
	});


	describe('User Verification'.yellow, function() {
		beforeEach(function(done) {
			insert.user (data.acc1, function() { insert.user (data.acc2,  done); });
		});
			
		it('should verify tvshowapp-test2@7kw.de', function(done) {
			req.get("", "/usr/register/verify/"+data.acc2.token, 200, function(body) {
				var valUser = data.acc2;
				valUser.validated = true;
				myAssert (body, valUser,  done);
			});
		});

		it('should not verify tvshowapp-test1@7kw.de because it already is', function(done) {
			req.get("", "/usr/register/verify/"+data.acc1.token, 500, function(body) {
				myAssert (body.error, "Your token is already validated for " + data.acc1.email,  done);
			});
		});

		it('should not verify an not existing token', function(done) {
			req.get("", "/usr/register/verify/"+"ab", 500, function(body) {
				myAssert (body.error, "We could't find your user token",  done);
			});
		});
	});

	describe('User requests token via Mail'.yellow, function() {
		beforeEach(function(done) {
			insert.user (data.acc1, function() { insert.user (data.acc2,  done); });
		});
		
		describe('successfully', function() {
			it('should requeset an email', function(done) {
				req.post({"email":data.acc1.email}, "/usr/mail/get", 200, function(body) {
					myAssert (body.message, "Email successfull send",  done);
				});
			});
		});

		describe('failures', function() {
			it('should try to request with a wrong email (check1)', function(done) {
				req.post({"email":"@"}, "/usr/mail/get", 500, function(body) {
					myAssert (body.error, "Not an accout registered for this Mail",  done);
				});
			});

			it('should try to request with a wrong email (check2)', function(done) {
				req.post({"email":"@d."}, "/usr/mail/get", 500, function(body) {
					myAssert (body.error, "Not an accout registered for this Mail",  done);
				});
			});

			it('should try to request with a wrong email (check3)', function(done) {
				req.post({"email":{}}, "/usr/mail/get", 500, function(body) {
					myAssert (body.error, "Not an accout registered for this Mail",  done);
				});
			});

			it('should try to request with a wrong email (check4)', function(done) {
				req.post({"nix":"nix"}, "/usr/mail/get", 500, function(body) {
					myAssert (body.error, "Not an accout registered for this Mail",  done);
				});
			});

			it('should try to request with a wrong email (check5)', function(done) {
				req.post({}, "/usr/mail/get", 500, function(body) {
					myAssert (body.error, "Not an accout registered for this Mail",  done);
				});
			});
		});
	});


	describe('User Operations'.yellow, function() {
		describe('add series'.yellow, function() {	
			beforeEach(function(done) {
				insert.user (data.acc1,  done);
			});
			describe('which is already in the mongo', function() {	
				beforeEach(function(done) {
					insert.series (data.houseOfCards, done);
				});
				it('should add a new series to user 1', function(done) {
					req.get("", "/usr/token/"+ data.acc1.token + "/series/"+ data.houseOfCards.Series.id, 200, function(body) {
						myAssert(body, data.acc4.series[0],  done); //acc1 + series = acc4
					});
				});
			});
			describe('which is not yet in the mongo', function() {	
				this.timeout(5000);
				it('should add a new series to user 1', function(done) {
					req.get("", "/usr/token/"+ data.acc1.token + "/series/"+ data.houseOfCards.Series.id, 200, function(body) {
						myAssert(body,  data.acc4.series[0] ,  done);  //acc1 + series = acc4
					});
				});
			});
			describe('failures', function() {	
				//special case: just possible if a series is deleted from the mongo, but the user hat it still
				describe('add series again which is not yet in the mongo', function() {
					beforeEach(function(done) {
						insert.user (data.acc3,  done);//acc3 = user2 but verified and with one series
					});
					it('should try to add a series again', function(done) {
						req.get("", "/usr/token/"+ data.acc3.token + "/series/"+data.acc3.series[0].id, 500, function(body) {
							myAssert(body.error, "Series already in users list",  done);	
						});
					});
				});
				//common case
				describe('add series again which is alreade in the mongo', function() {
					beforeEach(function(done) {
						insert.user (data.acc3, function() { insert.series (data.houseOfCards, function() {  done(); }); }); //acc3 = acc2 but verified and with one series
					});
					it('should try to add a series again', function(done) {
						req.get("", "/usr/token/"+ data.acc3.token + "/series/"+data.acc3.series[0].id, 500, function(body) {
							myAssert(body.error, "Series already in users list",  done);	
						});
					});
				});

				it('should try to get a series with wrong id', function(done) {
					req.get("", "/usr/token/"+ data.acc1.token + "/series/1", 500, function(body) {
						myAssert(body.error, "Error: seriesId not found", done);
					});
				});

				it('should try to get a series with wrong token', function(done) {
					req.get("", "/usr/token/"+ "blub" + "/series/"+ data.houseOfCards.Series.id, 500, function(body) {
						myAssert(body.error, "We could't find your user token", done);
					});
				});
			});

		});

		describe('remove series'.yellow, function() {	
			describe('from user 2', function() {
				beforeEach(function(done) {
					insert.user (data.acc6, function() { done(); }); //acc3 = user2 but verified and with one series
				});
				it('should remove a series from user 1', function(done) {
					req.delete("", "/usr/token/"+ data.acc6.token + "/series/"+ data.acc6.series[1].id, 200, function(body) {
						myAssert(body, data.acc4,  done); //acc 3 - series = acc5
					});
				});

				it('should remove two series from user 1', function(done) {
					req.delete("", "/usr/token/"+ data.acc6.token + "/series/"+ data.acc6.series[1].id, 200, function(body) {
						req.delete("", "/usr/token/"+ data.acc6.token + "/series/"+ data.acc6.series[0].id, 200, function(body) {
							myAssert(body, data.acc1, done); //acc 3 - series = acc5
						});
					});
				});
			});	

			describe('failures', function() {
				beforeEach(function(done) {
					insert.user (data.acc1, function() { done(); });
				});	
				it('should try to remove a series with wrong id', function(done) {
					req.delete("", "/usr/token/"+ data.acc1.token + "/series/1", 500, function(body) {
						myAssert(body.error, "Error: seriesId not found",  done);
					});
				});

				it('should try to remove a series with wrong token', function(done) {
					req.delete("", "/usr/token/"+ "blub" + "/series/"+ data.houseOfCards.Series.id, 500, function(body) {
						myAssert(body.error, "We could't find your user token",  done);
					});
				});
			});
		});

		describe('get user'.yellow, function() {
			beforeEach(function(done) {
				insert.user (data.acc6,  done);
			});
			describe('successfull', function() {	
				it('should get the whole user', function(done) {
					req.get("", "/usr/token/"+ data.acc6.token + "/user/all", 200, function(body) {
						myAssert (body,data.acc6,  done);
					});
				});
			});
			describe('failures', function() {	
				it('should try to get the user with wrong token', function(done) {
					req.get("", "/usr/token/"+ "blub" + "/user/all", 500, function(body) {
						myAssert(body.error, "Error: User not found",  done);
					});
				});
			});
		});

		describe('mark an episode'.yellow, function() {	
			beforeEach(function(done) {
				insert.user (data.acc7,  done);
			});

			describe('as watched', function() {
				it('should mark an episode (index:0) from an series (index:0) as watched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ true +"/episode/"+ data.acc7.series[0].episodes[0].id , 200, function(body) {
						myAssert (body.series[0].episodes[0].w, true,  done);
					});
				});
				it('should mark an episode (index:5) from an series (index:0) as watched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ true +"/episode/"+ data.acc7.series[0].episodes[5].id , 200, function(body) {
						myAssert (body.series[0].episodes[5].w, true, done);
					});
				});
				it('should mark an episode (index:1) from an series (index:1) as watched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ true +"/episode/"+ data.acc7.series[1].episodes[1].id , 200, function(body) {
						myAssert (body.series[1].episodes[1].w, true,  done);
					});
				});
				it('should mark an episode (index:6) from an series (index:1) as watched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ true +"/episode/"+ data.acc7.series[1].episodes[6].id , 200, function(body) {
						myAssert (body.series[1].episodes[6].w, true,  done);
					});
				});
			});

			describe('as unwatched', function() {
				it('should mark an episode (index:1) from an series (index:0) as unwatched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ false +"/episode/"+ data.acc7.series[0].episodes[1].id , 200, function(body) {
						myAssert (body.series[0].episodes[1].w, false,  done);
					});
				});
				it('should mark an episode (index:2) from an series (index:0) as unwatched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ false +"/episode/"+ data.acc7.series[0].episodes[2].id , 200, function(body) {
						myAssert (body.series[0].episodes[2].w, false,  done);
					});
				});
				it('should mark an episode (index:1) from an series (index:1) as unwatched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ false +"/episode/"+ data.acc7.series[1].episodes[1].id , 200, function(body) {
						myAssert (body.series[1].episodes[1].w, false,  done);
					});
				});
				it('should mark an episode (index:2) from an series (index:1) as unwatched', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ false +"/episode/"+ data.acc7.series[1].episodes[2].id , 200, function(body) {
						myAssert (body.series[1].episodes[2].w, false,  done);
					});
				});
			});

			describe('failures', function() {
				it('should try to mark an episode as unwatched with wrong episode id', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ false +"/episode/"+ "00" , 500, function(body) {
						myAssert (body.error,"Error: episodeId not found",  done);
					});
				});

				it('should try to mark an episode as unwatched with wrong token', function(done) {
					req.put("", "/usr/token/"+ "blub" + "/watched/"+ false +"/episode/"+ "00" , 500, function(body) {
						myAssert (body.error,"We could't find your user token",  done);
					});
				});

				it('should try to mark an episode with wron boolean', function(done) {
					req.put("", "/usr/token/"+ data.acc7.token + "/watched/"+ "blub" +"/episode/"+ data.acc7.series[0].episodes[1].id , 500, function(body) {
						myAssert (body.error, "Invalide boolean",  done);
					});
				});
			});
		});

		describe('mark an season'.yellow, function() {	
			beforeEach(function(done) {
				insert.user (data.acc3,  done);
			});
			describe('as watched', function() {
				it('should mark all episodes of an season as watched (season 1)', function(done) {
					req.put("", "/usr/token/"+ data.acc3.token + "/watched/"+ true +"/series/"+ data.acc3.series[0].id + "/season/1"  , 200, function(body) {
						myAssert (body, data.acc8,  done);
					});
				});

				it('should mark all episodes of an season as watched (season 2)', function(done) {
					req.put("", "/usr/token/"+ data.acc3.token + "/watched/"+ true +"/series/"+ data.acc3.series[0].id + "/season/2" , 200, function(body) {
						myAssert (body, data.acc9,  done);
					});
				});				
			});

			describe('failures', function() {
				it('should try to mark an season as unwatched with wrong season nr', function(done) {
					req.put("", "/usr/token/"+ data.acc3.token + "/watched/"+ true +"/series/"+ data.acc3.series[0].id + "/season/" + "999"  , 500, function(body) {
						myAssert (body.error, "Error: Season in user not found",  done);
					});
				});

				it('should try to mark an season as unwatched with wrong seriesId', function(done) {
					req.put("", "/usr/token/"+ data.acc3.token + "/watched/"+ true +"/series/"+ "1" + "/season/" + data.acc3.series[0].episodes[0].sNr, 500, function(body) {
						myAssert (body.error, "Error: Series in user not found",  done);
					});
				});

				it('should try to mark an episode as unwatched with wrong token', function(done) {
					req.put("", "/usr/token/"+ "blub" + "/watched/"+ true +"/series/"+ "1" + "/season/" + data.acc3.series[0].episodes[0].sNr  , 500, function(body) {
						myAssert (body.error,"We could't find your user token",  done);
					});
				});

				it('should try to mark an episode with wrong boolean', function(done) {
					req.put("", "/usr/token/"+ data.acc3.token + "/watched/"+ "blub" +"/series/"+ data.acc3.series[0].id + "/season/" + data.acc3.series[0].episodes[0].sNr  , 500, function(body) {
						myAssert (body.error, "Invalide boolean",  done);
					});
				});
			});
		});
	});
});


						






