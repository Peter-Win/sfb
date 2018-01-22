/**
 * Created by PeterWin on 06.01.2018.
 */
const {Counter} = require('./Counter')
const {CounterType} = require('./CounterType')

class Missile extends Counter {
	constructor() {
		super(CounterType.Drone)
		this.img = 'Drone'
		this.handlers.isCanChangeDir = () => true
		this.health = 4
	}
	isCanMove() {
		return true
	}
	/**
	 * @override
	 */
	canDamagedBy(ship, device) {
		if (ship.type === CounterType.Drone) {
			return true
		}
		if (ship.type === CounterType.Ship && device) {
			return true
		}
		return false
	}

	/**
	 * @override
	 */
	onDamagePoint(direction) {
		if (this.health > 0) {
			this.health--
			if (this.health === 0) {
				this.onDestroyed()
			}
			return 'internal'
		}
		return 'lost'
	}
	
}

module.exports = {Missile}
