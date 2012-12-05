/**
 * Adapted from alteredq's THREE.Car http://alteredqualia.com/
 */

THREE.Tank = function(options) {
	var scope = this;
	
	this.options = options;

	// tank "feel" parameters
	this.MAX_SPEED		= 75;
	this.MAX_REVERSE_SPEED	= -this.MAX_SPEED;

	this.FRONT_ACCELERATION	= 1500;
	this.BACK_ACCELERATION	= 1200;
	this.FRONT_DECCELERATION	= 750;
	
	this.MAX_WHEEL_ROTATION	= 1;
	this.WHEEL_ANGULAR_ACCELERATION	= 3.0;
	this.WHEEL_ANGULAR_DECCELERATION = 3.5;
	this.STEERING_RADIUS_RATIO	= 0.040;

	this.MAX_TURRET_WHEEL_ROTATION = this.MAX_WHEEL_ROTATION;
	this.TURRET_WHEEL_ANGULAR_ACCELERATION	= 2.5;
	this.TURRET_WHEEL_ANGULAR_DECCELERATION	= 2.75;
	this.TURRET_STEERING_RADIUS_RATIO = this.STEERING_RADIUS_RATIO;

	this.INITIAL_ROTATION = 0;
	this.INITIAL_TURRET_ROTATION = Math.PI/2;
	
	this.MODEL_ROTATION = Math.PI/2;
	
	// internal control variables
	this.loaded = false;
	
	this.speed = 0;
	this.velocity = new THREE.Vector3(0, 0, 0);
		
	this.wheelOrientation = 0;
	this.turretWheelOrientation	= 0;
	
	this.turretOrientation	= this.INITIAL_TURRET_ROTATION;
	this.tankOrientation = this.INITIAL_ROTATION;

	// internal helper variables
	this.Y_POSITION = 6;
	
	// root object
	this.root = new THREE.Object3D();
	this.root.position.y = this.Y_POSITION;
	this.root.rotation.y = this.INITIAL_ROTATION;
	
	var tankColor = options.type == 'friend' ? tg.config.colors.friend : tg.config.colors.enemy;
	
	var hitBoxMaterial = new THREE.MeshBasicMaterial({
		color: 0xFF0000,
		doubleSided: true
	});
	
	var hitBoxGeometry = new THREE.CubeGeometry(13.5, 9, 26.2);
	this.hitBox = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);
	this.hitBox.visible = false;
	// this.hitBox.position.z = -0.5;
	this.root.add(this.hitBox);
	
	this.body = new THREE.Object3D();
	this.body.position.z = 4;
	this.root.add(this.body);
	
	this.turret = new THREE.Object3D();
	this.turret.position.y = 0.5;
	this.root.add(this.turret);
	
	this.loadPartsJSON = function (bodyURL, turretURL) {
		var loader = new THREE.JSONLoader();

		//console.log('Loading %s and %s', bodyURL, turretURL);

		loader.load(bodyURL, function(geometry) { scope.tankGeometry = geometry; createTank(options); } );
		loader.load(turretURL, function(geometry) { scope.turretGeometry = geometry; createTank(options); } );
	};
	
	this.loadPartsJSON("tankGame/models/tankBody.js", "tankGame/models/tankTurret.js");
	
	function createTank(options) {
		if (!scope.tankGeometry || !scope.turretGeometry)
			return false;
		
		var faceMaterial = new THREE.MeshFaceMaterial({
			vetexColor: THREE.FaceColors
		});
		
		var tankMaterial = new THREE.MeshLambertMaterial({
			color: tankColor,
			ambient: 0x222222,
			shading: THREE.SmoothShading,
			vertexColors: THREE.VertexColors
		});

		scope.tankGeometry.materials[0] = tankMaterial;
		scope.turretGeometry.materials[0] = tankMaterial;

		// Body
		scope.bodyMesh = new THREE.Mesh(scope.tankGeometry, faceMaterial);
		scope.bodyMesh.scale.set(tg.config.size.tank, tg.config.size.tank, tg.config.size.tank);
		scope.bodyMesh.rotation.y = scope.MODEL_ROTATION;
		scope.bodyMesh.castShadow = true;
		scope.bodyMesh.receiveShadow = true;
		scope.body.add(scope.bodyMesh);
		
		// Turret
		scope.turretMesh = new THREE.Mesh(scope.turretGeometry, faceMaterial);
		scope.turretMesh.scale.set(tg.config.size.tank, tg.config.size.tank, tg.config.size.tank);
		scope.turretMesh.rotation.y = scope.MODEL_ROTATION;
		scope.turretMesh.position.z = 4;
		scope.turretMesh.castShadow = true;
		scope.turretMesh.receiveShadow = true;
		scope.turret.add(scope.turretMesh);
		
		scope.loaded = true;
		
		// Set initial position
		
		if (options.position)
			scope.setPosition(options.position, options.rotation, options.turretRotation);
		else
			scope.reset();
	}
	
	// API
	this.setVisible = function (enable) {
		this.root.visible = enable;
	};
	
	this.getPosition = function() {
		return this.root.position.clone();
	},
	
	this.setPosition = function (position, rotation, tRot) {
		// position
		this.root.position.x = position[0];
		this.root.position.z = position[1];

		// rotation
		this.root.rotation.y = rotation !== undefined ? rotation : this.root.rotation.y;
		
		this.turret.rotation.y = tRot !== undefined ? tRot : this.turret.rotation.y;
	};
	
	this.evaluateControls = function(delta, controls, store) {
		var speed = this.speed;
		var turretWheelOrientation = this.turretWheelOrientation;
		var wheelOrientation = this.wheelOrientation;
		
		var tankOrientation = this.tankOrientation;
		var turretOrientation = this.turretOrientation;
		
		if (controls.moveForward) {
			speed = this.MAX_SPEED;
		}

		if (controls.moveBackward) {
			speed = this.MAX_REVERSE_SPEED;
		}

		if (controls.moveTurretCounterClockwise) {
			turretWheelOrientation = THREE.Math.clamp(turretWheelOrientation + delta * this.TURRET_WHEEL_ANGULAR_ACCELERATION, - this.MAX_TURRET_WHEEL_ROTATION, this.MAX_TURRET_WHEEL_ROTATION);
		}

		if (controls.moveTurretClockwise) {
			turretWheelOrientation = THREE.Math.clamp(turretWheelOrientation - delta * this.TURRET_WHEEL_ANGULAR_ACCELERATION, - this.MAX_TURRET_WHEEL_ROTATION, this.MAX_TURRET_WHEEL_ROTATION);
		}

		if (controls.moveLeft) {
			wheelOrientation = this.MAX_WHEEL_ROTATION;
		}

		if (controls.moveRight) {
			wheelOrientation = -this.MAX_WHEEL_ROTATION;
		}

		// speed decay
		if (!(controls.moveForward || controls.moveBackward)) {
			if (speed > 0) {
				var k = exponentialEaseOut(speed / this.MAX_SPEED);

				speed = THREE.Math.clamp(speed - k * delta * this.FRONT_DECCELERATION, 0, this.MAX_SPEED);

			} else {
				var k = exponentialEaseOut(speed / this.MAX_REVERSE_SPEED);

				speed = THREE.Math.clamp(speed + k * delta * this.BACK_ACCELERATION, this.MAX_REVERSE_SPEED, 0);
			}
		}

		// steering decay
		if (!(controls.moveLeft || controls.moveRight)) {
			wheelOrientation = 0;
		}

		if (!(controls.moveTurretCounterClockwise || controls.moveTurretClockwise)) {
			if (turretWheelOrientation > 0) {
				turretWheelOrientation = THREE.Math.clamp(turretWheelOrientation - delta * this.TURRET_WHEEL_ANGULAR_DECCELERATION, 0, this.MAX_TURRET_WHEEL_ROTATION);
			} else {
				turretWheelOrientation = THREE.Math.clamp(turretWheelOrientation + delta * this.TURRET_WHEEL_ANGULAR_DECCELERATION, - this.MAX_TURRET_WHEEL_ROTATION, 0);
			}
		}
		
		
		// Calculate
		var forwardDelta = speed * delta;
		tankOrientation += this.STEERING_RADIUS_RATIO * wheelOrientation;
		turretOrientation += this.TURRET_STEERING_RADIUS_RATIO * turretWheelOrientation;
		
		var vX = Math.sin(this.tankOrientation) * speed;
		var vZ = Math.cos(this.tankOrientation) * speed;
		var newX = this.root.position.x + vX * delta;
		var nexZ = this.root.position.z + vZ * delta;
		
		if (store) {
			this.velocity.x = vX;
			this.velocity.z = vZ;
			
			this.speed = speed;
			this.turretWheelOrientation = turretWheelOrientation;
			this.wheelOrientation = wheelOrientation;
            
			this.tankOrientation = tankOrientation;
			this.turretOrientation = turretOrientation;
		}
		
		return {
			forwardDelta: forwardDelta,
			position: {
				x: newX,
				z: nexZ
			},
			velocity: {
				x: vX,
				z: vZ
			},
			tankOrientation: tankOrientation,
			turretOrientation: turretOrientation
		}
	};
	

	this.updateModel = function(delta, controls) {
		var newPos = this.evaluateControls(delta, controls, true);
		
		// Set position
		// this.root.position.x = newPos.position.x;
		// this.root.position.z = newPos.position.z;

		// Set rotation
		this.root.rotation.y = newPos.tankOrientation;
		this.turret.rotation.y = newPos.turretOrientation;
	};

	this.reset = function(pos, rotation, tRot) {
		this.wheelOrientation = this.turretWheelOrientation = 0;
		this.tankOrientation = 0;
		this.speed = 0;
		this.root.position.x = pos ? pos[0] : 0;
		this.root.position.z = pos ? pos[1] : 0;
		this.turretOrientation = tRot || this.INITIAL_TURRET_ROTATION;
		this.tankOrientation = rotation || this.INITIAL_ROTATION;
	}

	this.getRoot = function() {
		return this.root;
	}
	
	this.getBody = function() {
		return this.body;
	}
	
	this.getTurret = function() {
		return this.turret;
	}
	
	this.getHitBox = function() {
		return this.hitBox;
	}

	// internal helper methods
	function exponentialEaseOut(k) { return k === 1 ? 1 : - Math.pow(2, - 10 * k) + 1; }
};