(function() {
	var faceMaterial = new THREE.MeshFaceMaterial({
		vetexColor: THREE.FaceColors
	});

	tg.Missile = new Class({
		extend: tg.GameObject,
	
		construct: function(options){
			// handle parameters
			options = jQuery.extend({
				position: new THREE.Vector3(0, 0, 0),
				rotation: 0
			}, options);
	

			// missile "feel" parameters
			this.MAX_SPEED		= 350;
			this.ACCELERATION	= 450;
			this.MODEL_ROTATION = Math.PI;
	
			// internal control variables
			this.speed = 0;

			// internal helper variables
			this.Y_POSITION = 8.1;
	
			// root object
			this.root = new THREE.Object3D();
	
			// Set initial position
			this.root.position.copy(options.position);
			this.root.rotation.y = options.rotation;

			// Set y position, fixed
			this.root.position.y = this.Y_POSITION;
	
			var missileColor = options.type == 'friend' ? tg.config.colors.friend : tg.config.colors.enemy;
	
			// Load model
			var loader = new THREE.JSONLoader();
			loader.load("tankGame/models/missilePhoenix.js", function(geometry) {
				this.missileGeometry = geometry;
		
				// geometry.materials[0] = new THREE.MeshLambertMaterial({ color: missileColor, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
				geometry.materials[0] = new THREE.MeshPhongMaterial({ color: missileColor, ambient: 0x050505, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
		
				// Body
				this.bodyMesh = new THREE.Mesh(geometry, faceMaterial);
				this.bodyMesh.scale.set(tg.config.size.missile, tg.config.size.missile, tg.config.size.missile);
				this.bodyMesh.rotation.y = this.MODEL_ROTATION;
				this.bodyMesh.castShadow = true;
				this.bodyMesh.receiveShadow = true;
				this.root.add(this.bodyMesh);
			}.bind(this));
		
			// Store start time
			this.time = new Date().getTime();
		},
	
		setPosition: function(position, rotation) {
			// position
			this.root.position.x = position[0];
			this.root.position.z = position[1];

			// rotation
			this.root.rotation.y = rotation;
		},
	
		update: function(delta) {
			this.speed = THREE.Math.clamp(this.speed + delta * this.ACCELERATION, 0, this.MAX_SPEED);
		
			// bullet update
			var forwardDelta = this.speed * delta;

			// displacement
			this.root.position.x += Math.sin(this.root.rotation.y) * forwardDelta;
			this.root.position.z += Math.cos(this.root.rotation.y) * forwardDelta;
		
			// Spin missile according to speed
			this.root.rotation.z += this.speed/Math.PI/512;
		}
	});

}());
