var file = require('../server/test/testData.json');
var data = file.houseOfCards.Episode;
var _ = require('underscore');
var util = require('util');



var myObject = {
	"testString" : "hello i am a string",
	"testStringArray" : ["ar1", "ar2", "ar3"],
	"testObjectArray" : [
		{"val1": "string in array object"}, 
		{"val2": {
					"arrayInside" : ["abc", "def"],
					"stringInside" : "hallo123"
					}},
		{"val3": {
					"arrayInside" : ["zwei", "two"],
					"stringInside" : "hallo the second"
					}},
		{"val3": {
					"arrayInside" : ["drei", "three"],
					"stringInside" : "hallo the thrid"
					}}
		],
	"testObject": {
		"first" : "is a string",
		"second": {"is" : "an inside object"}
	},
	"_id": "asdgadafbflsdjskfjslksflkee"
}


var myNewObject = {
	"testString" : "hello i am a string - NEW",
	"testStringArray" : ["ar1", "ar2", "NEW"],
	"testObjectArray" : [
		{"val1": "string in array object"}, 
		{"val2": {
					"arrayInside" : ["abc", "def"],
					"stringInside" : "hallo123"
					}},
		{"val3": {
					"arrayInside" : ["zwei", "two"],
					"stringInside" : "hallo the second"
					}},
		{"val3": {
					"arrayInside" : ["drei", "three", "NEW"],
					"stringInside" : "hallo the thrid"
					}},
		{"val4NEW": {
					"arrayInside" : ["vier", "four"],
					"stringInside" : "hallo the fourth"
					}}
		],
	"testObject": {
		"second": {
			"is" : "an inside object",
			"isNEW" : "NEW NEW"
		}
	}
}


var finalObject = _.extend(myObject, myNewObject);

console.log(util.inspect(myObject, false, null));
console.log(util.inspect(myNewObject, false, null));
console.log(util.inspect(finalObject, false, null));










function orString () {
	var message = "";

	var newM = message || "nix da";
	console.log(newM);

	message = "hallo 123";

	var newM = message || "nix da";
	console.log(newM);
}





function generateTestData () {
	var s = "";
	var episodes =  [];
	for(var i=0; i<data.length; i++){
		episodes.push({
			"id"  : data[i].id, 
			"w"   : false,
			"n"   : data[i].EpisodeName,
			"sNr" : data[i].SeasonNumber,
			"eNr" : data[i].EpisodeNumber 
		});

			
		// s = s + "{\"id\":\"" + data[i].id + "\",\"watched\":\"false\"},";
		// s = s + "{\"id\":" + data[i].id + ",\"watched\":false},";
		
	}
	console.log(JSON.stringify(episodes));


	// var EpisodeSchema = new Schema({
	//  	id: Number, 	--> id
	//  	w: Boolean,		--> watched
	//  	n: String,		--> names
	//  	sNr: String,	--> seasonNumber
	//  	eNr: String		--> episodeNumber
	//  });
}