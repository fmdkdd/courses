/* eslint-env node */

var httpPort = 3000;
var wsPort = 3001;

// HTTP server

var express = require('express');
var app = express();
var path = require('path');

serve('/', 'index.html');
serve('/canvas.js', 'canvas.js');
// Add any file you need here, like jquery
//serve('/jquery.js', 'jquery.js');

// Serve `file` when a request is made for `path`
function serve(url, file) {
  // Assuming files are in the current directory;
  var fullpath = path.resolve(file);
  app.get(url, function(req, res) {
    res.sendFile(fullpath);
  });
}

app.listen(httpPort, function() {
  console.log('HTTP server listening at http://localhost:%s', httpPort);
});

// WebSocket server

var WebSocketServer = require('ws').Server;

var ws = new WebSocketServer({port: wsPort});

// from example at https://github.com/einaros/ws
ws.broadcast = function(data) {
  // this.clients holds all connected clients
  for (var c in this.clients)
    this.clients[c].send(data);
};

ws.on('connection', function(socket) {
  socket.on('message', function(message) {
    ws.broadcast(message);
  });
});

console.log('WebSocket server started on port', wsPort);
