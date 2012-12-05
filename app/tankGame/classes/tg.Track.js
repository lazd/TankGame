tg.Track = new Class({
	extend: tg.GameObject,
	construct: function(options){
		// handle parameters
		options = jQuery.extend({
			position: new THREE.Vector3(0, 0, 0),
			rotation: new THREE.Vector3(0, 0, 0)
		}, options);
	
		var track = new THREE.Track(options);
		this._track = track;
	
		this.model = track.root;

		track.callback	= function( object ) {
			this.trigger('load');
		}.bind(this);
	},
	addTo: function(world) {
		// Store world
		this.world = world;
	
		// Add body to world
		world.add(this.model);
	
		return this;
	},
	destruct: function() {
		this.world.remove(this.model);
		return this;
	},
	setOpacity: function(opacity) {
		this._track.setOpacity(opacity);
		return this;
	},
	getModel: function() {
		return this.model;
	}
});
