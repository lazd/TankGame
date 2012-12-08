tg.Crate = new Class({
	toString: 'Crate',
	extend: tg.MapItem,
	options: {
		hp: 21,
		model: {
			url: "tankGame/models/crate.js",
			yPosition: 4,
			size: tg.config.size.crate,
			wrapTextures: false
		}
	}
});
