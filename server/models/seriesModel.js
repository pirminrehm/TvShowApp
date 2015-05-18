
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var EpisodeSchema = new Schema({  
      id : Number,
      Combined_episodenumber : Number,
      Combined_season : String,
      DVD_chapter : String,
      DVD_discid : String,
      DVD_episodenumber : String,
      DVD_season : String,
      Director : String,
      EpImgFlag : String,
      EpisodeName : String,
      EpisodeNumber : String,
      FirstAired : String,
      GuestStars : String,
      IMDB_ID : String,
      Language : String,
      Overview : String,
      ProductionCode : String,
      Rating : String,
      RatingCount : String,
      SeasonNumber : String,
      Writer : String,
      absolute_number : String,
      airsafter_season : String,
      airsbefore_episode : String,
      airsbefore_season : String,
      filename : String,
      lastupdated : String,
      seasonid : String,
      seriesid : String,
      thumb_added : String,
      thumb_height : String,
      thumb_width : String
});


var DataSchema = new Schema({
      id: String,
      Actors: String,
      Airs_DayOfWeek: String,
      Airs_Time: String,
      ContentRating: String,
      FirstAired: String,
      Genre: String,
      IMDB_ID: String,
      Language: String,
      Network: String,
      NetworkID: String,
      Overview: String,
      Rating: String,
      RatingCount: String,
      Runtime: String,
      SeriesID: String,
      SeriesName: String,
      Status: String,
      added : String,
      addedBy : String,
      banner: String,
      fanart: String,
      lastupdated: String,
      poster: String,
      tms_wanted_old: String,
      zap2it_id: String
});


var SeriesSchema = new Schema({
    Data: DataSchema,    
    Episode: [EpisodeSchema]

});


mongoose.model('SeriesModel', SeriesSchema);