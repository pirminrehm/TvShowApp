var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SerieSchema = new Schema({
	name: String,
	tvdatabaseID: String,
	season:String
});


SerieSchema.statics = {
	load: function(id, cb){
		this.findOne({_id:id}).exec(cb);
	}
}


mongoose.model('Serie', SerieSchema);
