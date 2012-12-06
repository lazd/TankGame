tg.OtherTank = new Class({
	toString: 'OtherTank',
	extend: tg.GameObject,
	
	construct: function(options) {
		// handle parameters
		this.options = jQuery.extend({
			position: [0, 0],
			rotation: 0,
			turretRotation: 0,
			name: 'Enemy',
			type: 'enemy'
		}, options);

		this.lastPosition = [this.options.position[0], this.options.position[1]];

		this.tank = new THREE.Tank(this.options);
		
		this.root = this.getRoot();
		
		this.tracks = [];
	},

	update: function(delta) {
		var time = new Date().getTime();

		// Erase old tracks
		for (var i = 0; i < this.tracks.length; i++) {
			var trackEntry = this.tracks[i];
			var age = time-trackEntry.time;

			// Remove stale tracks
			if (age > tg.config.tracks.fadeTime) {
				trackEntry.model.destruct();
				this.tracks.splice(i, 1);
				i--;
			}
			else {
				// Fade old tracks
				var opacity = 1-age/tg.config.tracks.fadeTime;
				trackEntry.model.setOpacity(opacity);
			}
		}
	},

	applyOpacity: function(opacity, obj, time) {
		setTimeout(function() {
			obj.opacity = opacity;
		}, time);
	},

	takeHit: function() {
		var scope = this;
		
		var steps = 20;
		for (var i = 0; i <= steps; i++) {
			this.applyOpacity(i/steps, scope.tank.tankGeometry.materials[0], i*5);
			this.applyOpacity(i/steps, scope.tank.turretGeometry.materials[0], i*5);
		}
	},
	
	destruct: function() {
		// Remove tracks
		for (var i = 0; i < this.tracks.length; i++) {
			this.world.remove(this.tracks[i].model.getModel());
		}
	},

	setPosition: function(pos, rot, tRot) {
		var time = new Date().getTime();
		
		// Update the position of the otherTank based data received
		this.tank.setPosition(pos, rot, rot+tRot);

		// Get current position and rotation vectors
		var otherTankPosition = this.getRoot().position;
		var otherTankRotation = this.getRoot().rotation;

		// Draw tracks if the otherTank has moved
		if ((Math.abs(pos[0]-this.lastPosition[0]) + Math.abs(pos[1]-this.lastPosition[1])) > tg.config.tracks.distance) {
			var trackModel = new tg.Track({
				game: this.game,
				position: otherTankPosition.clone(),
				rotation: otherTankRotation.clone()
			});

			// Store tracks
			this.tracks.push({
				model: trackModel,
				time: new Date().getTime()
			});

			this.lastPosition = pos;
		}
	},
	
	getName: function() {
		return this.options.name;
	},

	getType: function() {
		return this.options.type;
	},
	getRoot: function() {
		return this.tank.getRoot();
	},
	
	getBody: function() {
		return this.tank.getBody();
	},
	
	getTurret: function() {
		return this.tank.getTurret();
	},
	
	getHitBox: function() {
		return this.tank.getHitBox();
	}
});

