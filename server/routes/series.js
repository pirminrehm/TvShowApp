var express = require('express');
var router = express.Router();


var series = require('../controllers/seriesController');

/* POST new Serie. */
router.post('/', series.post);
router.get('/', series.get);
router.get('/:serieId', series.show);
router.put('/:serieId', series.put);
router.delete('/:serieId', series.delete);

module.exports = router;

console.log("Success: routes/series.js");