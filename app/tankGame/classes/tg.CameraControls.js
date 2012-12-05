tg.CameraControls = new Class({
	toString: 'CameraControls',
	construct: function(options) {
		// handle parameters
		this.options = jQuery.extend({
			type: 'overhead',
			chase: {
  				height: 115,
				trailX: 300,
				trailZ: 300,
				follow: 'turret'
			},
			overhead: {
				distance: 550,
				rotate: false
			}
		}, options);
		
		this.bind(this.update);
	},
	update: function() {
		var tank = this.options.tank;
		var tankPosition = tank.getRoot().position;
		var tankRotation = tank.getRoot().rotation.y;
		var turretRotation = tank.getTurret().rotation.y + tankRotation + Math.PI;
		
		// Follow tank with camera
		if (this.options.type == 'overhead') {
			this.options.camera.position.x = tankPosition.x;
			this.options.camera.position.y = this.options.overhead.distance;
			this.options.camera.position.z = tankPosition.z;
			
			// Rotate camera with tank
			if (this.options.overhead.rotate)
		    	this.options.camera.rotation.y = tankRotation;
		}
		else if (this.options.type == 'chase') {
			this.options.camera.position.y = this.options.chase.height;
			
			if (this.options.chase.follow == 'tank') {
				this.options.camera.position.x = tankPosition.x+Math.sin(tankRotation+Math.PI)*this.options.chase.trailX;
				this.options.camera.position.z = tankPosition.z+Math.cos(tankRotation+Math.PI)*this.options.chase.trailZ;
			}
			else if (this.options.chase.follow == 'turret') {
				this.options.camera.position.x = tankPosition.x+Math.sin(turretRotation)*this.options.chase.trailX;
				this.options.camera.position.z = tankPosition.z+Math.cos(turretRotation)*this.options.chase.trailZ;
			}
		}
	
		this.options.camera.lookAt(tankPosition);
	}
});
