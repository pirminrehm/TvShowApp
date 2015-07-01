//require globale packages
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

//require local packaes


var series = require('./routes/seriesRoutes');
var usr = require('./routes/usersRoutes');
var config = require('./config.json');
var loggingStart = require('./bin/loggingStart');





var app = express();


//Initialization of mongoDB outsourced to bon/startMono.js






app.use(cors());

//loggingStart has to be set bevore all!
loggingStart.getLogging ( function (logging) {
  if (logging) {
    app.use(logger('dev'));
  }
});

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
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).jsonp({"error": err.message,"errorStack": err  });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).jsonp({"error": err.message,"errorStack": {}  });
});








module.exports = app;
