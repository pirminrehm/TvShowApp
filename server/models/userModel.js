var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EpisodeSchema = new Schema({
 	id: { type: Number,  required: true},
 	w: { type: Boolean,  required: true},	
 	n: String,		
 	sNr: { type: String,  required: true},
 	eNr: { type: String,  required: true}
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
 	id: { type: String,  required: true},
 	bannerUrl: String,
 	episodes: [EpisodeSchema]

  });


var UserSchema = Schema({
	email: { type: String,  required: true},
	token: { type: String,  required: true},
	validated: { type: Boolean,  required: true},
	series: [SeriesSchema]

 });

UserSchema.index({ email: 1},{ unique: true, dropDups: false });
UserSchema.index({ token: 1},{ unique: true, dropDups: false });
//
mongoose.model('User', UserSchema);
