var express = require('express');
var router = express.Router();


var serien = require('../controllers/serieController');

/* POST new Serie. */
router.post('/', serien.post);
router.get('/', serien.get);
router.get('/:serieId', serien.show);
router.put('/:serieId', serien.put);
router.delete('/:serieId', serien.delete);

module.exports = router;
