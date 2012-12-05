tg.Wall = new Class({
	extend: tg.MapItem,
	construct: function(opts) {
		this.item = new THREE.Wall(this._opts);
	}
});
