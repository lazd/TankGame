tg.Missile = new Class({
	extend: tg.GameObject,
	
	construct: function(options){
		// handle parameters
		options = jQuery.extend({
			position: new THREE.Vector3(0, 0, 0),
			rotation: 0
		}, options);
	
		var bullet = new THREE.Missile(options);
		this._bullet = bullet;
	
		// Store refernce to model
		this.bulletModel = this._bullet.root;

		bullet.callback = function(object) {
			this.trigger('load');
		}.bind(this);
	},

	addTo: function(world) {
		// Store world
		this.world = world;
	
		// Store start time
		this.time = new Date().getTime();
	
		// Add body to world
		world.add(this.bulletModel);
	
		// hook the rendering loop and update the bullet model
		this._loopCb = this._loopCb.bind(this);
		tg.game.hook(this._loopCb);
	
		return this;
	},

	_loopCb: function(delta) {
		// Update the position of the bullet based on time
		this._bullet.updateModel(delta);
	
		// TBD: check for collisions
	},

	destruct: function() {
		this.world.remove(this.bulletModel);
		tg.game.unhook(this._loopCb);
	},

	getModel: function() {
		return this.bulletModel;
	}
});
