(function() {
	var trackTexture = {
		width		: 70/5,
		height		: 10/5,
		segmentsW	: 1,
		segmentsH	: 1,
		textureUrl	: 'assets/tank_tracks.png'
	};

	var texture = THREE.ImageUtils.loadTexture(trackTexture.textureUrl);

	// create the geometry	
	var geometry = new THREE.PlaneGeometry(trackTexture.width, trackTexture.height, trackTexture.segmentsW, trackTexture.segmentsH);
	
	THREE.Track = function(opts) {
		var scope = this;

		var Y_POSITION = 1;

		// internal helper variables
		this.loaded	= false;
		
		this.material = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			overdraw: true
		});

		// create the mesh
		this.root = new THREE.Mesh(geometry, this.material);
		this.root.position.y = Y_POSITION;

		this.root.rotation.copy(opts.rotation);
		this.root.position.copy(opts.position);
		this.root.position.y = Y_POSITION;

		// API
		this.setVisible = function(enable) {
			this.root.visible = enable;
		};

		this.setOpacity = function(opacity) {
			this.material.opacity = opacity;
		};
	};
}());
