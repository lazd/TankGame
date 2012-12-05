tg.MapObject = new Class({
	extend: tg.MapObject,

	takeHit: function(damage) {
		this.hp -= damage || 10;
		if (this.hp <= 0) {
			this.destruct();
		}
	},

	addTo: function(world) {
		// Store world
		this.world = world;
	
		// Add body to world
		world.add(this.model);
	
		return this;
	},

	isDestroyed: function() {
		return this.hp <= 0;
	},

	destruct: function() {
		this.world.remove(this.model);
		return this;
	},

	getModel: function() {
		return this.item.getModel();
	}
});
