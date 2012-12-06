tg.Tank = new Class({
	toString: 'Tank',
	extend: tg.GameObject,
	
	construct: function(options) {
		// handle parameters
		this.options = jQuery.extend({
			type: 'friend'
		}, options);

		var tank = new THREE.Tank(this.options);
		this.tank = tank;
		this.root = tank.getRoot();
		
		this.bind(this.update);

		// Store last position and tracks
		this.tracks = [];
		this.lastPosition = this.getRoot().position.clone();

		// Store bullets and last fire time
		this.bullets = [];
		this.lastFireTime = {};
		
		// the controls of the tank
		this._controlsTank = {
			moveForward: false,
			moveBackward: false,
			moveLeft: false,
			moveRight: false,
			fire: false
		};
		
		this.controlsLoopCb = this.controlsLoopCb.bind(this);
	},
	
	update: function(delta) {
		var time = new Date().getTime();

		// Get the tanks current position
		var tankPosition = this.getRoot().position;
		var tankRotation = this.getRoot().rotation.y;
		var turretRotation = this.getTurret().rotation.y+tankRotation;

		// Update the position of the tank based on controls
		this.tank.updateModel(delta, this._controlsTank);

		if (this._controlsTank.fire && (!this.lastFireTime[this.game.currentWeapon] || time-this.lastFireTime[this.game.currentWeapon] >= tg.config.weapons[this.game.currentWeapon].interval)) {
			var type = this.game.currentWeapon;
			var bulletPosition = tankPosition.clone();

			// Position bullet at muzzle, not center of tank
			var deltaX = Math.sin(turretRotation) * 25;
			var deltaZ = Math.cos(turretRotation) * 25;
			bulletPosition.x += deltaX;
			bulletPosition.z += deltaZ;

			// Create ordinance
			var bulletModel;
			if (type == 'missile') {
				bulletModel = new tg.Missile({
					game: this.game,
					position: bulletPosition,
					rotation: turretRotation,
					type: 'friend'
				});
			}
			else {
				bulletModel = new tg.Bullet({
					game: this.game,
					position: bulletPosition,
					rotation: turretRotation,
					type: 'friend'
				});
			}

			// Store bullet
			this.bullets.push({
				instance: bulletModel,
				type: type,
				time: time
			});

			// Emit event
			this.trigger('fire', {
				pos: [bulletPosition.x, bulletPosition.z],
				rot: turretRotation,
				type: type
			});

			var soundInfo = tg.config.weapons[this.game.currentWeapon].sound;
			this.game.sound.play(soundInfo.file, soundInfo.volume);

			// Store last fire time
			this.lastFireTime[this.game.currentWeapon] = time;
		}

		// Draw tracks if the tank has moved
		if ((Math.abs(tankPosition.x-this.lastPosition.x) + Math.abs(tankPosition.z-this.lastPosition.z)) > tg.config.tracks.distance) {
			var trackModel = new tg.Track({
				game: this.game,
				position: tankPosition.clone(),
				rotation: new THREE.Vector3(0, tankRotation, 0)
			});

			// Store tracks
			this.tracks.push({
				instance: trackModel,
				time: time
			});

			this.lastPosition = tankPosition.clone();
		}

		// Erase old tracks
		for (var i = 0; i < this.tracks.length; i++) {
			var trackEntry = this.tracks[i];
			var age = time-trackEntry.time;

			// Remove stale tracks
			if (age > tg.config.tracks.fadeTime) {
				trackEntry.instance.destruct();
				this.tracks.splice(i, 1);
				i--;
			}
			else {
				// Fade old tracks
				var opacity = 1-age/tg.config.tracks.fadeTime;
				trackEntry.instance.setOpacity(opacity);
			}
		}
	},

	destroy: function() {
		this.game.unhook(this._loopCb);
	},

	getHeading: function() {
		var tankRotation = this.getRoot().rotation.y % (Math.PI*2);
		
		if (tankRotation < 0)
		 	tankRotation = Math.PI*2 + tankRotation;
		
		return tankRotation;
	},
	
	getDirection: function() {
		var tankRotation = this.getHeading();
		
		var directionNS = '';
		var directionEW = '';
		
		var Pi2 = Math.PI/2;
		var TwoPi = Math.PI*2;
		
		var north = Math.PI+Pi2;
		var south = Math.PI-Pi2;
		
		if ((tankRotation >= 0 && tankRotation <= Pi2) || (tankRotation >= TwoPi-Pi2 && tankRotation <= TwoPi)) {
			directionEW = 'west';
		}
		else if (tankRotation >= Math.PI-Pi2 && tankRotation <= Math.PI+Pi2) {
			directionEW = 'east';
		}
		
		if (tankRotation >= north-Pi2 && tankRotation <= north+Pi2) {
			directionNS = 'north';
		}
		else if (tankRotation >= south-Pi2 && tankRotation <= south+Pi2) {
			directionNS = 'south';
		}
		
		return [directionNS, directionEW];
	},
	
	getPosition: function() {
		var tankPosition = this.getRoot().position;
		var tankRotation = this.getRoot().rotation;
		var turretRotation = this.getTurret().rotation;

		return {
			pos: [tankPosition.x, tankPosition.z],
			rot: tankRotation.y,
			tRot: turretRotation.y
		};
	},

	reset: function(pos, rotation) {
		this.tank.reset(pos, rotation);
	},

	setPosition: function(pos, rot, tRot) {
		this.getRoot().position.x = pos[0];
		this.getRoot().position.z = pos[1];
		this.getRoot().rotation.y = rot;
		this.getTurret().rotation.y = tRot - rot;
	},
	
	translateZ: function(by) {
		this.getRoot().position.z += by;
	},
	
	translateX: function(by) {
		this.getRoot().position.x += by;
	},
	
	rotate: function(by) {
		this.tankOrientation += by;
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
	},
	
	controls: function() {
		return this._controlsTank;
	}
});
