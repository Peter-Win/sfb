/**
 * Created by PeterWin on 12.02.2018.
 */
const {Device, EAllocPrior} = require('./Device')
const {DeviceState} = require('./DeviceState')
const {TurnPhase} = require('../TurnChart')
const {FiringArc} = require('../utils/FiringArc')
const {Hex} = require('../Hex')
const {Random} = require('../Random')

class PhotonTorpedo extends Device {
	constructor(devId) {
		super(devId)
		this.name = 'Photon Torpedo'
		this.arc = 'FA'
		this.energyLim = 'W=2'
		this.eAllocPrior = EAllocPrior.PhotonTorpedo
		this.eTypePrior = 'WAIB'
		this.fsm = photFsm
		this.hitPoints = 8
		this.table = stdTable
	}
	/**
	 * @param {Ship} ship *
	 * @override
	 */
	isValidTarget(ship, target) {
		// (E4.14) Because of their terrible power, photon torpedoes cannot be fired at a target that is in the same hex
		// as the ship or adjacent to it. They have a minimum range of two hexes.
		const distance = Hex.actualDistance(ship, target)
		if (distance < 2) {
			return false
		}

		return FiringArc.inSector(this.arc, ship, target)
	}

	/**
	 * Фотонная торпеда включает инфу о силе удара и вероятности попадания
	 * @override
	 */
	updateFireTrace(params, trace) {
		const {game, ship} = params
		const target = game.getShip(trace.targetId)
		const range = ship.distanceTo(target)
		trace.damage = this.hitPoints
		trace.chance = PhotonTorpedo.findChance(this.table, range)
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
		const roll = Random.int6() + 1
		return this.isHit(ship, target, roll) ? this.hitPoints : 0
	}

	/**
	 * Определить, попал ли выстрел в цель
	 * @param {Ship} ship *
	 * @param {Counter} target *
	 * @param {number} roll	[1..6]
	 * @return {boolean}	true, if hit. false if missed
	 */
	isHit(ship, target, roll) {
		// Значение roll от 1 до 6
		// (FD1.52) When firing photon torpedoes ... add 2 to the die roll when
		// firing at drones, thus making it harder to hit them.
		roll += target.heavyWeaponPenalty	
		const range = ship.distanceTo(target)
		const chance = PhotonTorpedo.findChance(this.table, range)
		// Значение chance от 0 до 6. 0 = 0%, 1 = 1/6, 2= 1/3, 3=1/2 ... 6=1
		// roll\chance 0 1 2 3 4 5 6
		//           1 - + + + + + +
		//           2 - - + + + + +
		//           3 - - - + + + +
		//           4 - - - - + + +
		//           5 - - - - - + +
		//           6 - - - - - - +
		return chance >= roll
	}

	/**
	 * @param {Array<number>[]} table *
	 * @param {number} range *
	 * @return {number} вероятность попадания 0-5
	 */
	static findChance(table, range) {
		const item = table.find(pair => range <= pair[0])
		return item ? item[1] : 0
	}
}

const stdTable = Object.freeze([
	[2, 5],
	[4, 4],
	[8, 3],
	[12, 2],
	[30, 1],
])

const photFsm = Object.freeze({
	[DeviceState.Begin]: {
		/**
		 * @param {{dev:PhotonTorpedo}} params *
		 * @return {void}
		 */
		[TurnPhase.BeginOfTurn]: params => {
			const {dev} = params
			dev.energyIn = 0
			dev.energyLim = 'W=2'
		},
		/**
		 * @param {{dev:PhotonTorpedo}} params *
		 * @return {void}
		 */
		[TurnPhase.OnEnergyAlloc]: params => {
			const {dev} = params
			if (dev.energyIn >= 2) {
				dev.setState(DeviceState.Half)
			}
		},
	},
	[DeviceState.Half]: {
		/**
		 * @param {{dev:PhotonTorpedo}} params *
		 * @return {void}
		 */
		[TurnPhase.BeginOfTurn]: params => {
			const {dev} = params
			dev.energyIn = 0
			dev.energyLim = 'W=2'
		},
		/**
		 * @param {{dev:PhotonTorpedo}} params *
		 * @return {void}
		 */
		[TurnPhase.OnEnergyAlloc]: params => {
			const {dev} = params
			// if charged: ready to fire, else: make empty
			dev.setState(dev.energyIn >= 2 ? DeviceState.Ready : DeviceState.Begin)
		},
	},
	[DeviceState.Ready]: {
		CanFire(params) {
			const {dev, devList} = params
			devList.push(dev)
		},
		/**
		 * @param {{dev:PhotonTorpedo}} params *
		 * @return {void}
		 */
		[TurnPhase.BeginOfTurn]: params => {
			const {dev} = params
			dev.energyIn = 0
			dev.energyLim = '*1'	// waiting 1 any point for holding armed
		},
		/**
		 * @param {{dev:PhotonTorpedo}} params *
		 * @return {void}
		 */
		[TurnPhase.OnEnergyAlloc]: params => {
			const {dev} = params
			if (dev.energyIn < 1) {
				// if energy is not allocated, make empty
				dev.setState(DeviceState.Begin)
			}
		},
	},
	[DeviceState.Used]: {
		[TurnPhase.EndOfTurn]: params => {
			params.dev.setState(DeviceState.Begin)
		},
	},
})

module.exports = {PhotonTorpedo}
