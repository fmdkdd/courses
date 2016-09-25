/* eslint-env node */

// Chat server
// A small chat server written for vanilla nodejs.

// Documentation: http://devdocs.io/node/net
var net = require('net');

var port = 6667;
var server = net.createServer();

// The Client object as an abstraction for the socket.
var Client = {
  new: function(socket) {
    // Necessary to treat all data as utf8-encoded strings
    socket.setEncoding('utf8');

    return {
      __proto__: this,
      socket: socket,
    };
  },

  tell: function(msg) {
    this.socket.write(msg);
  },

  join: function() {
    clients.broadcast('*** ' + this.name + ' joined\n');
  },

  leave: function() {
    clients.broadcast('*** ' + this.name + ' left\n');
  },

  says: function(data) {
    // First message we receive from the client will be its name
    if (this.name == null) {
      this.name = data.replace(/\n/,'');
      this.tell('Welcome, ' + this.name + '\n');
      this.join();
      this.tell('Users: ' + clients.list().join(', ') + '\n');
    }
    else
      clients.broadcast(this.name + '> ' + data);
  },
};

// The list of connected clients.  Used to broadcast messages to all.
var clients = {
  clients: [],

  add: function(client) {
    this.clients.push(client);
    return client;
  },

  remove: function(client) {
    var idx = this.clients.indexOf(client);
    if (idx !== -1)
      this.clients.splice(idx, 1);
  },

  broadcast: function(msg) {
    this.clients.forEach(function(c) {
      c.tell(msg);
    });
  },

  list: function() {
    return this.clients.map(function(c) {
      return c.name;
    });
  },
};

// Creates a socket when a connection is made.
server.on('connection', function(socket) {
  console.log('new socket', socket.address());

  var client = clients.add(Client.new(socket));
  client.tell('Enter your name\n');

  socket.on('data', function(data) {
    console.log('data', data);
    client.says(data);
  });

  socket.on('error', function(error) {
    console.log('error', error);
  });

  socket.on('close', function(error) {
    console.log('Client left', error);
    clients.remove(client);
    client.leave();
  });
});

// When the server is ready
server.on('listening', function() {
  console.log('server started on port', port);
});

// Start the server
server.listen(port);
