tg.WallCorner = new Class({
	toString: 'WallCorner',
	extend: tg.MapItem,
	options: {
		hp: 1000,
		model: {
			url: "tankGame/models/wall_corner.js",
			yPosition: 10,
			size: tg.config.size.wall
		}
	}
});
