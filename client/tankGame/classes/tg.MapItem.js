tg.MapItem = new Class({
	toString: 'MapItem',
	extend: tg.GameObject,
	
	defaults: {
		position: new THREE.Vector3(0, 0, 0),
		rotation: 0,
		hp: 100,
		model: {
			url: "",
			rotation: 0,
			yPosition: 0,
			wrapTextures: true,
			size: 1
		},
		faceMaterial: new THREE.MeshFaceMaterial({
			vetexColor: THREE.FaceColors
		})
	},

	construct: function(options) {
		// Combine default parameters with class parameters and instance parameters 
		var options = this.options = jQuery.extend(true, {}, this.defaults, this.options, options);

		this.destroyed = false;

		// Root object
		this.root = new THREE.Object3D();
		
		// Set position/rotation
		this.root.position.copy(options.position);
		this.root.rotation.y = options.rotation;

		// Set y position, fixed
		this.root.position.y = options.model.yPosition;
		
		// Load model
		var loader = new THREE.JSONLoader();
		loader.load(options.model.url, function(geometry) {

			if (options.model.textures) {
				options.model.textures.forEach(function(texture, index) {
					geometry.materials[index].map = THREE.ImageUtils.loadTexture(texture);
				});
			}

			geometry.materials.forEach(function(material, index) {
				// Apply ambient light to all materials
		        material.ambient = new THREE.Color(0xffffff);
		        
		        // Apply color
				if (options.model.color !== undefined) {
					material.color = options.model.color;
				}

		        // Wrap textures
				if (options.model.wrapTextures && material.map) {
					material.map.wrapS = THREE.RepeatWrapping;
					material.map.wrapT = THREE.RepeatWrapping;
				}
			});
			
			// Body
			this.bodyMesh = new THREE.Mesh(geometry, this.options.faceMaterial);
			this.bodyMesh.scale.set(options.model.size, options.model.size, options.model.size);
			
			this.bodyMesh.flipSided = true;
			this.bodyMesh.doubleSided = true;

			// Hitbox
			if (options.hitBox) {
				this.hitBox = new THREE.Mesh(options.hitBox);
				this.hitBox.visible = false;
				this.hitBox.position.y = options.hitBoxYPosition || 0;
				this.root.add(this.hitBox);
			}

			if (options.model.rotation)
				this.bodyMesh.rotation.y = options.model.rotation;
			
			this.root.add(this.bodyMesh);
		}.bind(this));
	
		this.hp = options.hp;
	},

	destruct: function() {
		this.game.scene.remove(this.getRoot());

		new tg.Explosion({
			position: this.getRoot().position,
			game: this.game
		});

		this.destroyed = true;

		return this;
	},

	getModel: function() {
		return this.bodyMesh;
	},

	getHitBox: function() {
		return this.hitBox || this.bodyMesh;
	},
	
	getRoot: function() {
		return this.root;
	},

	setPosition: function (position, rotation) {
		// position
		this.root.position.x = position[0];
		this.root.position.z = position[1];

		// rotation
		this.root.rotation.y = rotation;
	},

	addTo: function(game) {
		this.game = game;
	
		// Add body to scene
		game.scene.add(this.getRoot());
	
		return this;
	},

	takeHit: function(damage) {
		this.hp -= damage || 10;
		if (this.hp <= 0 && !this.isDestroyed()) {
			this.destruct();
		}
	},

	isDestroyed: function() {
		return this.destroyed;
	}
});
