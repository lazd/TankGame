/*
TankGame - A multiplayer tank battle game for the web 
Copyright (C) 2012 Lawrence Davis

TankGame is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

TankGame is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var tg = {
	maps: {},
	options: {
		camera: 'chase'
	},
	config: {
		comm: {
			server: (window.location.hostname || 'home.lazd.net') + ':1935', // hostname:port (without http://)
			interval: 15
		},
		colors: {
			friend: 0x886A00,
			enemy: 0x880000
		},
		tracks: {
			fadeTime: 5000,
			distance: 5
		},
		sound: {
			silentDistance: 1500
		},
		tank: {
			maxSpeed: 75,
			maxReverseSpeed: -75,
            
			backDeceleration: 1200,
			frontDeceleration: 750,
	        
			maxWheelRotation: 1,
			wheelAngularAcceleration: 3.0,
			wheelAngularDecceleration: 3.5,
			steeringRadiusRatio: 0.040,
            
			initialRotation: 0,
			initialTurretRotation: Math.PI/2,
	        
			modelRotation: Math.PI/2
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
					volume: 0.85
				}
			},
			missile: {
				interval: 1000,
				time: 3000,
				damage: 75,
				hitDistance: 8, // needs to be based on current speed of missile
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
