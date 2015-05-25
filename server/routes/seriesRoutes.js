var express = require('express');
var router = express.Router();
var seriesController = require('../controllers/seriesController');


// GET /series/token/6752c09377e2105a1ca2748c79dac931c8e67b63/searchresult/search/houseofcards
// search for searchstring (Return: search result from TvDatabase)
// Test NOT implemented
router.get('/token/:token/searchresult/search/:searchString', seriesController.search);


// GET /series/token/6752c09377e2105a1ca2748c79dac931c8e67b63/series/262980/details
// get all meta information of a series but not the episodes (Return Series.Series)
// Test NOT implemented
router.get('/token/:token/series/:seriesId/details', seriesController.getSeriesDetails);


// GET /series/token/6752c09377e2105a1ca2748c79dac931c8e67b63/episode/4411361/details
// get all meta information of an episode (Return: Episode)
// Test NOT implemented
router.get('/token/:token/episode/:episodeId/details', seriesController.getEpisodeDetails);


module.exports = router;