tg.WallSection = new Class({
	toString: 'WallSection',
	extend: tg.MapItem,
	options: {
		hp: 1000,
		model: {
			url: "tankGame/models/wall_section.js",
			yPosition: 10,
			size: tg.config.size.wall
		}
	}
});
