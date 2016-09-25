// HTTP server

var express = require('express');
var app = express();

app.listen(3000);

console.log('HTTP server started on port 3000');

serve('/', '/index.html');
serve('/canvas.js');

function serve(path, file) {
	app.get(path, function(req, res) {
		res.sendfile(__dirname + (file || path));
	});
}

// WebSocket server

var WebSocketServer = require('ws').Server;

var ws = new WebSocketServer({port: 8080});

ws.broadcast = function(data) {
  for (var c in this.clients)
    this.clients[c].send(data);
};

ws.on('connection', function(socket) {
  var id = this.clients.length;

  socket.send(JSON.stringify({
    type: 'your id',
    from: id,
  }));

  socket.on('message', function(message) {
    var msg = JSON.parse(message);
    msg.from = id;
    ws.broadcast(JSON.stringify(msg));
  });
});

console.log('WebSocket server started on port 8080');
