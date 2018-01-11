/**
 * Created by PeterWin on 09.12.2017.
 */
const {Rules} = require('../Rules')
const {StateObject} = require('../StateObject')

const ShipState = {
	Active: 'Active',
	Dead: 'Dead',
	Lost: 'Lost',	// Выход за пределы карты
	Exploded: 'Exploded',
	Wait: 'Wait',
}

const objectFields = ['state', 'x', 'y', 'dir', 'uid', 'speed', 'turnMode', 'name', 'type', 'img']

class Counter extends StateObject {
	constructor() {
		super(ShipState.Active)
		this.x = 0
		this.y = 0
		this.dir = 0
		this.uid = ''
		this.speed = 1
		this.turnMode = 1
		this.name = ''
		this.type = ''
		this.side = 0
		this.tractorSrc = ''	// UID of tractor beam source
		this.canBeTractored = 1	// 2 if unit can be towed from map
		this.fsm = {}
		/**
		 * @type {CtrlBase}
		 */
		this.ctrl = null
		// Вместо методов используются обработчики, позволяющие гибко агрегировать нужное поведение
		this.handlers = {
			/**
			 * @param {Object} params	Parameters
			 * @param {Game} params.game	main game object
			 * @param {Counter} params.ship	current ship
			 * @returns {boolean} Может ли данный корабль совершить поворот в текущий момент
			 */
			isCanChangeDir(params) {
				return false
			},
		}
	}

	/**
	 * Установить позицию и (возможно) направление
	 * @param {number} x	X
	 * @param {number} y	Y
	 * @param {number|undefined} dir	optional direction
	 * @return {void}
	 */
	setPos(x, y, dir) {
		this.x = x
		this.y = y
		if (dir !== undefined) {
			this.dir = dir
		}
	}

	// Экспорт в простой объект
	toSimple() {
		return objectFields.reduce((acc, field) => {
			acc[field] = this[field]
			return acc
		}, {})
	}

	/**
	 * Краткое текстовое описание объекта
	 * @returns {string}	signature
	 */
	getSignature() {
		return `${this.name} (${this.uid})`
	}
	/**
	 * @return {Object} FSM object
	 */
	getFsm() {
		return this.fsm
	}

	init(description) {
		// скопировать все простые поля из описания
		Object.keys(description).forEach(key => {
			const value = description[key]
			const type = typeof value
			if (type == 'string' || type == 'number' || type == 'boolean') {
				this[key] = value
			}
		})
		// скопировать функции контроллера
		const {handlers} = description
		if (handlers) {
			Object.keys(handlers).forEach(key => this.handlers[key] = handlers[key])
		}
		// Контроллер
		const {ctrl} = description
		if (ctrl) {
			this.ctrl = new ctrl
		}
	}

	/**
	 * @param {Game} game	main game object
	 * @returns {void}
	 */
	updateState(game) {
		if (!this.inMap(game)) {
			// Выход за границы карты
			this.setState(ShipState.Lost)
		}
	}

	/**
	 * Проверка попадания в границы карты
	 * @param {Game} game	Main game object
	 * @return {boolean} true, if object in map bounds
	 */
	inMap(game) {
		const {x, y} = this
		return x >= 0 && y >= 0 && x < game.width && y < game.height
	}

	/**
	 * Возможно ли перемещаться данному кораблю
	 * @param {Game} game	main game object
	 * @return {boolean}	true, если можно двигаться
	 */
	isCanMove(game) {
		if (this.isNotActive() || this.isTractored() || !this.isHaveMinCrew()) {
			return false
		}
		const intSpeed = ~~this.speed
		return !!game.movChart[game.curImp][intSpeed]
	}

	/**
	 * Ship can fire
	 * @param {Game} game	Main game object
	 * @return {boolean} true, id can fire
	 */
	isCanFire(game) {
		return false
	}

	isTractored() {
		return false	// TODO: заглушка
	}

	isHaveMinCrew() {
		return true	// TODO: заглушка
	}

	/**
	 * Создать объект из описания
	 * @param {Object} description Описание, которое используется в сценариях
	 * @param {function} description.type Конструктор объекта
	 * @returns {Counter} Корабль или другой объект
	 */
	static create(description) {
		// У описания обязательно должен быть указан тип
		const {Type} = description
		if (!Type) {
			throw new Error(`Undefined type for ship object ${description.name}`)
		}
		const instance = new Type()
		instance.init(description)
		return instance
	}
}

module.exports = {Counter, ShipState}
