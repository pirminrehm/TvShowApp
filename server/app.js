//require globale packages
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

//require local packaes
<<<<<<< HEAD
// var users = require('./routes/usersRoutes');
var series = require('./routes/seriesRoutes');
var config = require('./config.json');
=======
var routes = require('./routes/index');
var users = require('./routes/users');
//var series = require('./routes/series');
>>>>>>> 980a4020f10c97f21a5fbb44a141ba396388cb57


var app = express();


//Initialization of mongoDB
mongoose.connect('mongodb://localhost/testdb');
var db = mongoose.connection;

db.on('error', function callback() {
  console.log('Verbindung zu MongoDB fehlgeschlagen');
});

<<<<<<< HEAD
db.on('open', function callback() {
  console.log('Verbindung zu MongoDB erfolgreich (Database: ' + config.dbUrl + ")");
});


=======
db.once('open', function callback(){
  console.log("Success: MongoDB Verbindung");
});




>>>>>>> 980a4020f10c97f21a5fbb44a141ba396388cb57
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//use local packages
<<<<<<< HEAD

// app.use('/user', users);
app.use('/series', series);
=======
app.use('/', routes);
app.use('/user', users);
//app.use('/series', series);
>>>>>>> 980a4020f10c97f21a5fbb44a141ba396388cb57


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

console.log("Success: 404 Initialization");

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

console.log("Success: Error Handler");

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

console.log("Success: End of Neddit");
