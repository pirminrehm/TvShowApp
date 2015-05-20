var express = require('express');
var router = express.Router();
var config = require('../config.json');



var user = require('../controllers/userController');


// GET /usr/6752c09377e2105a1ca2748c79dac931c8e67b63/test
// just get a test response to a restriced area
// Test NOT implemented
router.get('/:token/test', user.test);


// POST /usr/register
// register a new account
// Test implemented
router.post('/register', user.registerAccount);


// GET /usr/register/verify/6752c09377e2105a1ca2748c79dac931c8e67b63/test
// verify an account with the token
// Test implemented
router.get('/register/verify/:token', user.verifyAccount);


// PUT /usr/add/series
// Add a series to an account
// Test NOT implemented
router.put('/add/series/:seriesId', user.addSeries);







module.exports = router;


