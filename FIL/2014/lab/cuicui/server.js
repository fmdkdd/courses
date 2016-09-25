/* eslint-env node */

var http = require('http');
var fs = require('fs');

var urls = [
  ['GET', '^/$', serveFile('index.html', 'text/html')],
  ['GET', '^/cuicui.js$', serveFile('cuicui.js', 'application/javascript')],
  ['GET', '^/pics$', sendPics],
  ['GET', '^/pics/', sendPics],
  ['POST', '^/pics$', receivePic],
];

var pics = [];

function sendPics(req, res, args) {
  var chans = args.split(',').filter(function(s) {
    return s.trim().length > 0;
  });

  var ps = [];
  if (chans.length === 0)
    ps = pics;
  else {
    ps = pics.filter(function(pic) {
      return chans.indexOf(pic.user) !== -1;
    });
  }

  res.writeHead('200', {'Content-Type': 'application/json'});
  res.end(JSON.stringify(ps));
}

function receivePic(req, res) {
  var data = '';

  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    pics.push(JSON.parse(data));

    res.writeHead(201, {'Content-Type': 'text/plain'});
    res.end('Added pic');
  });
}

function serveFile(filename, contentType) {
  return function(req, res) {
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Server error');
        console.error('Error', err);
      }

      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    });
  };
}

function serve404(req, res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('404: Page not found');
}

function route(req, res) {
  console.info(req.method, req.url);

  var matches = urls.filter(function(url) {
    return req.method === url[0] && req.url.match(url[1]);
  });

  if (matches.length === 0)
    return serve404(req, res);

  var m = matches[0];
  var args = req.url.split(new RegExp(m[1]))[1];
  return m[2](req, res, args);
}

http.createServer(function (req, res) {
  route(req, res);
}).listen(3000);
