var server = require('./www');
var mongoStart = require('./mongoStart');
var config = require('../config.json');

var mongoUrl = config.dbUrl;


mongoStart.connect(mongoUrl, function(success) {
	if (success) {
		console.log("Success: Connected MongoDB ".green +"(Database: " +  mongoUrl + ")");
		server.listen( function () {
			console.log("Success: Server is listening".green);
		});
	} else {
		throw('Connection to mongoDB refused');

	}
});
