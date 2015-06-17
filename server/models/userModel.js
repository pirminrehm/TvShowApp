var mongoose = require('mongoose');
var Schema = mongoose.Schema;





var EpisodeSchema = new Schema({
 	id: Number,
 	watched: Boolean
 });



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
