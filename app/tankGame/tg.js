var tg = {
	maps: {},
	options: {
		camera: 'chase'
	},
	config: {
		comm: {
			interval: 1
		},
		colors: {
			friend: 0x886A00,
			enemy: 0x880000
		},
		tracks: {
			fadeTime: 5000,
			distance: 5
		},
		weapons: {
			bullet: {
				interval: 125,
				time: 2000,
				speed: 350,
				damage: 10,
				hitDistance: 15,
				sound: {
					file: 'fire_bullet',
					volume: 1
				}
			},
			missile: {
				interval: 1000,
				time: 3000,
				damage: 75,
				hitDistance: 8, // needs to be based on speed!
				sound: {
					file: 'fire_missile',
					volume: 0.35
				}
			}
		},
		size: {
			tank: 0.1,
			missile: 0.02,
			turret: 0.35,
			crate: 0.045,
			wall: 10
		},
		sounds: {
			fire_bullet: "tankGame/sounds/fire_bullet.ogg",
			fire_missile: "tankGame/sounds/fire_missile.ogg",
			fire_enemy: "tankGame/sounds/fire_enemy.ogg",
			hit_building: "tankGame/sounds/hit_building.ogg",
			hit_tank: "tankGame/sounds/hit_tank.ogg",
			hit_tank_self: "tankGame/sounds/hit_tank_self.ogg",
			explosion: "tankGame/sounds/explosion.ogg"
		}
	}
};
