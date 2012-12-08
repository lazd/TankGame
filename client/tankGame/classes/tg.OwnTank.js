tg.OwnTank = new Class({
	toString: 'OwnTank',
	extend: tg.Tank,
	
	construct: function(options) {
		this.bind(this.update);
		this.controlsLoopCb = this.controlsLoopCb.bind(this);

		// Store last position and tracks
		this.lastPosition = this.getRoot().position.clone();

		// Store bullets and last fire time
		this.bullets = [];
		this.lastFireTime = {};
		
		this.velocity = new THREE.Vector3(0, 0, 0);
		
		// the controls of the tank
		this.controls = {
			moveForward: false,
			moveBackward: false,
			moveLeft: false,
			moveRight: false,
			fire: false
		};
	},
	
	update: function(delta) {
		this.inherited(arguments);
		
		var time = new Date().getTime();

		// Get the tanks current position
		var tankPosition = this.getRoot().position;
		var tankRotation = this.getRoot().rotation.y;
		var turretRotation = this.getTurret().rotation.y+tankRotation;

		if (this.controls.fire && (!this.lastFireTime[this.game.currentWeapon] || time-this.lastFireTime[this.game.currentWeapon] >= tg.config.weapons[this.game.currentWeapon].interval)) {
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
	},
	
	getPositionPacket: function() {
		var tankPosition = this.getRoot().position;
		var tankRotation = this.getRoot().rotation;
		var turretRotation = this.getTurret().rotation;

		return {
			pos: [tankPosition.x, tankPosition.z],
			rot: tankRotation.y,
			tRot: turretRotation.y
		};
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
	
	evaluateControls: function(delta, controls, store) {
		var speed = this.speed;
		var wheelOrientation = this.wheelOrientation;

		var tankOrientation = this.tankOrientation;
		
		if (controls.moveForward) {
			speed = tg.config.tank.maxSpeed;
		}

		if (controls.moveBackward) {
			speed = tg.config.tank.maxReverseSpeed;
		}
		
		if (controls.moveLeft) {
			wheelOrientation = tg.config.tank.maxWheelRotation;
		}

		if (controls.moveRight) {
			wheelOrientation = -tg.config.tank.maxWheelRotation;
		}

		// speed decay
		if (!(controls.moveForward || controls.moveBackward)) {
			if (speed > 0) {
				var k = tg.util.exponentialEaseOut(speed / tg.config.tank.maxSpeed);

				speed = THREE.Math.clamp(speed - k * delta * tg.config.tank.frontDeceleration, 0, tg.config.tank.maxSpeed);

			} else {
				var k = tg.util.exponentialEaseOut(speed / tg.config.tank.maxReverseSpeed);

				speed = THREE.Math.clamp(speed + k * delta * tg.config.tank.backDeceleration, tg.config.tank.maxReverseSpeed, 0);
			}
		}

		// steering decay
		if (!(controls.moveLeft || controls.moveRight)) {
			wheelOrientation = 0;
		}
		
		// Calculate
		var forwardDelta = speed * delta;
		tankOrientation += tg.config.tank.steeringRadiusRatio * wheelOrientation;

		var vX = Math.sin(this.tankOrientation) * speed;
		var vZ = Math.cos(this.tankOrientation) * speed;

		var newX = this.root.position.x + vX * delta;
		var newZ = this.root.position.z + vZ * delta;

		if (store) {
			this.speed = speed;
			this.wheelOrientation = wheelOrientation;
          
			this.tankOrientation = tankOrientation;
		}

		return {
			forwardDelta: forwardDelta,
			position: {
				x: newX,
				z: newZ
			},
			velocity: {
				x: vX,
				z: vZ
			},
			tankOrientation: tankOrientation
		}
	}
});
