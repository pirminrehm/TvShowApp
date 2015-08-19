var mongoStart = require('../bin/mongoStart');
var config = require('../config.json');
var colors = require('colors');

var crawlerController = require('./crawlerController');

var mongoUrl = config.dbUrl;

var waittime_ms =  86000000;   //day = 86400000 ms
var waittime_h = (waittime_ms/3600000).toFixed(2);
var message = "next update in: " + waittime_ms + "ms (" + waittime_h + "h)";

/**
 * tries to start the updater, if an error occours it tries again
 * the other code ist just for pretty logging
 */
function starter () {
	var currentDate = new Date();
	currentDate = currentDate.toTimeString(); 
	console.log("start: ".green + currentDate);
	var startTime = new Date().getTime();

	crawlerController.getUpdates(function(firstErr) {
		if (firstErr) {
			crawlerController.getUpdates(function(secondErr) {
				var endTime = new Date().getTime();
				var time = endTime - startTime;
				if (secondErr) {
					console.log ("firstErr: ".red);
					console.log (firstErr);
					console.log ("secondErr: ".red);
					console.log (secondErr);
					var timeMessage = "elapsed time: " + time + "ms";
					console.log (timeMessage.green);	

				} else {							
					var successMessage = "crawler finished successfully after " + time + "ms";
					endTime.setMilliseconds(waittime_ms - time);
					console.log (successMessage.green );				
					console.log (message.yellow+ " @date: " + endTime.toTimeString());
				}
			});
		} else {
			var endTime = new Date();
			var time = endTime.getTime() - startTime;
			endTime.setMilliseconds(waittime_ms - time);
			var successMessage = "crawler finished successfully after " + time + "ms";
			console.log (successMessage.green);						
			console.log (message.yellow+ " @date: " + endTime.toTimeString());
		}
	});
}


mongoStart.connect(mongoUrl, function(success) {
	if (success) {
		console.log("Success: Connected MongoDB ".green +"(Database: " +  mongoUrl + ")");
		
		//execute first time	
		starter ();		

		//start interval
		setInterval(starter, waittime_ms);

	} else {
		throw('Connection to mongoDB refused');

	}
});
