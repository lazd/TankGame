(function() {
	var trackTexture = {
		width: 70/5,
		height: 10/5,
		segmentsW: 1,
		segmentsH: 1,
		textureUrl: 'tankGame/textures/tracks.png'
	};

	// Define the track texture
	var texture = THREE.ImageUtils.loadTexture(trackTexture.textureUrl);

	// Create the geometry	
	var geometry = new THREE.PlaneGeometry(trackTexture.width, trackTexture.height, trackTexture.segmentsW, trackTexture.segmentsH);

	tg.Track = new Class({
		extend: tg.GameObject,
		construct: function(options){
			options = jQuery.extend({
				position: new THREE.Vector3(0, 0, 0),
				rotation: new THREE.Vector3(0, 0, 0)
			}, options);
	
			var Y_POSITION = 1;
		
			this.material = new THREE.MeshBasicMaterial({
				map: texture,
				transparent: true,
				overdraw: true
			});

			// Create the mesh
			this.root = new THREE.Mesh(geometry, this.material);

			this.root.rotation.copy(options.rotation);
			this.root.position.copy(options.position);
			this.root.position.y = Y_POSITION;
		},
		addTo: function(world) {
			// Store world
			this.world = world;
	
			// Add body to world
			world.add(this.root);
	
			return this;
		},
		destruct: function() {
			this.world.remove(this.root);
			return this;
		},
		setOpacity: function(opacity) {
			this.material.opacity = opacity;
			return this;
		},
		setVisible: function(enable) {
			this.root.visible = enable;
		},
		getModel: function() {
			return this.model;
		}
	});
}());