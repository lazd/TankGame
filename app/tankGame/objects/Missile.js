THREE.Missile = function(options) {
	var scope = this;

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
		scope.missileGeometry = geometry;
		
		var faceMaterial = new THREE.MeshFaceMaterial({
			vetexColor: THREE.FaceColors
		});
		
		// geometry.materials[0] = new THREE.MeshLambertMaterial({ color: missileColor, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
		geometry.materials[0] = new THREE.MeshPhongMaterial({ color: missileColor, ambient: 0x050505, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
		
		// Body
		scope.bodyMesh = new THREE.Mesh(geometry, faceMaterial);
		scope.bodyMesh.scale.set(tg.config.size.missile, tg.config.size.missile, tg.config.size.missile);
		scope.bodyMesh.rotation.y = scope.MODEL_ROTATION;
		scope.bodyMesh.castShadow = true;
		scope.bodyMesh.receiveShadow = true;
		scope.root.add(scope.bodyMesh);
	});
	
	// API
	this.setVisible = function(enable) {
		this.root.visible = enable;
	};
	
	this.setPosition = function(position, rotation) {
		// position
		this.root.position.x = position[0];
		this.root.position.z = position[1];

		// rotation
		this.root.rotation.y = rotation;
	};
	
	this.updateModel = function(delta) {
		this.speed = THREE.Math.clamp(this.speed + delta * this.ACCELERATION, 0, this.MAX_SPEED);
		
		// bullet update
		var forwardDelta = this.speed * delta;

		// displacement
		this.root.position.x += Math.sin(this.root.rotation.y) * forwardDelta;
		this.root.position.z += Math.cos(this.root.rotation.y) * forwardDelta;
		
		// Spin missile according to speed
		this.root.rotation.z += this.speed/Math.PI/512;
	};

	this.getRoot = function() {
		return this.root;
	}
};