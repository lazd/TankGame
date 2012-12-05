tg.OilTank = new Class({
	extend: tg.MapItem,
	options: {
		hp: 150,
		model: {
			url: "tankGame/models/oil_tank.js",
			yPosition: 1,
			size: 0.2,
			wrapTextures: false
		},
		hitBox: new THREE.CylinderGeometry(10, 10, 12),
		hitBoxYPosition: 6
	}
});
