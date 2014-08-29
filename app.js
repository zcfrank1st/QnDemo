var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var http = require('http');
var path = require('path');
var fs = require('fs');
var client = require('./utils/qn');

var app = express();

app.use(favicon(path.join(__dirname, 'public/img/i.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(busboy());
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

app.post('/delete', function (req, res) {
  client().delete(req.body.filename, function (err) {
    if (err) {
      //TODO  处理
    }
    res.end();
  });
});

app.post('/uploadfile', function (req, res) {
  var token = client().uploadToken();
  req.pipe(req.busboy);

  var myfilename = '';
  var buffers = [];
  var nread = 0;
  var buffer = null;

  req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    var createTmpFile = fs.createWriteStream('tmp/' + filename);
    myfilename = filename;
    file.on('data', function (data) {
      createTmpFile.write(data);
    });
    file.on('end', function () {
      createTmpFile.end();
    });
  });
  req.busboy.on('finish', function () {
    var fileReadStream = fs.createReadStream('tmp/' + myfilename);
    fileReadStream.on('data', function (data) {
      buffers.push(data);
      nread += data.length;
    });

    fileReadStream.on('end', function () {
      switch (buffers.length) {
      case 0:
        buffer = new Buffer(0);
        break;
      case 1:
        buffer = buffers[0];
        break;
      default:
        buffer = new Buffer(nread);
        for (var i = 0, pos = 0, l = buffers.length; i < l; i++) {
          var chunk = buffers[i];
          chunk.copy(buffer, pos);
          pos += chunk.length;
        }
        break;
      }
      var postBodyHead =
        '------WebKitFormBoundaryebFz3Q3NHxk7g4qY123' + "\r\n" +
        'Content-Disposition: form-data; name="token"' + "\r\n" +
        '\r\n' +
        token + "\r\n" +
        '------WebKitFormBoundaryebFz3Q3NHxk7g4qY123' + "\r\n" +
        'Content-Disposition: form-data; name="key"' + "\r\n" +
        '\r\n' +
        myfilename + "\r\n" +
        '------WebKitFormBoundaryebFz3Q3NHxk7g4qY123' + "\r\n" +
        'Content-Disposition: form-data; name="file";filename=' + myfilename + "\r\n" +
        'Content-Type: application/octet-stream' + "\r\n" +
        'Content-Transfer-Encoding: binary' + "\r\n" +
        '\r\n';
      var postBodyTail = "\r\n" +
        '------WebKitFormBoundaryebFz3Q3NHxk7g4qY123--';

      var headers = {
        "Host": 'upload.qiniu.com',
        "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryebFz3Q3NHxk7g4qY123",
        "Content-Length": Buffer.byteLength(postBodyHead) + Buffer.byteLength(postBodyTail) + buffer.length
      };

      //These are the post options
      var options = {
        hostname: 'upload.qiniu.com',
        method: 'POST',
        headers: headers
      };

      var responseBody = '';

      // set up the request and the callbacks to handle the response data
      var request = http.request(options, function (response) {
        // when we receive data, store it in a string
        response.on('data', function (chunk) {
          responseBody += chunk;
        });
        // at end the response, run a function to do something with the response data
        response.on('end', function () {
          console.log(responseBody);
          res.end();
        });
      });

      // basic error function
      request.on('error', function (e) {
        console.log('problem with request: ' + e.message);
      });

      // write our post body to the request
      request.write(postBodyHead);

      var fileStream = fs.createReadStream('tmp/' + myfilename);
      fileStream.pipe(request, {
        end: false
      });
      fileStream.on('end', function () {
        // mark the end of the one and only part
        fs.unlinkSync('tmp/' + myfilename);
        request.end(postBodyTail);

      });

    });
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