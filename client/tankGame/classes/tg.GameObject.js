tg.GameObject = new Class({
	toString: 'GameObject',
	extend: EventEmitter,
	construct: function(options) {
		// Bind execution scope of update, if necessary
		if (this.update)
			this.bind(this.update);
		
		// Store scene for remove
		this.game = options.game;
	},
	
	init: function() {
		this.add();
	},
	
	destruct: function() {
		// Unhook from the rendering loop
		if (this.update)
			this.game.unhook(this.update);
		
		// Remove from the scene
		this.game.scene.remove(this.root);
	},
	
	add: function() {
		// Add mesh to world
		this.game.scene.add(this.root);
		
		// Hook to the rendering loop
		if (this.update)
			this.game.hook(this.update);
			
		return this;
	},

	getModel: function() {
		return this.root;
	},
	
	// TODO: use only getModel or getRoot
	getRoot: function() {
		return this.root;
	},
	
	show: function() {
		this.root.visible = true;
	},
	
	hide: function() {
		this.root.visible = false;
	}
});
