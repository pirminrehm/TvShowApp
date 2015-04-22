var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SerieSchema = new Schema({
	name: String,
	tvdatabaseID: String,
	season:String
});













var SerieSchema = new Schema({
	name: String,
	tvdatabaseID: String,
	season: String
});




{
	"name" : "How I Met Your Mother",
	"tvdatabaseID" : "tdvid346243234234",
	"season" : {
				"s1":
					{
						"e1":true,
						"e2":true,
						"e3":true,
						"e4":true,
						"e5":false,
						"e6":true,
						"e7":true,
						"e8":false
					}

				"s1":
					{
						"e1":true,
						"e2":true,
						"e3":true,
						"e4":true,
						"e5":false,
					}
				}
}












































SerieSchema.statics = {
	load: function(id, cb){
		this.findOne({_id:id}).exec(cb);
	}
}


mongoose.model('Serie', SerieSchema);
