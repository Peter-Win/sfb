/**
 * Корабль или объект с похожим поведением
 * Created by PeterWin on 09.12.2017.
 */
const {Counter} = require('./Counter')
const {CounterType} = require('./CounterType')
const {TurnPhase} = require('../TurnChart')
const {Device} = require('../devices/Device')
const {PhaserCapacitor} = require('../devices/PhaserCapacitor')
const {fireAgent} = require('../agents/fireAgent')
const {Events} = require('../Events')
const {Energy} = require('../utils/Energy')
const {Hex} = require('../Hex')

class Ship extends Counter {
	constructor() {
		super(CounterType.Ship)
		// warp, impulse, APR, btty
		this.energyPool = {W: 0, I: 0, A: 0, B: 0}
		this.moveCost = 1
		this.bFire = true
		this.lockOn = 1
		this.moveAction = 'MoveShips'
		this.squads = {}
		this.crewMin = 1	// minimum crew for moving ship
		this.crewHP = 0		// hit points, striked to crew/boarding parties
		this.armor = 0
		this.srcSide = 0	// Source side (side in begin of combat)

		// TODO: пока события не доделаны...
		this.fsm = {}
		this.fsm.All = {
			[TurnPhase.BeginOfTurn]: params => {
				const {ship} = params
				const ep = ship.energyPool
				ep.A = ep.B = ep.I = ep.W = 0
			},
			[TurnPhase.AutoEAlloc]: params => {
				params.ship.handlers.autoEAlloc(params)
			},
		}

		this.devs = {}
		Device.create(this.devs, PhaserCapacitor.id, PhaserCapacitor)

		this.handlers.autoEAlloc = Energy.shipAutoEAlloc
	}

	/**
	 * @param {string} devId device identifier
	 * @return {Device} *
	 */
	getDevice(devId) {
		return this.devs[devId]
	}

	/**
	 * @override
	 */
	init(description) {
		super.init(description)
	}

	/**
	 * Является ли врагом указанный корабль
	 * @param {Game} game	Main game object
	 * @param {Counter} ship	target counter
	 * @return {boolean}	true, if enemy
	 */
	isEnemy(game, ship) {
		// Врагом считается юнит, который активен и не принадлежит той же стороне
		return ship.isActive() && this.side !== ship.side
	}

	/**
	 * Сформировать список вражеских юнитов
	 * @param {Game} game Main game object
	 * @return {Array<Counter>} enemies list
	 */
	buildEnemiesList(game) {
		const {objects} = game
		return Object.keys(objects).reduce((list, key) => {
			const ship = objects[key]
			if (this.isEnemy(game, ship)) {
				list.push(ship)
			}
			return list
		}, [])
	}

	/**
	 * Корабль может стрелять, если он в активном состоянии
	 * @override
	 */
	isCanFire(game) {
		return this.isActive()
	}

	/**
	 * @override
	 */
	buildFireTargets(game) {
		// Получить список готовых к стрельбе устройств
		const params = {evid: 'CanFire', game, ship: this, devList: []}
		Events.toShip(params)
		// Получить список врагов, по которым можно стрелять
		const enemies = this.buildEnemiesList(game)
		// Сформировать список возможных вариантов стрельбы, который станет частью акции
		const result = []
		params.devList.forEach(dev => {
			enemies.forEach(target => {
				if (dev.isValidTarget(this, target)) {
					result.push(fireAgent.createTrace({game, ship: this, dev, target}))
				}
			})
		})
		return result
	}

	/**
	 * Вычислить эффективное расстояние до цели
	 * @param {Counter} target	Цель
	 * @return {number}	расстояние
	 */
	distanceTo(target) {
		// TODO: нужно вычислять эффективное расстояние. А пока используем актуальное
		return Hex.actualDistance(this.getPos(), target.getPos())
	}
}

module.exports = {Ship}
