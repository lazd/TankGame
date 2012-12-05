var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(1935);
io.set('log level', 1);

function handler(req, res) {
	fs.readFile(__dirname + '/index.html',
	function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}

		res.writeHead(200);
		res.end(data);
	});
}

var players = {};

io.sockets.on('connection', function (socket) {
	console.log('Client connected...');
	socket.emit('welcome', {
		message: 'Welcome to tankGame'
	});
	
	socket.on('join', function(message) {
		if (!message.name) {
			console.error('join failed: Player name was null!');
			socket.emit('failed');
			return false;
		}
		
		console.log('Player joined: '+message.name);
		
		// Send list of players
		socket.emit('player list', players);
		
	    socket.set('name', message.name, function() {
			// Store client info
			players[message.name] = {
				name: message.name,
				pos: message.pos,
				rot: message.rot,
				tRot: message.tRot
			};

			// Notify players of new challenger
			socket.broadcast.emit('join', {
				name: message.name,
				pos: message.pos,
				rot: message.rot,
				tRot: message.tRot
			});
		});
	});
	
	socket.on('disconnect', function() {
	    socket.get('name', function (err, name) {
			console.log(name+' dropped');
			
			// Remove from client list
			delete players[name];
			
			// Notify players
			socket.broadcast.emit('leave', {
				name: name
			});
	    });
	});
	
	socket.on('hit', function(message) {
	    socket.get('name', function (err, name) {
			socket.broadcast.emit('hit', {
				name: name,
				type: message.type
			});
		});
	});
	
	socket.on('killed', function(message) {
	    socket.get('name', function (err, name) {
			if (name === null) {
				console.error('killed failed: Player name was null!');
				console.log(err, name, message);
				throw new Error('Player name was null!');
			}

			socket.broadcast.emit('killed', {
				name: name,
				killer: message.killer
			});
			
			var newPosition = {
				name: name,
				pos: [0, 0],
				rot: 0,
				tRot: 0
			};
			
			// Notify self
			socket.emit('move', newPosition);
			
			// Notify players
			socket.broadcast.emit('move', newPosition);
		});
	});
	
	socket.on('fire', function(message) {
	    socket.get('name', function (err, name) {
			socket.broadcast.emit('fire', {
				name: name,
				pos: message.pos,
				rot: message.rot,
				type: message.type
			});
		});
	});
	
	socket.on('move', function(message) {
		socket.get('name', function (err, name) {
			if (players[name]) {
				// Update position
				players[name].pos = message.pos;
				players[name].rot = message.rot;
				players[name].tRot = message.tRot;
			
				// Notify players
				socket.broadcast.emit('move', {
					name: name,
					pos: message.pos,
					rot: message.rot,
					tRot: message.tRot
				});
			}
			else {
				socket.emit('failed');
			}
		});
	});
});
