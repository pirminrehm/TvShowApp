var express = require('express');
var router = express.Router();

//just for developement to check if express works -> no real function


// GET home page
router.get('/', function(req, res, next) {
  res.send('Hello World - Home Page of our TvDataBase Web Application - P.S.: Der letzte räumte die Erde auf');
});

module.exports = router;

console.log("Success: routes/Index.js");
