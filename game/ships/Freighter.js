const {Ship} = require('./Ship')
const {DeviceIds} = require('../devices/DeviceIds')
const {Device} = require('../devices/Device')
const {Phaser2} = require('../devices/Phaser2')
const {Warp} = require('../devices/Warp')
const {DamageType} = require('../agents/fireAgent')
const {ShipState} = require('../ships/Counter')

class Freighter extends Ship {
	constructor() {
		super()
		this.img = 'freighter'
		this.ssd = 'SmallFr'
		this.turnMode = [6, 16]
		this.shield0 = [5]
		this.damagePoints = 0

		const {devs} = this
		Device.create(devs, DeviceIds.WarpL, Warp, {hp: 2})
		Device.create(devs, DeviceIds.WarpR, Warp, {hp: 2})
		// Each freighter is armed with a phaser-2 that can fire in any direction.
		Device.create(devs, 'PH', Phaser2, {id: '1', arc: '360'})

		this.handlers.onInternalDamage = (game, ship) => {
			ship.damagePoints++
			switch (ship.damagePoints) {
				case 5:
					// The weapon will cease to function immediately when the freighter
					// has received five points of internal damage.
					const ph = ship.getDevice('PH')
					ph.hp = 0
					ph.setState(Device.states.Dead)
					break
				case 10:
					// After receiving 10 points of internal damage, the speed is
					// reduced to three hexes per turn.
					ship.getDevice(DeviceIds.WarpR).hp = 0
					ship.speed = 3
					break
				case 15:
					// After receiving 15 points of
					// internal damage, the speed is reduced to two hexes per turn.
					ship.getDevice(DeviceIds.WarpL).hp = 0
					ship.speed = 2
					break
				case 20:
					// After receiving 20 points of internal damage, the freighter is destroyed.
					ship.destroy(game, ShipState.Dead)
					break
			}
			return ship.damagePoints <= 20 ? DamageType.internal : DamageType.lost
		}
	}
}

module.exports = {Freighter}
