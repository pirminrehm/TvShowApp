//require globale packages
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

//require local packaes


var series = require('./routes/seriesRoutes');
var usr = require('./routes/usersRoutes');
var config = require('./config.json');





var app = express();


//Initialization of mongoDB
mongoose.connect(config.dbUrl);
var db = mongoose.connection;

db.on('error', function callback() {
  console.log('Verbindung zu MongoDB fehlgeschlagen');
});


db.on('open', function callback() {
  console.log('Verbindung zu MongoDB erfolgreich (Database: ' + config.dbUrl + ")");
});






app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//use local packages

app.use('/series', series);
app.use('/usr', usr);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});







module.exports = app;
