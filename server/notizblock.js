var request = require('request');
var parseString = require('xml2js').parseString;
require('./models/seriesModel');
var mongoose = require('mongoose');
var Series = mongoose.model('Series');
var config = require('./config.json');



mongoose.connect(config.dbUrl);
var db = mongoose.connection;

db.on('error', function callback() {
  console.log('Verbindung zu MongoDB fehlgeschlagen');
});


db.on('open', function callback() {
  console.log('Verbindung zu MongoDB erfolgreich (Database: ' + config.dbUrl + ")");
});



var data = {};

request('http://thetvdb.com/api/DFC9CF716B0709C4/series/75760/all/de.xml', function (error, response, body) {

  	if (!error && response.statusCode == 200) {
  		data.xml = body;
  		start();
  	};

});

function start () {

	//console.log(data.xml);

	parseString(data.xml, {explicitRoot: false, explicitArray : false} ,function (err, result) {
    	//console.dir(result);

    var series = new Series(result);
	series.save(function (err, storedSeries) {		
		if (storedSeries && !err) {
			console.log('Success: insert series');
			console.log(storedSeries);
		} 
		else if(storedSeries === null){
			var errorMessage = 'Error: insert series failed';
			console.log(errorMessage);
		}
		else {
			console.log('error', err);

		}
	});
	});
    
 }

