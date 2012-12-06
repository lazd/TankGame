(function() {
	// internal helper variables
	var bulletTexture = {
		width: 4/5,
		height: 4/5,
		depth: 8/5
	};
	
	var friendBulletMaterial = new THREE.MeshBasicMaterial({
		color: tg.config.colors.friend,
		transparent: true
	});
	
	var enemyBulletMaterial = new THREE.MeshBasicMaterial({
		color: tg.config.colors.enemy,
		transparent: true
	});

	// create the geometry	
	var bulletGeometry = new THREE.CubeGeometry(bulletTexture.width, bulletTexture.height, bulletTexture.depth);

	tg.Bullet = new Class({
		extend: tg.GameObject,
	
		construct: function(options){
			// handle parameters
			options = jQuery.extend({
				position: new THREE.Vector3(0, 0, 0),
				rotation: 0
			}, options);
			
			this.bind(this.update);
		
			var Y_POSITION = 8.1;
		
			var material = options.type == 'friend' ? friendBulletMaterial : enemyBulletMaterial;
		
			// create the mesh
			this.root = new THREE.Mesh(bulletGeometry, material);
		
			// Set initial position
			this.root.position.copy(options.position);
			this.root.rotation.y = options.rotation;

			// Set y position, fixed
			this.root.position.y = Y_POSITION;
			
			// Store start time
			this.time = new Date().getTime();
		},

		update: function (delta, controls) {
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
		}
	});
}());

