var WebSocketServer = require('ws').Server;

var server = new WebSocketServer({port: 8080});

server.broadcast = function(data) {
  for (var c in this.clients)
    this.clients[c].send(data);
};

server.on('connection', function(socket) {
  socket.on('message', function(message) {
    server.broadcast(message);
  });
});

console.log('WebSocket server started on port 8080');
