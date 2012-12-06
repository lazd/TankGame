tg.Ground = new Class({
	toString: 'Ground',
	extend: tg.GameObject,
	construct: function(options) {
		options = jQuery.extend({
			width: 256*10,
			height: 256*10,
			segmentsW: 1,
			segmentsH: 1,
			textureRepeatX: 256/10,
			textureRepeatY: 256/10,
			textureUrl: 'tankGame/textures/ground.png'
		}, options);

		var texture = THREE.ImageUtils.loadTexture(options.textureUrl);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(options.textureRepeatX, options.textureRepeatY);

		var material = new THREE.MeshBasicMaterial({
			map: texture,
			color: 0xFFFFFF
		});

		// create the geometry	
		var geometry = new THREE.PlaneGeometry(options.width, options.height, options.segmentsW, options.segmentsH);
	
		// create the mesh
		var mesh = new THREE.Mesh(geometry, material);
		mesh.receiveShadow = true;
	
		this.root = mesh;
	}
});
