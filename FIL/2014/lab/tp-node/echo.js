/* eslint-env node */

// ## Echo server
// Use as a sounding board.

// Test with `nc localhost 6667` if you are *nix, or `telnet localhost
// 6667` on Windows.

// Documentation: http://devdocs.io/node/net
var net = require('net');

var port = 6667;
var server = net.createServer();

// Create a socket when a connection is made
server.on('connection', function(socket) {
  // Log everything
  console.log('new socket', socket.address());

  // Necessary to treat all data as utf8-encoded strings
  socket.setEncoding('utf8');
  socket.write('Welcome to echo server\n');

  // When data comes, send it back
  socket.on('data', function(data) {
    console.log('data', data);
    socket.write(data);
  });

  // When something goes wrong
  socket.on('error', function(error) {
    console.log('error', error);
  });

  // When then the client leaves
  socket.on('close', function(error) {
    console.log('Client left', error);
  });
});

// When the server is ready
server.on('listening', function() {
  console.log('server started on port', port);
});

// Start the server
server.listen(port);

// ## A chat server
//
// **Write** a chat server that keeps track of user names.  A sample
// session would be (^J indicates a line sent by the user, others line
// are received by the server, ^D is EOF):
//
// ```
// $ nc localhost 6667^J
// Enter your name
// Batman^J
// Welcome, Batman
// *** Batman joined
// hello^J
// Batman> hello
// Robin> hey
// Joker> look who's here
// ^D
// $
// ```
