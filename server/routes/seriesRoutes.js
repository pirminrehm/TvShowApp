var express = require('express');
var router = express.Router();


var seriesController = require('../controllers/seriesController');

// GET /series/searchresult/search/houseofcards
// search for searchstring
// Test MISSING
router.get('/searchresult/search/:searchString', seriesController.search);



module.exports = router;
