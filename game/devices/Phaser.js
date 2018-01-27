/**
 * Created by PeterWin on 08.01.2018.
 */
const {DeviceState} = require('./DeviceState')
const {Device} = require('./Device')
const {ImpPhase} = require('../ImpChart')
const {TurnPhase} = require('../TurnChart')
const {Sector} = require('../Sector')
const {Events} = require('../Events')

class Phaser extends Device {
	constructor(devId) {
		super(devId)
		this.wait = 0
		this.ecost = 1
		this.fsm = phaserFsm
		this.arc = null	// Сектор обстрела. Должен быть указан при описании устройства в составе корабля
		this.table = null
	}

	/**
	 * @override
	 */
	isValidTarget(ship, target) {
		return Sector.inSector(this.arc, ship, target)
	}

	/**
	 * Фазер включает инфу о возможных повреждениях и энергозатраты
	 * @override
	 */
	updateFireTrace(params, trace) {
		const {game, ship} = params
		trace.phaserEnergy = this.ecost
		trace.damages = this.findDamagesForTarget(ship, game.objects[trace.targetId])
	}

	/**
	 * Найти варианты повреждений
	 * @param {Ship} ship	Owner of this device
	 * @param {Counter} target	цель для фазера
	 * @return {Array<number>}	6 вариантов в порядке убывания
	 */
	findDamagesForTarget(ship, target) {
		if (!this.table) {
			throw new Error('Invalid damage table for ' + this.name)
		}
		const distance = ship.distanceTo(target)
		return Phaser.findDamages(this.table, distance)
	}

	/**
	 * Нужно проверить все фазерные выстрелы. Каждое устройство может быть использовано не более 1 раза
	 * И сумма энергии не должна превышать объем Phaser Capacitor
	 * @override
	 */
	checkFireTraces(game, ship, traces, traceIndex) {
		if (traces[traceIndex].ok) {
			return true	// проверка уже выполнена
		}
		let dublicatedId = ''
		const idSet = new Set()
		traces.forEach(trace => {
			const {devId} = trace
			if (idSet.has(devId)) {
				dublicatedId = devId
			} else {
				idSet.add(devId)
			}
			trace.ok = true
		})
		return !dublicatedId
	}

	/**
	 * @override
	 */
	calcDamage(game, ship, target) {
		return 4
	}

	/**
	 * Получить возможные варианты величины удара, в зависимости от расстояния
	 * @param {Object<number,Array<number>>} table	Таблица, описывающая характеристики фазера
	 * @param {number} range	Расстояние в гексах
	 * @return {Array<number>}	6 вариантов. От максимального к минимальному.
	 */
	static findDamages(table, range) {
		for (let limit in table) {
			if (range <= limit) {
				return table[limit]
			}
		}
		return [0, 0, 0, 0, 0, 0]
	}

	/**
	 * Получить среднее значение повреждения
	 * @param {Array<number>} damages 6 вариантов повреждения
	 * @return {number} Среднее значение
	 */
	static averageDamage(damages) {
		return damages.reduce((sum, value) => sum + value, 0) / damages.length
	}
}

const phaserFsm = Object.freeze({
	All: {
		/**
		 * @param {Object} params event parameters
		 * @param {Ship} params.ship	ship
		 * @param {Device} params.dev 	device
		 * @return {void}
		 */
		[Events.BeginOfGame]: params => {
			const {ship, dev} = params
			ship.devs[Device.ids.PhCap].capacity += dev.energyCost
		},
		/**
		 * @param {Object} params	Parameters
		 * @param {Phaser} params.dev	this device
		 * @return {void}
		 */
		[ImpPhase.EndOfImp]: params => {
			params.dev.wait--	// decrease impulse counter
		},
		/**
		 * @param {{ship:Ship,dev:Phaser}} params	Parameters
		 * @return {void}
		 */
		onDestroy: params => {
			// decrease of ship phasers capasity
			const {ship, dev} = params
			ship.devs[Device.ids.PhCap].changeCapacity(-dev.ecost)
		},
	},
	[DeviceState.Begin]: {
		/**
		 * @param {{ship:Ship,dev:Phaser}} params		event parameters
		 * @param {Array<Device>} params.devList	Массив, в который собирается список орудий, готовых стрелять
		 * @return {void}
		 */
		CanFire(params) {
			const {dev, ship, devList} = params
			if (dev.wait <= 0 && ship.devs[Device.ids.PhCap].energy >= dev.ecost) {
				devList.push(dev)
			}
		},
		/**
		 * @param {{game:Game, ship:Ship, dev:Phaser}} params	event parameters
		 * @return {void}
		 */
		FireEnd(params) {
			const {dev, ship, game} = params
			dev.wait = game.turnLength / 4
			dev.setState('Used')
			ship.devs[Device.ids.PhCap].energy -= dev.ecost
		},
	},
	[DeviceState.Used]: {
		/**
		 * @param {{dev:Phaser}} params		Event parameters
		 * @return {void}
		 */
		[TurnPhase.EndOfTurn]: params => {
			params.dev.setState('Begin')
		},
	},
})

module.exports = {Phaser}
