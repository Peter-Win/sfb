/**
 * Created by PeterWin on 03.12.2017.
 */

const {ImpChart} = require('./ImpChart')
const {TurnChart} = require('./TurnChart')
const {TurnEvents} = require('./TurnEvents')
const {MovChart32} = require('./MovChart')
const {Side} = require('./Side')
const {SfbObject} = require('./ships/SfbObject')
const {Events} = require('./Events')
const {ActionState} = require('./agents/ActionState')
const {execAction} = require('./agents/AgentsMap')

const GameState = {
	Active: 'Active',
}

const gameFields = ['actions', 'curProc', 'curImp', 'curTurn', 'height', 'state', 'turnLength', 'userSpeed', 'width']

class Game {
	constructor() {
		this.turnLength = -1
		this.curTurn = -1
		this.turnStep = -1
		this.curImp = -1
		this.curProc = -1
		this.uidGen = -1
		this.action = ''
		this.shotNdx = 0
		this.width = 0
		this.height = 0
		this.state = ''
		this.onCheckState = ''
		this.userSpeed = false	// true, if user can changing speed in the begin of turn
		/**
		 * @type {Side[]}
		 */
		this.sides = []
		/**
		 * Игровые объекты
		 * @type {Object<string, SfbObject>}
		 */
		this.objects = {}
		/**
		 * Действия над объектами
		 * @type {Object<string,{name:string, state:string}>}
		 */
		this.actions = {}

		this.impChart = []
		this.turnChart = []
		this.movChart = []

		/**
		 * @type {function(game:Game)[]}
		 */
		this.fnStepEnd = []
	}

	/**
	 * Create new game
	 * @param {Object} scenario		Описание сценария
	 * @param {number} scenario.width	Ширина карты
	 * @param {number} scenario.height	Высота карты
	 * @param {number=} scenario.turnLength	Число иммпульсов на ход. default vallue = 32
	 * @param {string[]} scenario.impChart	Список возможных фаз импульса
	 * @param {string[]} scenario.turnChart	Список процедур, выпоолняемых за ход
	 * @param {Array} scenario.movChart		Таблица для вычисления скоростей
	 * @param {Object[]} scenario.sides	Описание сторон
	 * @param {Object[]} scenario.objects	Описание игровых объектов
	 * @returns {void}
	 */
	create(scenario) {
		this.curTurn = 1
		this.curImp = 0
		this.curProc = 0
		this.uidGen = 0
		this.turnStep = 0
		this.action = ''
		this.shotNdx = 0
		this.width = scenario.width
		this.height = scenario.height
		this.state = GameState.Active
		this.userSpeed = 0
		this.turnLength = scenario.turnLength || 32
		this.impChart = scenario.impChart || ImpChart.Advanced
		this.turnChart = scenario.turnChart || TurnChart.Advanced
		this.movChart = scenario.movChart || MovChart32
		// onCheckState = ''
		// Стороны, участвующие в игре
		this.sides = scenario.sides.map(sideData => new Side(sideData))
		// Объекты, участвующие в игре
		scenario.objects.forEach(objectData => {
			const ship = SfbObject.create(objectData)
			this.insertShip(ship)
		})
		this.actions = {}
		Events.toGame(Events.BeginOfGame, this)
	}

	/**
	 * Конвертировать в простой объект, который может быть конвертирован в JSON
	 * @returns {Object}	simple object
	 */
	toSimple() {
		const result = {objects: {}}
		// простые поля
		gameFields.forEach(field => {
			result[field] = this[field]
		})
		// Корабли и др. объекты
		Object.keys(this.objects).forEach(uid => {
			result.objects[uid] = this.objects[uid].toSimple()
		})
		return result
	}

	/**
	 * Сгенерировать уникальное значение
	 * @return {number} уникальное значение
	 */
	generateUid() {
		return ++this.uidGen
	}

	/**
	 * @param {SfbObject} ship Inserting ship or same object
	 * @returns {void}
	 */
	insertShip(ship) {
		if (!ship.uid) {
			ship.uid = `${ship.type}_${this.generateUid()}`
		}
		this.objects[ship.uid] = ship
		this.sides[ship.side].objects.push(ship)
	}

	/**
	 * Get ship by uid
	 * @param {string} uid	ship id
	 * @returns {SfbObject} ship
	 */
	getShip(uid) {
		return this.objects[uid]
	}

	/**
	 * @param {Object} action	Action object
	 * @param {string} action.uid	ship ID
	 * @returns {void}
	 */
	addAction(action) {
		this.actions[action.uid] = action
	}

	/**
	 * Send new actions to controllers
	 * @returns {void}
	 */
	sendActions() {
		Object.keys(this.actions).forEach(uid => {
			const action = this.actions[uid]
			if (action.state === ActionState.Begin) {
				const ship = this.objects[uid]
				const {ctrl} = ship
				if (!ctrl) {
					throw new Error(`Empty controller for ${ship.getSignature()}`)
				}
				action.state = ActionState.Wait
				ctrl.onAction(this, action)
			}
		})
	}

	/**
	 * receive actions
	 * @returns {void}
	 */
	receiveActions() {
		const keys = Object.keys(this.actions)
		const waitActionId = keys.find(uid => this.actions[uid].state !== ActionState.End)
		if (!waitActionId) {
			// Если все акции обработаны контроллером, значит их нужно выполнить и удалить
			keys.forEach(uid => {
				const action = this.actions[uid]
				execAction(this, action)
				delete this.actions[uid]
			})
			// Обработчики конца хода
			this.fnStepEnd.forEach(fn => fn(this))
			this.fnStepEnd.length = 0
			// Выполнить следующий ход
			this.beginStep()
		}
	}

	/**
	 * Добавить однократный обработчик конца хода
	 * @param {function(game:Game):void} handler Функция-обработчик конца хода
	 * @returns {void}
	 */
	onceStepEnd(handler) {
		this.fnStepEnd.push(handler)
	}

	beginStep() {
		const evid = this.turnChart[this.turnStep]
		const specialHandler = TurnEvents[evid]
		if (specialHandler) {
			const params = {evid, game: this}
			specialHandler(params)
		} else {
			Events.toGame(evid, this)
		}
	}
}

module.exports = {Game, GameState}
