/**
 * Created by PeterWin on 06.01.2018.
 */
const {Counter, ShipState} = require('./Counter')
const {CounterType} = require('./CounterType')
const {fireAgent} = require('../agents/fireAgent')

class Missile extends Counter {
	constructor() {
		super(CounterType.Drone)
		this.img = 'Drone'
		this.handlers.isCanChangeDir = () => true
		this.health = 4
		this.isSeeking = true
		this.target = null
	}

	/**
	 * Находится ли юнит в одном гексе с целью
	 * @param {Game} game *
	 * @return {boolean} true, if same hex
	 */
	isInTargetHex(game) {
		if (!this.target) {
			return false
		}
		const target = game.getShip(this.target)
		return target.x === this.x && target.y === this.y
	}

	/**
	 * @override
	 */
	isCanMove(game) {
		if (this.isNotActive()) {
			return false
		}
		// F2.24. ... If the target enters the seeking weapon's hex, the seeking weapon does not move ...
		return !this.isInTargetHex(game)
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
	onResolveSeeking(game) {
		if (this.isActive() && this.isInTargetHex(game)) {
			// Попадание в цель
			const targetShip = game.getShip(this.target)
			const result = this.makeStrike(targetShip)
			this.onDestroyed()
			return fireAgent.createHit(game, result, targetShip, this, null)
		}
		return null
	}

	/**
	 * Нанести удар по цели
	 * @param {Ship} targetShip	*
	 * @return {Object<string,number>} damage statistics
	 */
	makeStrike(targetShip) {
		return targetShip.onDamage(this, targetShip, 6)
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
