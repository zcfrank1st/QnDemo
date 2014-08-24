var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var client = require('./utils/qn');

var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendfile('./public/videos.html');
});

app.get('/list', function (req, res) {
  client().list('/', function (err, result) {
    res.json(result);
  });
});

app.post('/delete',function (req, res) {
    client().delete(req.body.filename, function (err) {
        if (err) {
            //TODO  处理
        }
        res.end();
    });
});

app.get('*', function (req, res) {
  res.sendfile('public/videos.html');
});

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.end('dev error');
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.end('error');
});

app.set('port', process.env.PORT || 3000);


var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});