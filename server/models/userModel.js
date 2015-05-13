var mongoose = require('mongoose');
var Schema = mongoose.Schema;



<<<<<<< HEAD
// var EpisodeSchema = new Schema({
// 	number: int,
// 	watched: Boolean
// });
=======
var EpisodeSchema = new Schema({
	number: Number,
	watched: Boolean
});
>>>>>>> 980a4020f10c97f21a5fbb44a141ba396388cb57

// var SeasonSchema = new Schema({
// 	number: String,
// 	episodes: [EpisodeSchema]
// });

// var SeriesSchema = new Schema({
// 	name: String,
// 	tvdatabaseID: String,
// 	seasons: [SeasonSchema]
// });


<<<<<<< HEAD
// var UserSchema = Schema({
// 	userID: int,
// 	userLoginToken: String,
// 	name: String,
// 	series: [SeriesSchema]
=======
var UserSchema = Schema({
	userId: Number,
	userLoginToken: String,
	name: String,
	series: [SeriesSchema]
>>>>>>> 980a4020f10c97f21a5fbb44a141ba396388cb57


// });




UserSchema.statics = {
	load: function(id, cb){
		this.findOne({_id:id}).exec(cb);
	}
}


mongoose.model('UserModel', UserSchema);
