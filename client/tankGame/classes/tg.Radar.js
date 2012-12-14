tg.Radar = new Class({
	toString: 'Radar',
	
	defaultOptions: {
		zoom: 0.1,
		game: null
	},
	
	construct: function(options) {
		// Combine instance options with defaults
		this.options = jQuery.extend({}, this.defaultOptions, options, true);

		// Store a refernece to the game
		this.game = options.game;
		
		// Always execute update in the context of this instance
		this.bind(this.update);
		
		// Call update when the rendered renders a new frame
		this.game.hook(this.update);
	},
	
	destruct: function() {
		// Stop calling update
		this.game.unhook(this.update);
		
		// Remove the canvas from the DOM
		document.body.removeChild(this.canvas);
	},
	
	init: function() {
		// Create a canvas and add it to the DOM
		this.canvas = document.createElement('canvas');
		this.canvas.className = 'radar';
		document.body.appendChild(this.canvas);
		
		// Store the size of the canvas
		this.size = this.canvas.offsetWidth;
		
		// Set the size of the canvas
		this.canvas.width = this.size;
		this.canvas.height = this.size;
		
		// Store a reference to the drawing context
		this.ctx = this.canvas.getContext('2d');
		
		// Draw around the center
		this.ctx.translate(this.size/2, this.size/2);
	},
	
	drawCircle: function(x, y, color) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		
		this.ctx.arc(x, y, 2.5, 0, Math.PI * 2, true);
		
		this.ctx.closePath();
		this.ctx.fill();
	},
	
	getPos: function(position, offset, zoom) {
		var newPos = {
			x: (offset.x-position.x)*zoom,
			z: (offset.z-position.z)*zoom
		};
		
		return newPos;
	},
	
	update: function() {
		// Clear previous positions
		this.ctx.clearRect(-this.size/2, -this.size/2, this.size, this.size);

		// Rotate so we match the turret rotation
		var rotation = this.game.tank.getRoot().rotation.y + this.game.tank.getTurret().rotation.y;
		this.ctx.rotate(rotation);
		
		// Fetch positions from the game
		var objects = this.game.getPositions();
		
		// Remove self from radar
		var self = objects.shift();
		
		// Store position of self to offset other blips
		var offset = self.pos;
		
		// Draw self in the center
		this.drawCircle(0, 0, '#'+tg.config.colors.friend.toString(16));
		
		var scope = this;
		objects.filter(function (object) {
			// Only draw tanks
			return object.type === 'Tank';
		})
		.map(function (object) {
			// Offset the position of the blip based on my location
			var pos = scope.getPos(object.pos, offset, scope.options.zoom);
			
			// Set color according to alliance
			pos.color = '#' + (object.alliance === 'enemy' ? tg.config.colors.enemy : tg.config.colors.friend).toString(16);
			
			return pos;
		})
		.forEach(function (pos) {
			var maxPos = scope.size/2-2;
			
			// Draw the blip
			if (Math.pow(-pos.x, 2) + Math.pow(-pos.z, 2) > Math.pow(maxPos, 2)) {
				var theta = Math.atan(pos.z / pos.x);
				if (pos.x < 0) theta += Math.PI;
				pos.x = Math.cos(theta) * maxPos;
				pos.z = Math.sin(theta) * maxPos;
			}
			scope.drawCircle(pos.x, pos.z, pos.color);
		});
		
		// Rotate back so we don't rotate in circles (rotate operations compound)
		this.ctx.rotate(-rotation);
	}
});