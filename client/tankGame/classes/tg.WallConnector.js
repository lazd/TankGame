tg.WallConnector = new Class({
	toString: 'WallConnector',
	extend: tg.MapItem,
	options: {
		model: {
			url: "tankGame/models/wall_connector.js",
			yPosition: 10,
			size: tg.config.size.wall
		}
	}
});
