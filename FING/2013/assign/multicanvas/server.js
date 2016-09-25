var app = require('express').createServer();
var io = require('socket.io').listen(app);

app.listen(8080);

serve('/', '/index.html');
serve('/client.js');
serve('/jquery.js');

// Réduction du niveau de log pour ne pas polluer la console.
io.set('log level', 1);

/**
 * Connexion d'un nouveau client.
 *
 * - On transmet l'événement 'user draws' aux autres clients
 */
io.sockets.on('connection', function(socket) {

	socket.on('user draws', function(data) {
		socket.broadcast.emit('user draws', data);
	});
});

function serve(path, file) {
	app.get(path, function(req, res) {
		res.sendfile(__dirname + (file || path));
	});
}
