var mongoose = require('mongoose');
var Schema = mongoose.Schema;



// var EpisodeSchema = new Schema({
// 	number: int,
// 	watched: Boolean
// });

// var SeasonSchema = new Schema({
// 	number: String,
// 	episodes: [EpisodeSchema]
// });

// var SeriesSchema = new Schema({
// 	name: String,
// 	tvdatabaseID: String,
// 	seasons: [SeasonSchema]
// });


// var UserSchema = Schema({
// 	userID: int,
// 	userLoginToken: String,
// 	name: String,
// 	series: [SeriesSchema]


// });










































UserSchema.statics = {
	load: function(id, cb){
		this.findOne({_id:id}).exec(cb);
	}
}


mongoose.model('UserModel', UserSchema);
