/**
 * Корабль или объект с похожим поведением
 * Created by PeterWin on 09.12.2017.
 */
const {Counter} = require('./Counter')
const {CounterType} = require('./CounterType')
const {TurnPhase} = require('../TurnChart')
const {ImpPhase} = require('../ImpChart')
const {Device} = require('../devices/Device')
const {PhaserCapacitor} = require('../devices/PhaserCapacitor')
const {fireAgent, DamageType} = require('../agents/fireAgent')
const {launchAgent} = require('../agents/launchAgent')
const {speedAgent} = require('../agents/speedAgent')
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
		/**
		 * Если length = 0, значит нет щитов. Если 1, значит щит общий. Но типичная длина - 6
		 * @type {number[]}
		 */
		this.shield = []
		this.shield0 = []

		this.canChangeSpeed = false	// uses in cadet scenario to direct speed changing

		this.fsm = {}
		this.fsm.All = {
			[Events.BeginOfGame]: params => {
				const {ship} = params
				ship.shield = [...ship.shield0]
			},
		}
		this.fsm.Active = {
			[TurnPhase.BeginOfTurn]: params => {
				const {ship} = params
				const ep = ship.energyPool
				ep.A = ep.B = ep.I = ep.W = 0
			},
			[TurnPhase.AutoEAlloc]: params => {
				params.ship.handlers.autoEAlloc(params)
			},
			[TurnPhase.SpeedDeterm]: params => {
				if (params.ship.canChangeSpeed) {
					const action = speedAgent.createAction(params)
					params.game.addAction(action)
				}
			},
			[ImpPhase.LaunchSeeking]: params => {
				const action = launchAgent.createAction(params)
				if (action) {
					params.game.addAction(action)
				}
			},
		}

		this.devs = {}
		Device.create(this.devs, PhaserCapacitor.id, PhaserCapacitor)

		this.handlers.autoEAlloc = Energy.shipAutoEAlloc
	}

	toSimple() {
		const data = super.toSimple()
		data.shield = [...this.shield]
		data.devs = Object.keys(this.devs).reduce((map, deviceId) => {
			const device = this.getDevice(deviceId)
			map[deviceId] = device.toSimple()
			return map
		}, {})
		return data
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

		const {disabledDevices} = description
		if (Array.isArray(disabledDevices)) {
			disabledDevices.forEach(devId => {
				this.getDevice(devId).setState(Device.states.Disabled)
			})
		}
	}

	/**
	 * Является ли врагом указанный корабль
	 * @param {Game} game	Main game object
	 * @param {Counter} ship	target counter
	 * @return {boolean}	true, if enemy
	 */
	isEnemy(game, ship) {
		// Врагом считается юнит, который активен и не принадлежит той же стороне
		return ship.isActive() && game.isEnemy(this.side, ship.side)
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
				if (dev.isCanFireTo(this, target)) {
					result.push(fireAgent.createTrace({game, ship: this, dev, target}))
				}
			})
		})
		return result
	}
	buildLaunchTargets(game) {
		const params = {evid: 'CanLaunch', game, ship: this, devList: []}
		Events.toShip(params)
		// Получить список врагов, по которым можно стрелять
		const enemies = this.buildEnemiesList(game)
		// Сформировать список возможных вариантов стрельбы, который станет частью акции
		const result = []
		params.devList.forEach(dev => {
			enemies.forEach(target => {
				if (dev.isCanFireTo(this, target)) {
					result.push(launchAgent.createPoint({game, ship: this, dev, target}))
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
		// return Hex.actualDistance(this.getPos(), target.getPos())
		return Hex.actualDistance(this, target)
	}

	/**
	 * @override
	 */
	canDamagedBy(ship, device) {
		// TODO: Пока считаем, что по кораблю можно бить любым оружием
		return true
	}

	/**
	 * @override
	 */
	onDamagePoint(game, direction) {
		const {shield} = this
		switch (shield.length) {
			case 1:
				if (shield[0] > 0) {
					shield[0]--
					return DamageType.shield
				}
				break
			case 6:
				if (shield[direction] > 0) {
					shield[direction]--
					return DamageType.shield
				}
				break
		}
		return this.handlers.onInternalDamage(game, this)
	}
}

module.exports = {Ship}
