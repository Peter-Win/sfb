/**
 * Created by PeterWin on 09.12.2017.
 */
const assert = require('assert')
const {Rules} = require('../Rules')
const {StateObject} = require('../StateObject')
const {Hex} = require('../Hex')
const {TurnMode} = require('../utils/TurnMode')
const {CtrlBase} = require('../ctrls/CtrlBase')
const {Events} = require('../Events')

const ShipState = {
	Active: 'Active',
	Dead: 'Dead',
	Lost: 'Lost',	// Выход за пределы карты
	Exploded: 'Exploded',
	Wait: 'Wait',
}

const objectFields = ['state', 'x', 'y', 'dir', 'uid', 'speed', 'turnMode', 'name', 'type', 'img', 'ssd', 'side']

class Counter extends StateObject {
	constructor(type) {
		super(ShipState.Active)
		this.type = type
		this.x = 0
		this.y = 0
		this.dir = 0
		this.uid = ''
		this.speed = 1
		/**
		 * Examples: 'D' or [6, 16]. If 'D', then TurnMode.D.	If null, then always = 1
		 * @type {null|string|number[]}
		 */
		this.turnMode = null
		this.turnModeCounter = 0	// decrement after each move, set after rotate
		this.name = ''
		this.side = 0
		this.tractorSrc = ''	// UID of tractor beam source
		this.canBeTractored = 1	// 2 if unit can be towed from map
		this.heavyWeaponPenalty = 0	// Для тяжелых орудий тяжелее попасть в эту цель.		
		this.isSeeking = false
		this.fsm = {}
		/**
		 * @type {CtrlBase}
		 */
		this.ctrl = null
		// Вместо методов используются обработчики, позволяющие гибко агрегировать нужное поведение
		this.handlers = {
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

	/**
	 * Получить объект с координатами корабля
	 * @return {{x:number, y:number}}	координаты
	 */
	getPos() {
		return {x: this.x, y: this.y}
	}
	getPosDir() {
		return {x: this.x, y: this.y, dir: this.dir}
	}

	/**
	 * Прогноз позиции юнита после выполнения перемещения
	 * @return {{x,y:number}}	unit position after move in current direction
	 */
	getNextPos() {
		return Hex.nearPos[this.dir](this)
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
			if (ctrl instanceof CtrlBase) {
				// указан экземпляр контроллера TODO: !!!
				this.ctrl = ctrl
			} else {
				// указан конструктор контроллера
				this.ctrl = new ctrl
			}
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
		return game.inMap(this)
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

	isCanRotate() {
		return this.turnModeCounter <= 0
	}

	/**
	 * Получить режим поворота
	 * @return {number} integer value from 1
	 */
	getTurnMode() {
		const {turnMode} = this
		if (!turnMode) {
			return 1
		}
		const table = Array.isArray(turnMode) ? turnMode : TurnMode[turnMode]
		if (!table) {
			throw new Error(`Invalid turnMode ${turnMode} for ${this.getSignature()}`)
		}
		return TurnMode.calc(this.speed, table)
	}

	/**
	 * Ship can fire
	 * Это просто способность стрелять. Без учета наличия готовых орудий или попадания противника в сектор обстрела.
	 * Например, ракеты не могут стрелять, а корабли потенциально могут.
	 * @param {Game} game	Main game object
	 * @return {boolean} true, id can fire
	 */
	isCanFire(game) {
		return false
	}

	/**
	 * Получить список реальных целей для стрельбы с учетом всех возможных факторов и с оценкой вероятности поражения
	 * @param {Game} game	Main game object
	 * @return {{devId,targetId:string, arcMap:number, pos,targetPos:{x,y:number}}[]}	Targets list
	 */
	buildFireTargets(game) {
		return []
	}
	/**
	 * Получить список реальных целей для пуска ракет(торпед) с учетом всех возможных факторов
	 * @param {Game} game	Main game object
	 * @return {{devId,targetId:string, dirs:{x,y}[], pos,targetPos:{x,y:number}}[]}	Targets list
	 */
	buildLaunchTargets(game) {
		return []
	}

	isTractored() {
		return false	// TODO: заглушка
	}

	isHaveMinCrew() {
		return true	// TODO: заглушка
	}

	/**
	 * Возможно ли повреждение данного типа игровых объектов указанным врагом и его оружием, если это корабль
	 * Учитываются только типы объектов. Без учета расстояния и возможности врага совершить удар.
	 * @abstract
	 * @param {Counter} ship	May be ship, drone, plasma torp, etc...
	 * @param {Device=} device	for ships only. null for seeking weapon
	 * @return {boolean}	true, if can damaged
	 */
	canDamagedBy(ship, device) {
		return false
	}

	/**
	 * Обработка процедуры ResolveSeeking
	 * @param {Game} game 	Main game object
	 * @return {{sourceId,targetId,targetState,type:string, result:Object<string,number>}} Hit structure
	 */
	onResolveSeeking(game) {
	}

	/**
	 * Получение кораблём указанного количества повреждений
	 * @param {Game} game *
	 * @param {Counter} source	*
	 * @param {Device=} device	* Only for ship source
	 * @param {number} value	*
	 * @return {Object<string,number>}	Статистика полученных типов повреждения
	 */
	onDamage(game, source, device, value) {
		const {Game} = require('../Game')
		assert(game instanceof Game, 'Invalid game in Counter.onDamage')
		const result = {}
		if (!this.canDamagedBy(source, device)) {
			result.lost = value
		} else {
			const direction = device ?
				Hex.calcBeamStrikeSide(source, this) :
				Hex.calcStrikeSide(source.dir, this.dir)
			// console.log('Strike to side ', direction)
			for (let i = 0; i < value; i++) {
				const type = this.onDamagePoint(game, direction)
				result[type] = (result[type] || 0) + 1
			}
		}
		return result
	}

	/**
	 * Вызывается в случае уничтожения объекта
	 * @param {Game} game *
	 * @param {string} newState	Новое состояние
	 * @return {void}
	 */
	destroy(game, newState = ShipState.Exploded) {
		this.setState(newState)
		Events.toGame('OnDestroyed', game, {targetId: this.uid})
	}

	/**
	 * @param {Game} game	Main Game object
	 * @param {{sourceId,targetId:string}[]} hits *
	 * @return {void}
	 */
	updateShotDescription(game, hits) {
		hits.targetState = this.state
	}

	/**
	 * Переопределяемая функция, которая получает единицу повреждения
	 *   _5/B \1  if A strike to B, then direction = 4
	 *  /A \__/2
	 *      3
	 * @abstract
	 * @param {Game} game *
	 * @param {number} direction	Direction of strike
	 * @return {string}	'lost' | 'shield' | 'internal'	Тип полученного повреждения
	 */
	onDamagePoint(game, direction) {
		return 'lost'
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
