tg.Barrel = new Class({
	toString: 'Barrel',
	extend: tg.MapItem,
	options: {
		hp: 7,
		model: {
			url: "tankGame/models/barrel.js",
			textures: [
				"tankGame/textures/Barrel_explosive.jpg"
			],
			yPosition: 4,
			size: 0.2,
			wrapTextures: false
		}
	}
});
