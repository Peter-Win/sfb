/**
 * Created by PeterWin on 06.01.2018.
 */
const {Counter, ShipState} = require('./Counter')
const {CounterType} = require('./CounterType')
const {fireAgent} = require('../agents/fireAgent')
const {ImpPhase} = require('../ImpChart')

class Missile extends Counter {
	constructor() {
		super(CounterType.Drone)
		this.img = 'Drone'
		this.handlers.isCanChangeDir = () => true
		this.health = 4
		this.isSeeking = true
		this.targetId = ''

		// All drones are assigned an endurance expressed in turns.
		// In Cadet Training Handbook, this is three turns for all drones.
		this.life = 0
		this.maxLife = 3	// предельное время жизни в ходах
		this.heavyWeaponPenalty = 2	// Для тяжелых орудий тяжелее попасть в эту цель.
		this.fsm = Object.freeze({
			[ShipState.Active]: {
				[ImpPhase.EndOfImp]: params => {
					const {game, ship} = params
					ship.life++
					const maxLife = ship.maxLife * game.turnLength
					if (maxLife && ship.life >= maxLife) {
						ship.destroy(game, ShipState.Dead)
					}
				},
				OnDestroyed: params => {
					const {game, ship, targetId} = params
					if (ship.targetId === targetId) {
						// Если цель уничтожена, то дрон тоже уничтожается
						ship.destroy(game, ShipState.Dead)
					}
				},
			}
		})
	}

	/**
	 * Находится ли юнит в одном гексе с целью
	 * @param {Game} game *
	 * @return {boolean} true, if same hex
	 */
	isInTargetHex(game) {
		if (!this.targetId) {
			return false
		}
		const target = game.getShip(this.targetId)
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
			const targetShip = game.getShip(this.targetId)
			this.destroy(game)
			const result = this.makeStrike(game, targetShip)
			return fireAgent.createHit(game, result, targetShip, this, null)
		}
		return null
	}

	/**
	 * Нанести удар по цели
	 * @param {Ship} targetShip	*
	 * @return {Object<string,number>} damage statistics
	 */
	makeStrike(game, targetShip) {
		return targetShip.onDamage(game, this, targetShip, 6)
	}

	/**
	 * @override
	 */
	onDamagePoint(game, direction) {
		if (this.health > 0) {
			this.health--
			if (this.health === 0) {
				this.destroy(game)
			}
			return 'internal'
		}
		return 'lost'
	}
	
}

module.exports = {Missile}
