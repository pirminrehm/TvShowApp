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



var jus = 	{"_id":"55660c9ced039ae1285a292f","token":"79c25df0ec4bf2d92872a299c299685f426a3602","validated":true,"email":"tvshowapp-test1@7kw.de","__v":1,"series":[{"name":"How I Met Your Mother","id":"75760","_id":"55660dee821d5d2b2989f3d2","episodes":[{"id":1159571,"watched":false,"_id":"55660dee821d5d2b2989f4ad"},{"id":414248,"watched":false,"_id":"55660dee821d5d2b2989f4ac"},{"id":1181661,"watched":false,"_id":"55660dee821d5d2b2989f4ab"},{"id":1181671,"watched":false,"_id":"55660dee821d5d2b2989f4aa"},{"id":950611,"watched":false,"_id":"55660dee821d5d2b2989f4a9"},{"id":1635231,"watched":false,"_id":"55660dee821d5d2b2989f4a8"},{"id":1857861,"watched":false,"_id":"55660dee821d5d2b2989f4a7"},{"id":4192840,"watched":false,"_id":"55660dee821d5d2b2989f4a6"},{"id":4192841,"watched":false,"_id":"55660dee821d5d2b2989f4a5"},{"id":4192842,"watched":false,"_id":"55660dee821d5d2b2989f4a4"},{"id":5164623,"watched":false,"_id":"55660dee821d5d2b2989f4a3"},{"id":177831,"watched":false,"_id":"55660dee821d5d2b2989f4a2"},{"id":300336,"watched":false,"_id":"55660dee821d5d2b2989f4a1"},{"id":300337,"watched":false,"_id":"55660dee821d5d2b2989f4a0"},{"id":300338,"watched":false,"_id":"55660dee821d5d2b2989f49f"},{"id":300339,"watched":false,"_id":"55660dee821d5d2b2989f49e"},{"id":300340,"watched":false,"_id":"55660dee821d5d2b2989f49d"},{"id":300341,"watched":false,"_id":"55660dee821d5d2b2989f49c"},{"id":301434,"watched":false,"_id":"55660dee821d5d2b2989f49b"},{"id":301435,"watched":false,"_id":"55660dee821d5d2b2989f49a"},{"id":301436,"watched":false,"_id":"55660dee821d5d2b2989f499"},{"id":301437,"watched":false,"_id":"55660dee821d5d2b2989f498"},{"id":301438,"watched":false,"_id":"55660dee821d5d2b2989f497"},{"id":303683,"watched":false,"_id":"55660dee821d5d2b2989f496"},{"id":303684,"watched":false,"_id":"55660dee821d5d2b2989f495"},{"id":303685,"watched":false,"_id":"55660dee821d5d2b2989f494"},{"id":303686,"watched":false,"_id":"55660dee821d5d2b2989f493"},{"id":303687,"watched":false,"_id":"55660dee821d5d2b2989f492"},{"id":306290,"watched":false,"_id":"55660dee821d5d2b2989f491"},{"id":307185,"watched":false,"_id":"55660dee821d5d2b2989f490"},{"id":307186,"watched":false,"_id":"55660dee821d5d2b2989f48f"},{"id":307187,"watched":false,"_id":"55660dee821d5d2b2989f48e"},{"id":307188,"watched":false,"_id":"55660dee821d5d2b2989f48d"},{"id":307598,"watched":false,"_id":"55660dee821d5d2b2989f48c"},{"id":307599,"watched":false,"_id":"55660dee821d5d2b2989f48b"},{"id":307600,"watched":false,"_id":"55660dee821d5d2b2989f48a"},{"id":307601,"watched":false,"_id":"55660dee821d5d2b2989f489"},{"id":307602,"watched":false,"_id":"55660dee821d5d2b2989f488"},{"id":307603,"watched":false,"_id":"55660dee821d5d2b2989f487"},{"id":311578,"watched":false,"_id":"55660dee821d5d2b2989f486"},{"id":312115,"watched":false,"_id":"55660dee821d5d2b2989f485"},{"id":313489,"watched":false,"_id":"55660dee821d5d2b2989f484"},{"id":313490,"watched":false,"_id":"55660dee821d5d2b2989f483"},{"id":314958,"watched":false,"_id":"55660dee821d5d2b2989f482"},{"id":316735,"watched":false,"_id":"55660dee821d5d2b2989f481"},{"id":316736,"watched":false,"_id":"55660dee821d5d2b2989f480"},{"id":318688,"watched":false,"_id":"55660dee821d5d2b2989f47f"},{"id":318689,"watched":false,"_id":"55660dee821d5d2b2989f47e"},{"id":320164,"watched":false,"_id":"55660dee821d5d2b2989f47d"},{"id":320165,"watched":false,"_id":"55660dee821d5d2b2989f47c"},{"id":320166,"watched":false,"_id":"55660dee821d5d2b2989f47b"},{"id":323546,"watched":false,"_id":"55660dee821d5d2b2989f47a"},{"id":324761,"watched":false,"_id":"55660dee821d5d2b2989f479"},{"id":326982,"watched":false,"_id":"55660dee821d5d2b2989f478"},{"id":327432,"watched":false,"_id":"55660dee821d5d2b2989f477"},{"id":336246,"watched":false,"_id":"55660dee821d5d2b2989f476"},{"id":336994,"watched":false,"_id":"55660dee821d5d2b2989f475"},{"id":336996,"watched":false,"_id":"55660dee821d5d2b2989f474"},{"id":336995,"watched":false,"_id":"55660dee821d5d2b2989f473"},{"id":336997,"watched":false,"_id":"55660dee821d5d2b2989f472"},{"id":336998,"watched":false,"_id":"55660dee821d5d2b2989f471"},{"id":336999,"watched":false,"_id":"55660dee821d5d2b2989f470"},{"id":341994,"watched":false,"_id":"55660dee821d5d2b2989f46f"},{"id":342644,"watched":false,"_id":"55660dee821d5d2b2989f46e"},{"id":342791,"watched":false,"_id":"55660dee821d5d2b2989f46d"},{"id":344925,"watched":false,"_id":"55660dee821d5d2b2989f46c"},{"id":356536,"watched":false,"_id":"55660dee821d5d2b2989f46b"},{"id":356864,"watched":false,"_id":"55660dee821d5d2b2989f46a"},{"id":356865,"watched":false,"_id":"55660dee821d5d2b2989f469"},{"id":358458,"watched":false,"_id":"55660dee821d5d2b2989f468"},{"id":358460,"watched":false,"_id":"55660dee821d5d2b2989f467"},{"id":364031,"watched":false,"_id":"55660dee821d5d2b2989f466"},{"id":365959,"watched":false,"_id":"55660dee821d5d2b2989f465"},{"id":365960,"watched":false,"_id":"55660dee821d5d2b2989f464"},{"id":365968,"watched":false,"_id":"55660dee821d5d2b2989f463"},{"id":383453,"watched":false,"_id":"55660dee821d5d2b2989f462"},{"id":389043,"watched":false,"_id":"55660dee821d5d2b2989f461"},{"id":389893,"watched":false,"_id":"55660dee821d5d2b2989f460"},{"id":389891,"watched":false,"_id":"55660dee821d5d2b2989f45f"},{"id":389892,"watched":false,"_id":"55660dee821d5d2b2989f45e"},{"id":395634,"watched":false,"_id":"55660dee821d5d2b2989f45d"},{"id":395635,"watched":false,"_id":"55660dee821d5d2b2989f45c"},{"id":395636,"watched":false,"_id":"55660dee821d5d2b2989f45b"},{"id":405238,"watched":false,"_id":"55660dee821d5d2b2989f45a"},{"id":405239,"watched":false,"_id":"55660dee821d5d2b2989f459"},{"id":413503,"watched":false,"_id":"55660dee821d5d2b2989f458"},{"id":417814,"watched":false,"_id":"55660dee821d5d2b2989f457"},{"id":423101,"watched":false,"_id":"55660dee821d5d2b2989f456"},{"id":423607,"watched":false,"_id":"55660dee821d5d2b2989f455"},{"id":430613,"watched":false,"_id":"55660dee821d5d2b2989f454"},{"id":441084,"watched":false,"_id":"55660dee821d5d2b2989f453"},{"id":441631,"watched":false,"_id":"55660dee821d5d2b2989f452"},{"id":446079,"watched":false,"_id":"55660dee821d5d2b2989f451"},{"id":446080,"watched":false,"_id":"55660dee821d5d2b2989f450"},{"id":446081,"watched":false,"_id":"55660dee821d5d2b2989f44f"},{"id":549341,"watched":false,"_id":"55660dee821d5d2b2989f44e"},{"id":588941,"watched":false,"_id":"55660dee821d5d2b2989f44d"},{"id":588951,"watched":false,"_id":"55660dee821d5d2b2989f44c"},{"id":588961,"watched":false,"_id":"55660dee821d5d2b2989f44b"},{"id":792741,"watched":false,"_id":"55660dee821d5d2b2989f44a"},{"id":1088351,"watched":false,"_id":"55660dee821d5d2b2989f449"},{"id":1089771,"watched":false,"_id":"55660dee821d5d2b2989f448"},{"id":1089781,"watched":false,"_id":"55660dee821d5d2b2989f447"},{"id":1089791,"watched":false,"_id":"55660dee821d5d2b2989f446"},{"id":1089801,"watched":false,"_id":"55660dee821d5d2b2989f445"},{"id":1243321,"watched":false,"_id":"55660dee821d5d2b2989f444"},{"id":1243331,"watched":false,"_id":"55660dee821d5d2b2989f443"},{"id":1309971,"watched":false,"_id":"55660dee821d5d2b2989f442"},{"id":1312641,"watched":false,"_id":"55660dee821d5d2b2989f441"},{"id":1312651,"watched":false,"_id":"55660dee821d5d2b2989f440"},{"id":1312661,"watched":false,"_id":"55660dee821d5d2b2989f43f"},{"id":1359081,"watched":false,"_id":"55660dee821d5d2b2989f43e"},{"id":1366251,"watched":false,"_id":"55660dee821d5d2b2989f43d"},{"id":1501921,"watched":false,"_id":"55660dee821d5d2b2989f43c"},{"id":1502051,"watched":false,"_id":"55660dee821d5d2b2989f43b"},{"id":1671031,"watched":false,"_id":"55660dee821d5d2b2989f43a"},{"id":1580151,"watched":false,"_id":"55660dee821d5d2b2989f439"},{"id":1940861,"watched":false,"_id":"55660dee821d5d2b2989f438"},{"id":1947001,"watched":false,"_id":"55660dee821d5d2b2989f437"},{"id":1975631,"watched":false,"_id":"55660dee821d5d2b2989f436"},{"id":2018471,"watched":false,"_id":"55660dee821d5d2b2989f435"},{"id":2097141,"watched":false,"_id":"55660dee821d5d2b2989f434"},{"id":2097031,"watched":false,"_id":"55660dee821d5d2b2989f433"},{"id":2545911,"watched":false,"_id":"55660dee821d5d2b2989f432"},{"id":2737691,"watched":false,"_id":"55660dee821d5d2b2989f431"},{"id":2764221,"watched":false,"_id":"55660dee821d5d2b2989f430"},{"id":2764231,"watched":false,"_id":"55660dee821d5d2b2989f42f"},{"id":2764241,"watched":false,"_id":"55660dee821d5d2b2989f42e"},{"id":2964591,"watched":false,"_id":"55660dee821d5d2b2989f42d"},{"id":2916431,"watched":false,"_id":"55660dee821d5d2b2989f42c"},{"id":2994871,"watched":false,"_id":"55660dee821d5d2b2989f42b"},{"id":3052941,"watched":false,"_id":"55660dee821d5d2b2989f42a"},{"id":3055601,"watched":false,"_id":"55660dee821d5d2b2989f429"},{"id":3171951,"watched":false,"_id":"55660dee821d5d2b2989f428"},{"id":3193551,"watched":false,"_id":"55660dee821d5d2b2989f427"},{"id":3233191,"watched":false,"_id":"55660dee821d5d2b2989f426"},{"id":3406451,"watched":false,"_id":"55660dee821d5d2b2989f425"},{"id":3497811,"watched":false,"_id":"55660dee821d5d2b2989f424"},{"id":3653951,"watched":false,"_id":"55660dee821d5d2b2989f423"},{"id":3653961,"watched":false,"_id":"55660dee821d5d2b2989f422"},{"id":3696911,"watched":false,"_id":"55660dee821d5d2b2989f421"},{"id":3696921,"watched":false,"_id":"55660dee821d5d2b2989f420"},{"id":3696931,"watched":false,"_id":"55660dee821d5d2b2989f41f"},{"id":3950721,"watched":false,"_id":"55660dee821d5d2b2989f41e"},{"id":3696941,"watched":false,"_id":"55660dee821d5d2b2989f41d"},{"id":3950731,"watched":false,"_id":"55660dee821d5d2b2989f41c"},{"id":3950741,"watched":false,"_id":"55660dee821d5d2b2989f41b"},{"id":4120781,"watched":false,"_id":"55660dee821d5d2b2989f41a"},{"id":4123348,"watched":false,"_id":"55660dee821d5d2b2989f419"},{"id":4154006,"watched":false,"_id":"55660dee821d5d2b2989f418"},{"id":4154007,"watched":false,"_id":"55660dee821d5d2b2989f417"},{"id":4155042,"watched":false,"_id":"55660dee821d5d2b2989f416"},{"id":4179645,"watched":false,"_id":"55660dee821d5d2b2989f415"},{"id":4186890,"watched":false,"_id":"55660dee821d5d2b2989f414"},{"id":4186891,"watched":false,"_id":"55660dee821d5d2b2989f413"},{"id":4186892,"watched":false,"_id":"55660dee821d5d2b2989f412"},{"id":4194100,"watched":false,"_id":"55660dee821d5d2b2989f411"},{"id":4195866,"watched":false,"_id":"55660dee821d5d2b2989f410"},{"id":4195867,"watched":false,"_id":"55660dee821d5d2b2989f40f"},{"id":4218702,"watched":false,"_id":"55660dee821d5d2b2989f40e"},{"id":4232096,"watched":false,"_id":"55660dee821d5d2b2989f40d"},{"id":4254101,"watched":false,"_id":"55660dee821d5d2b2989f40c"},{"id":4238933,"watched":false,"_id":"55660dee821d5d2b2989f40b"},{"id":4253057,"watched":false,"_id":"55660dee821d5d2b2989f40a"},{"id":4256950,"watched":false,"_id":"55660dee821d5d2b2989f409"},{"id":4272471,"watched":false,"_id":"55660dee821d5d2b2989f408"},{"id":4284540,"watched":false,"_id":"55660dee821d5d2b2989f407"},{"id":4284537,"watched":false,"_id":"55660dee821d5d2b2989f406"},{"id":4277264,"watched":false,"_id":"55660dee821d5d2b2989f405"},{"id":4292733,"watched":false,"_id":"55660dee821d5d2b2989f404"},{"id":4292734,"watched":false,"_id":"55660dee821d5d2b2989f403"},{"id":4357945,"watched":false,"_id":"55660dee821d5d2b2989f402"},{"id":4376683,"watched":false,"_id":"55660dee821d5d2b2989f401"},{"id":4376684,"watched":false,"_id":"55660dee821d5d2b2989f400"},{"id":4381074,"watched":false,"_id":"55660dee821d5d2b2989f3ff"},{"id":4387916,"watched":false,"_id":"55660dee821d5d2b2989f3fe"},{"id":4393010,"watched":false,"_id":"55660dee821d5d2b2989f3fd"},{"id":4410873,"watched":false,"_id":"55660dee821d5d2b2989f3fc"},{"id":4415788,"watched":false,"_id":"55660dee821d5d2b2989f3fb"},{"id":4422621,"watched":false,"_id":"55660dee821d5d2b2989f3fa"},{"id":4422622,"watched":false,"_id":"55660dee821d5d2b2989f3f9"},{"id":4440720,"watched":false,"_id":"55660dee821d5d2b2989f3f8"},{"id":4440721,"watched":false,"_id":"55660dee821d5d2b2989f3f7"},{"id":4443834,"watched":false,"_id":"55660dee821d5d2b2989f3f6"},{"id":4443835,"watched":false,"_id":"55660dee821d5d2b2989f3f5"},{"id":4467901,"watched":false,"_id":"55660dee821d5d2b2989f3f4"},{"id":4473865,"watched":false,"_id":"55660dee821d5d2b2989f3f3"},{"id":4478866,"watched":false,"_id":"55660dee821d5d2b2989f3f2"},{"id":4496094,"watched":false,"_id":"55660dee821d5d2b2989f3f1"},{"id":4496095,"watched":false,"_id":"55660dee821d5d2b2989f3f0"},{"id":4496096,"watched":false,"_id":"55660dee821d5d2b2989f3ef"},{"id":4506067,"watched":false,"_id":"55660dee821d5d2b2989f3ee"},{"id":4518962,"watched":false,"_id":"55660dee821d5d2b2989f3ed"},{"id":4521867,"watched":false,"_id":"55660dee821d5d2b2989f3ec"},{"id":4529513,"watched":false,"_id":"55660dee821d5d2b2989f3eb"},{"id":4594865,"watched":false,"_id":"55660dee821d5d2b2989f3ea"},{"id":4594932,"watched":false,"_id":"55660dee821d5d2b2989f3e9"},{"id":4621493,"watched":false,"_id":"55660dee821d5d2b2989f3e8"},{"id":4611513,"watched":false,"_id":"55660dee821d5d2b2989f3e7"},{"id":4621494,"watched":false,"_id":"55660dee821d5d2b2989f3e6"},{"id":4630011,"watched":false,"_id":"55660dee821d5d2b2989f3e5"},{"id":4621495,"watched":false,"_id":"55660dee821d5d2b2989f3e4"},{"id":4632232,"watched":false,"_id":"55660dee821d5d2b2989f3e3"},{"id":4659012,"watched":false,"_id":"55660dee821d5d2b2989f3e2"},{"id":4632233,"watched":false,"_id":"55660dee821d5d2b2989f3e1"},{"id":4669991,"watched":false,"_id":"55660dee821d5d2b2989f3e0"},{"id":4632235,"watched":false,"_id":"55660dee821d5d2b2989f3df"},{"id":4632234,"watched":false,"_id":"55660dee821d5d2b2989f3de"},{"id":4659008,"watched":false,"_id":"55660dee821d5d2b2989f3dd"},{"id":4669992,"watched":false,"_id":"55660dee821d5d2b2989f3dc"},{"id":4659009,"watched":false,"_id":"55660dee821d5d2b2989f3db"},{"id":4669993,"watched":false,"_id":"55660dee821d5d2b2989f3da"},{"id":4659010,"watched":false,"_id":"55660dee821d5d2b2989f3d9"},{"id":4669994,"watched":false,"_id":"55660dee821d5d2b2989f3d8"},{"id":4659011,"watched":false,"_id":"55660dee821d5d2b2989f3d7"},{"id":4742877,"watched":false,"_id":"55660dee821d5d2b2989f3d6"},{"id":4742878,"watched":false,"_id":"55660dee821d5d2b2989f3d5"},{"id":4742879,"watched":false,"_id":"55660dee821d5d2b2989f3d4"},{"id":4844181,"watched":false,"_id":"55660dee821d5d2b2989f3d3"}]}]
			};

for (var i =0; i<jus.series[0].episodes.length; i++ ) {
	delete jus.series[0].episodes[i]._id;
}

delete jus.__v;
delete jus._id;
delete jus.series[0]._id;


console.log(JSON.stringify(jus));


/*
request('http://thetvdb.com/api/DFC9CF716B0709C4/series/75760/all/de.xml', function (error, response, body) {

  	if (!error && response.statusCode == 200) {
  		data.xml = body;
  		start();
  	}

});





function start () {

	//console.log(data.xml);

	parseString(data.xml, {explicitRoot: false, explicitArray : false} ,function (err, result) {


    var series = new Series(result);
	series.save(function (err, storedSeries) {		
		if (storedSeries && !err) {
			console.log('Success: insert series');
			console.log(storedSeries);
			throw "ende";
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

*/