var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');

var appConfig = require('./config/app-config');
var routes = require('./routes/index');

var app = express();

// create a write stream for log (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/app.log', {flags: 'a'});
// setup the logger
app.use(logger('combined', {stream: accessLogStream}));

// view engine setup
app.engine('.hbs', expressHbs({extname:'.hbs', defaultLayout:'main'}));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// set router
app.use('/', routes);

// set home page
app.get('/', function (req, res) {
    res.render('home', {title: 'Just Pay demo'});
});

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

// setup the server to listen on a port
app.listen(appConfig.web.port, function() {
  console.log('Server has started on port: ' + appConfig.web.port);
});

module.exports = app;