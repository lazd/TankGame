tg.Wall = new Class({
	toString: 'Wall',
	extend: tg.MapItem,
	construct: function(opts) {
		this.item = new THREE.Wall(this._opts);
	}
});
