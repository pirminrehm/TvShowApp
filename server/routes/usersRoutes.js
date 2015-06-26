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


// POST /usr/register
// register a new account
// Test NOT implemented
router.post('/mail/get', user.postTokenViaMail);


// GET /usr/register/verify/6752c09377e2105a1ca2748c79dac931c8e67b63/test
// verify an account with the token
// Test implemented
router.get('/register/verify/:token', user.verifyAccount);


// GET /usr/token/6752c09377e2105a1ca2748c79dac931c8e67b63/series/262980
// downloads the whole series from TvDatabase and stores it into our local MongoDB and adds the new series to User.series array (Return: User)
// Test implemented
router.get('/token/:token/series/:seriesId', user.addSeriesToList);


// DELETE /usr/token/6752c09377e2105a1ca2748c79dac931c8e67b63/series/262980
// removes the series from the User.series array (Return: Series)
// Test implemented
router.delete('/token/:token/series/:seriesId', user.deleteSeriesFromList);


// GET /usr/token/6752c09377e2105a1ca2748c79dac931c8e67b63/user/all
// get all information about an user including his series (Return: User)
// Test implemented
router.get('/token/:token/user/all', user.getAllUserInformation);


// PUT /usr/token/6752c09377e2105a1ca2748c79dac931c8e67b63/watched/true/episode/4411361
// changes the value of the watched attribut in an episode (Return: User)
// Test implemented
router.put('/token/:token/watched/:bool/episode/:episodeId', user.updateEpisodeWatched);


// PUT /usr/token/6752c09377e2105a1ca2748c79dac931c8e67b63/watched/true/episode/4411361
// changes the value of the watched attribut of all episodes in an season (Return: User)
// Test implemented
router.put('/token/:token/watched/:bool/series/:seriesId/season/:seasonNr', user.updateSeasonWatched);


module.exports = router;