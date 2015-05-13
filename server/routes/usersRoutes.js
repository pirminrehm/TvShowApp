var express = require('express');
var router = express.Router();


var user = require('../controllers/userController');

//Define all routes for ...  /user/ ....


/* POST new Serie. */
router.post('/', user.post);
router.get('/', user.get);
router.get('/:serieId', user.show);
router.put('/:serieId', user.put);
router.delete('/:serieId', user.delete);

module.exports = router;
