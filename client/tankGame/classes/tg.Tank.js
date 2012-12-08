(function() {
	var faceMaterial = new THREE.MeshFaceMaterial({
		vetexColor: THREE.FaceColors
	});

	var hitBoxMaterial = new THREE.MeshBasicMaterial({
		color: 0xFF0000,
		doubleSided: true
	});

	var hitBoxGeometry = new THREE.CubeGeometry(13.5, 9, 26.2);

	tg.Tank = new Class({
		extend: tg.GameObject,
		
		construct: function(options) {
			// handle parameters
			this.options = jQuery.extend({
				name: 'Unknown',
				type: 'friend',
				position: new THREE.Vector3(0, 0, 0),
				rotation: 0,
				turretRotation: 0
			}, options);
			
			// internal control variables
			this.loaded = false;
	
			this.speed = 0;
		
			this.wheelOrientation = 0;
	
			this.turretOrientation = tg.config.tank.initialTurretRotation;
			this.tankOrientation = tg.config.tank.initialRotation;

			// internal helper variables
			this.Y_POSITION = 6;
	
			// root object
			this.root = new THREE.Object3D();
			this.root.position.set(0, this.Y_POSITION, 0);
			this.root.rotation.set(0, tg.config.tank.initialRotation, 0);
	
			this.hitBox = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);
			this.hitBox.visible = false;
			this.root.add(this.hitBox);
	
			this.body = new THREE.Object3D();
			this.body.position.set(0, 0, 4);
			this.root.add(this.body);
	
			this.turret = new THREE.Object3D();
			this.turret.position.set(0, 0.5, 0);
			this.root.add(this.turret);
	
			this.loadPartsJSON("tankGame/models/tankBody.js", "tankGame/models/tankTurret.js");
	
			this.tracks = [];
			this.lastPosition = this.options.position.clone();
		},
		
	
		destruct: function() {
			// Remove tracks
			for (var i = 0; i < this.tracks.length; i++) {
				this.tracks[i].destruct();
			}
		},
		
		createTank: function() {
			if (!this.tankGeometry || !this.turretGeometry)
				return false;
	
			var tankMaterial;
			if (this.options.type == 'friend') {
				tankMaterial = new THREE.MeshLambertMaterial({
					color: tg.config.colors.friend,
					ambient: 0x222222,
					shading: THREE.SmoothShading,
					vertexColors: THREE.VertexColors
				});
			}
			else {
				tankMaterial = new THREE.MeshLambertMaterial({
					color: tg.config.colors.enemy,
					ambient: 0x222222,
					shading: THREE.SmoothShading,
					vertexColors: THREE.VertexColors
				});
			}
			
			this.tankGeometry.materials[0] = tankMaterial;
			this.turretGeometry.materials[0] = tankMaterial;

			// Body
			this.bodyMesh = new THREE.Mesh(this.tankGeometry, faceMaterial);
			this.bodyMesh.scale.set(tg.config.size.tank, tg.config.size.tank, tg.config.size.tank);
			this.bodyMesh.rotation.y = tg.config.tank.modelRotation;
			this.bodyMesh.castShadow = true;
			this.bodyMesh.receiveShadow = true;
			this.body.add(this.bodyMesh);
	
			// Turret
			this.turretMesh = new THREE.Mesh(this.turretGeometry, faceMaterial);
			this.turretMesh.scale.set(tg.config.size.tank, tg.config.size.tank, tg.config.size.tank);
			this.turretMesh.rotation.y = tg.config.tank.modelRotation;
			this.turretMesh.position.z = 4;
			this.turretMesh.castShadow = true;
			this.turretMesh.receiveShadow = true;
			this.turret.add(this.turretMesh);
	
			this.loaded = true;
		},
		
		// Refactor to generic loader, put in gameobject
		loadPartsJSON: function(bodyURL, turretURL) {
			var loader = new THREE.JSONLoader();

			//console.log('Loading %s and %s', bodyURL, turretURL);
			var scope = this;
			loader.load(bodyURL, function(geometry) {
				scope.tankGeometry = geometry;
				scope.createTank();
			});
			
			loader.load(turretURL, function(geometry) {
				scope.turretGeometry = geometry;
				scope.createTank();
			});
		},
		
		update: function(delta) {
			this.updateTracks();
		},
		
		updateTracks: function() {
			var time = new Date().getTime();

			// Get current position and rotation vectors
			var curPosition = this.getRoot().position.clone();
			var curRotation = this.getRoot().rotation.clone();

			// Draw tracks if the otherTank has moved
			if ((Math.abs(curPosition.x-this.lastPosition.x) + Math.abs(curPosition.z-this.lastPosition.z)) > tg.config.tracks.distance) {
				var track = new tg.Track({
					game: this.game,
					position: curPosition,
					rotation: curRotation,
					time: time
				});
				
				// Store tracks
				this.tracks.push(track);

				this.lastPosition = curPosition;
			}
		
			// Erase old tracks
			for (var i = this.tracks.length-1; i >= 0; i--) {
				var track = this.tracks[i];
				var age = time-track.time;

				// Remove stale tracks
				if (age > tg.config.tracks.fadeTime) {
					this.tracks.splice(i, 1);
					track.destruct();
				}
				else {
					// Fade old tracks
					var opacity = 1-(age/tg.config.tracks.fadeTime);
					track.setOpacity(opacity);
				}
			}
		},
	
		getPosition: function() {
			return this.root.position.clone();
		},

		setPosition: function (position, rotation, tRot) {
			// position
			this.root.position.x = position[0];
			this.root.position.z = position[1];

			// rotation
			this.root.rotation.y = rotation !== undefined ? rotation : this.root.rotation.y;
	
			this.turret.rotation.y = tRot !== undefined ? tRot : this.turret.rotation.y;
		},

		reset: function(pos, rotation, tRot) {
			this.wheelOrientation = 0;
			this.tankOrientation = 0;
			this.speed = 0;
			this.root.position.x = pos ? pos[0] : 0;
			this.root.position.z = pos ? pos[1] : 0;
			this.turretOrientation = tRot || tg.config.tank.initialTurretRotation;
			this.tankOrientation = rotation || tg.config.tank.initialRotation;
		},
		
		applyOpacity: function(opacity, obj, time) {
			setTimeout(function() {
				obj.opacity = opacity;
			}, time);
		},

		takeHit: function() {
			var steps = 20;
			for (var i = 0; i <= steps; i++) {
				this.applyOpacity(i/steps, this.tankGeometry.materials[0], i*5);
				this.applyOpacity(i/steps, this.turretGeometry.materials[0], i*5);
			}
		},
	
		getBody: function() {
			return this.body;
		},

		getTurret: function() {
			return this.turret;
		},

		getType: function() {
			return this.options.type;
		},
	
		getHitBox: function() {
			return this.hitBox;
		},
		
		getType: function() {
			return this.options.type;
		},
		
		getName: function() {
			return this.options.name;
		}
	});
}());

