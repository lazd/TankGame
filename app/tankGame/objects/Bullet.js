(function() {
	// internal helper variables
	var bulletTexture = {
		width		: 4/5,
		height		: 4/5,
		depth		: 8/5,
		textureUrl	: 'assets/bullet.png'
	};

	// var texture = THREE.ImageUtils.loadTexture(bulletTexture.textureUrl);

	var friendMaterial = new THREE.MeshBasicMaterial({
		color: tg.config.colors.friend,
		transparent: true
	});
	
	var enemyMaterial = new THREE.MeshBasicMaterial({
		color: tg.config.colors.enemy,
		transparent: true
	});

	// create the geometry	
	var geometry = new THREE.CubeGeometry(bulletTexture.width, bulletTexture.height, bulletTexture.depth);

	THREE.Bullet = function(opts) {
		var scope = this;

		// bullet parameters
		this.Y_POSITION = 8.1;
		
		var material = opts.type == 'friend' ? friendMaterial : enemyMaterial;
		
		// create the mesh
		this.root = new THREE.Mesh(geometry, material);
		
		// Set initial position
		this.root.position.copy(opts.position);
		this.root.rotation.y = opts.rotation;

		// Set y position, fixed
		this.root.position.y = this.Y_POSITION;
		
		// API
		this.setVisible = function (enable) {
			this.root.visible = enable;
		};

		this.updateModel = function (delta, controls) {
			// Get the change in distance based on the time the position was last evaluated
			var forwardDelta = tg.config.weapons.bullet.speed * delta;
			
			/*
			// Debug stuff
			var bulletDistance = (Math.sin(this.root.rotation.y) * forwardDelta + Math.cos(this.root.rotation.y) * forwardDelta)/2;
			if (!window.bulletMoved)
				window.bulletMoved = 0;
			if (bulletDistance < 50)
				window.bulletMoved = Math.max(window.bulletMoved, (Math.abs(Math.sin(this.root.rotation.y) * forwardDelta) + Math.abs(Math.cos(this.root.rotation.y)) * forwardDelta)/2);
			else
				console.log('Bullet outlier: ', bulletDistance);
			*/
			
			// Apply displacement
			this.root.position.x += Math.sin(this.root.rotation.y) * forwardDelta;
			this.root.position.z += Math.cos(this.root.rotation.y) * forwardDelta;
		};
	};
}());
