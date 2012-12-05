tg.Turret = new Class({
  toString: 'Turret',
  extend: tg.GameObject,
  construct: function(opts){
  	// handle parameters
  	this._opts = jQuery.extend({
  		position: new THREE.Vector3(0, 0, 0),
  		rotation: 0,
  		hp: 100
  	}, opts);
	
  	var turret = new THREE.Turret(this._opts);
  	this.turret = turret;
	
  	this.hp = this._opts.hp;
	
  	this.model = turret.root;

  	turret.callback = function( object ) {
  		this.trigger('load');
  	}.bind(this);
  },
  
  takeHit: function() {
  	this.hp -= 10;
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
  	return this.model;
  }
});
