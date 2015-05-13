var express = require('express');
var router = express.Router();


var user = require('../controllers/userController');

//Define all routes for ...  /user/ ....


/* POST new Serie. */
router.post('/', user.post);
router.get('/:userId', user.show);
router.put('/:userId', user.put);
router.delete('/:userId', user.delete);

module.exports = router;

console.log("Success: routes/users.js");


/*
Annahme, dass folgendes nur zum Test war, deswegen auskommentiert:

router.get('/', user.get);


*/
