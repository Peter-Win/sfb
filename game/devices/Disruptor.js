/* E3.0 Disruptor bolts
 * 
 */
const {Device, EAllocPrior} = require('./Device')
const {DeviceState} = require('./DeviceState')
const {TurnPhase} = require('../TurnChart')
const {FiringArc} = require('../utils/FiringArc')
const {Hex} = require('../Hex')
const {Random} = require('../Random')

class Disruptor extends Device {
	constructor(devId) {
		super(devId)
		this.name = 'Disruptor Bolt'
		this.arc = 'FA'
		this.energyLim = '*2'
		this.eAllocPrior = EAllocPrior.Disruptor
		this.eTypePrior = 'AIWB'
		this.fsm = disruptorFsm
		this.table = stdDisruptorTable
	}

	/**
	 * @param {Ship} ship *
	 * @override
	 */
	isValidTarget(ship, target) {
		// (E3.32) Disruptors cannot be fired at range zero.
		const distance = Hex.actualDistance(ship, target)
		if (distance === 0) {
			return false
		}
		return FiringArc.inSector(this.arc, ship, target)
	}
	/**
	 * Дизраптор включает инфу о силе удара и вероятности попадания
	 * @override
	 */
	updateFireTrace(params, trace) {
		const {game, ship} = params
		const target = game.getShip(trace.targetId)
		Object.assign(trace, this.calcFiringParams(ship, target))
	}

	/**
	 * Просто проверка отсутствия дублирования
	 * @override
	 */
	checkFireTraces(game, ship, traces, traceIndex) {
		const {devId} = traces[traceIndex]
		const duplicated = traces.find((trace, i) => i !== traceIndex && trace.devId === devId)
		return !duplicated
	}

	/**
	 * @override
	 */
	calcDamage(game, ship, target) {
		const {chance, damage} = this.calcFiringParams(ship, target)
		let roll = Random.int6() + 1
		// roll\chance 5 4 3 2
		//           1 + + + +
		//           2 + + + +
		//           3 + + + -
		//           4 + + - -
		//           5 + - - -
		//           6 - - - -
		roll += target.heavyWeaponPenalty
		return roll <= chance ? damage : 0
	}

	/**
	 * E3.33 Range effects
	 * When the effective range of a disruotor bolt is different from the true range,
	 * use the effective range to determine the probability of a hit
	 * and the true range to determine the number of damage points scored.
	 * @param {Ship} ship *
	 * @param {Counter} target *
	 * @return {void}
	 */
	calcFiringParams(ship, target) {
		const effectiveRange = ship.distanceTo(target)
		const trueRange = Hex.actualDistance(ship, target)
		const damage = Disruptor.findRangeValue(this.table, trueRange, 2)
		const chance = Disruptor.findRangeValue(this.table, effectiveRange, 1)
		return {damage, chance}
	}

	/**
	 * @param {Array<number>[]} table 	[range, chance, damage]
	 * @param {number} range 	*
	 * @param {number} index 	1=chance, 2=damage
	 * @return {number} chance or damage
	 */
	static findRangeValue(table, range, index) {
		const item = table.find(item => range <= item[0])
		return item ? item[index] : 0
	}
}

// range, chance, hitPoints
const stdDisruptorTable = Object.freeze([
	[0, 0, 0],
	[1, 5, 5],
	[2, 5, 4],
	[4, 4, 4],
	[8, 4, 3],
	[15, 4, 3],
	[22, 3, 2],
	[30, 2, 2],
])

const disruptorFsm = Object.freeze({
	[DeviceState.Begin]: {
		/**
		 * @param {{dev:Disruptor}} params *
		 * @return {void}
		 */
		[TurnPhase.BeginOfTurn]: params => {
			const {dev} = params
			dev.energyIn = 0
		},
		/**
		 * @param {{dev:Disruptor}} params *
		 * @return {void}
		 */
		[TurnPhase.OnEnergyAlloc]: params => {
			const {dev} = params
			if (dev.energyIn >= 2) {
				dev.setState(DeviceState.Ready)
			}
		},
	},
	[DeviceState.Used]: {
		[TurnPhase.EndOfTurn]: params => {
			params.dev.setState(DeviceState.Begin)
		},
	},
	[DeviceState.Ready]: {
		CanFire(params) {
			const {dev, devList} = params
			devList.push(dev)
		},
		/**
		 * @param {{game:Game, ship:Ship, dev:Disruptor}} params	event parameters
		 * @return {void}
		 */
		FireEnd(params) {
			params.dev.setState(DeviceState.Used)
		},
		/**
		 * @param {{dev:Disruptor}} params *
		 * @return {void}
		 */
		[TurnPhase.EndOfTurn]: params => {
			params.dev.setState(DeviceState.Begin)
		},
	},
})
module.exports = {Disruptor, stdDisruptorTable}
