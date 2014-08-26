var http = require('http');
var fs = require('fs');
var client = require('../utils/qn');

var token = client().uploadToken();
var fileReadStream = fs.createReadStream('../tmp/11.mp3');

var buffers = [];
var nread = 0;
var buffer = null;

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


    var g = fs.createWriteStream('../tmp/11.mp3');
    g.write(buffer);
    g.end();
    var postBodyHead =
        '------WebKitFormBoundaryebFz3Q3NHxk7g4qY123' + "\r\n" +
        'Content-Disposition: form-data; name="token"' + "\r\n" +
        '\r\n' +
        token + "\r\n" +
        '------WebKitFormBoundaryebFz3Q3NHxk7g4qY123' + "\r\n" +
        'Content-Disposition: form-data; name="key"' + "\r\n" +
        '\r\n' +
        '211.mp3' + "\r\n" +
        '------WebKitFormBoundaryebFz3Q3NHxk7g4qY123' + "\r\n" +
        'Content-Disposition: form-data; name="file";filename="211.mp3"' + "\r\n" +
        'Content-Type: application/octet-stream' + "\r\n" +
        'Content-Transfer-Encoding: binary' + "\r\n" +
        '\r\n';
    var postBodyTail = "\r\n" +
        '------WebKitFormBoundaryebFz3Q3NHxk7g4qY123--';

    var headers = {
        //"Host": 'localhost:3000',
        "Host": 'upload.qiniu.com',
        "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryebFz3Q3NHxk7g4qY123",
        "Content-Length": Buffer.byteLength(postBodyHead)+Buffer.byteLength(postBodyTail)+buffer.length
    };

    //These are the post options
    var options = {
        hostname: 'upload.qiniu.com',
        //port: 3000,
        //path: '/obtain',
        method: 'POST',
        headers: headers
    };

    // so we can see that things look right
//    console.log("postBody:\n" + postBody);
//    console.log("postBody.length:\n" + postBody.length);    console.log("postBody:\n" + postBody);
//    console.log("postBody.length:\n" + postBody.length);

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
        });
    });

    // basic error function
    request.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write our post body to the request
    request.write(postBodyHead);

    var fileStream = fs.createReadStream("../tmp/11.mp3");
    fileStream.pipe(request, {end: false});
    fileStream.on('end', function() {
        // mark the end of the one and only part
        request.end(postBodyTail);

    });
});