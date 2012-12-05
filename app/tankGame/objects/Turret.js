THREE.Turret = function(opts) {
	var scope = this;

	// turret "feel" parameters
	this.FIRE_RATE = 350;
	this.MODEL_ROTATION = 0;
	
	// internal helper variables
	this.Y_POSITION = 1;
	
	// root object
	this.root = new THREE.Object3D();
	
	// Set position
	this.root.position.copy(opts.position);
	this.root.rotation.y = opts.rotation;

	// Set y position, fixed
	this.root.position.y = this.Y_POSITION;
	
	var turretColor = opts.type == 'friendly' ? 0x004400 : 0x440000;
	
	// Load model
	var loader = new THREE.JSONLoader();
	loader.load("tankGame/models/turret.js", function(geometry) {
		scope.turretGeometry = geometry;
		
		var faceMaterial = new THREE.MeshFaceMaterial({
			vetexColor: THREE.FaceColors
		});
		
		// TBD: change turret color based on friendly/not
		
		// Body
		scope.bodyMesh = new THREE.Mesh(geometry, faceMaterial);
		scope.bodyMesh.scale.set(tg.config.size.turret, tg.config.size.turret, tg.config.size.turret);
		scope.bodyMesh.rotation.y = scope.MODEL_ROTATION;
		scope.bodyMesh.castShadow = true;
		scope.bodyMesh.receiveShadow = true;
		scope.root.add(scope.bodyMesh);
	});
	
	// API
	this.setVisible = function (enable) {
		this.root.visible = enable;
	};
	
	this.setPosition = function (position, rotation) {
		// position
		this.root.position.x = position[0];
		this.root.position.z = position[1];

		// rotation
		this.root.rotation.y = rotation;
	};
	
	this.getRoot = function() {
		return this.root;
	}
};