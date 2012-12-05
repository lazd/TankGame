/*
TankGame - A multiplayer tank battle game for the web 
Copyright (C) 2012 Lawrence Davis

TankGame is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

TankGame is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);

io.set('log level', 1);

// Listen on port 1935
app.listen(1935);

function handler(req, res) {
	// Dump out a basic server status page
	var data = '<!doctype html><head><title>TankGame Server</title></head><body>';
	
	data += '<h1>TankGame Server</h1>';
	
	data += '<table><thead><th>Name</th><th>Position</th></thead><tbody>'
	for (var player in players) {
		var playerInfo = players[player];
		data += '<tr><td>'+playerInfo.name+'</td><td>'+playerInfo.pos+'</td></tr>';
	}
	
	data += '</tbody></table>';
	
	data += '</body></html>';
	
	res.writeHead(200);
	res.end(data);
}

// Holds players
var players = {};

io.sockets.on('connection', function (socket) {
	console.log('Client connected...');
	
	// Send welcome message
	socket.emit('welcome', {
		message: 'Welcome to tankGame'
	});
	
	// Setup message handlers
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
