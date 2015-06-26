var mongoose = require('mongoose');
var Schema = mongoose.Schema;





var EpisodeSchema = new Schema({
 	id: Number,
 	w: Boolean,		
 	n: String,		
 	sNr: String,
 	eNr: String
 });


// var EpisodeSchema = new Schema({
//  	id: Number, 	--> id
//  	w: Boolean,		--> watched
//  	n: String,		--> names
//  	sNr: String,	--> seasonNumber
//  	eNr: String		--> episodeNumber
//  });


var SeriesSchema = new Schema({
 	name: String,
 	id: String,
 	bannerUrl: String,
 	episodes: [EpisodeSchema]

  });


var UserSchema = Schema({
	email: String,
	token: String,
	validated: Boolean,
	series: [SeriesSchema]

 });


/*

UserSchema.statics = {
	load: function(id, cb){
		this.findOne({_id:id}).exec(cb);
	}
}

*/


mongoose.model('User', UserSchema);
