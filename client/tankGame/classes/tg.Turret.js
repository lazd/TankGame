tg.Turret = new Class({
	toString: 'Turret',
	extend: tg.MapItem,
	options: {
		hp: 7,
		model: {
			url: "tankGame/models/turret.js",
			yPosition: 1,
			size: tg.config.size.turret,
			wrapTextures: false
		}
	}
});
