/**
 * Created by PeterWin on 03.12.2017.
 */

const {ImpChart} = require('./ImpChart')
const {TurnChart, TurnPhase} = require('./TurnChart')
const {TurnEvents} = require('./TurnEvents')
const {MovChart32} = require('./MovChart')
const {Side} = require('./Side')
const {Counter} = require('./ships/Counter')
const {Events} = require('./Events')
const {ActionState} = require('./agents/ActionState')
const {execAction, mergeAction} = require('./agents/AgentsMap')
const {StateObject} = require('./StateObject')
const {GameState} = require('./GameState')
const {XMessage} = require('./lang/XMessage')

const gameFields = ['actions', 'curImp', 'curTurn', 'height', 'state', 'turnLength', 'userSpeed', 'width']

class Game extends StateObject {
	constructor() {
		super(GameState.New)
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
		this.onCheckState = ''
		this.userSpeed = false	// true, if user can changing speed in the begin of turn
		/**
		 * @type {Side[]}
		 */
		this.sides = []
		/**
		 * Игровые объекты
		 * @type {Object<string, Counter>}
		 */
		this.objects = {}
		/**
		 * Действия над объектами shipId => action
		 * @type {Map<string,{name:string, state:string}>}
		 */
		this.actions = new Map()
		/**
		 * Список выстрелов, которые приходят из FireDirect в ResolveDirect
		 * @type {Array<{uid:string, traces:Array<{devId,targetId:string, damages:number[6]}>}>}
		 */
		this.fires = []

		this.impChart = []
		this.turnChart = []
		this.movChart = []
		this.bIdleBreak = false	// Отладочный режим. Если true, то idle заканчивается без цикла

		this.checkState = game => {
			// Эта функцтя должна быть перезаписана сценарием
			game.setState(GameState.InvalidEndHandler)
		}
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
	 * @param {function(game:Game):void} scenario.checkState	Функция проверки конца сценария
	 * @returns {void}
	 */
	create(scenario) {
		this.setState(GameState.Active)
		this.curTurn = 0
		this.curImp = 0
		this.curProc = 0
		this.uidGen = 0
		this.turnStep = 0
		this.action = ''
		this.shotNdx = 0
		this.width = scenario.width
		this.height = scenario.height
		this.userSpeed = 0
		this.turnLength = scenario.turnLength || 32
		this.impChart = scenario.impChart || ImpChart.Advanced
		this.turnChart = scenario.turnChart || TurnChart.Advanced
		this.movChart = scenario.movChart || MovChart32
		// Стороны, участвующие в игре
		this.sides = scenario.sides.map((sideData, i) => new Side({index: i, ...sideData}))
		// Объекты, участвующие в игре
		scenario.objects.forEach(objectData => {
			const ship = Counter.create(objectData)
			this.insertShip(ship)
		})
		this.actions.clear()
		this.checkState = scenario.checkState || this.checkState
		Events.toGame(Events.BeginOfGame, this)
	}

	/**
	 * Закончить игру
	 * @param {number} winnerSide	Номер победившей стороны или -1, если проиграли все
	 * @param {string|XMessage|{text:string,params:Object}} reasonMessage *
	 * @return {void}
	 * @throws {Error}
	 */
	finish(winnerSide, reasonMessage) {
		if (!this.isActive()) {
			throw new Error('Invalid game finish with state = ' + this.state)
		}
		this.sides.forEach((side, index) => {
			side.setState(index === winnerSide ? Side.states.Winner : Side.states.Loser)
		})
		this.setState(GameState.End)
		this.reasonMessage = new XMessage(reasonMessage)
		this.sendInfo({
			type: 'finish',
			state: this.state,
			winner: winnerSide,
			reason: this.reasonMessage.toSimple(),
		})
	}

	/**
	 * @return {boolean} true, если выполняется фаза импульса (это большая часть игрового времени)
	 */
	isImpulse() {
		return this.getTurnPhase() === TurnPhase.ImpulseProc
	}

	getTurnPhase() {
		return this.turnChart[this.turnStep]
	}
	getImpPhase() {
		return this.impChart[this.curProc]
	}
	/**
	 * @param {{x,y:number}} pos *
	 * @return {boolean} true, if in map
	 */
	inMap(pos) {
		return pos.x >=0 && pos.y >=0 && pos.x < this.width && pos.y < this.height
	}

	/**
	 * Конвертировать в простой объект (совместимый с JSON)
	 * @returns {Object}	JSON-object
	 */
	toSimple() {
		const result = {objects: {}}
		// простые поля
		gameFields.forEach(field => {
			result[field] = this[field]
		})
		result.turnStepId = this.turnChart[this.turnStep]
		if (this.isImpulse()) {
			result.curProcId = this.impChart[this.curProc]
		}
		// reason message
		result.reasonMessage = this.reasonMessage
		// Корабли и др. объекты
		Object.keys(this.objects).forEach(uid => {
			result.objects[uid] = this.objects[uid].toSimple()
		})
		// Стороны
		result.sides = this.sides.map(side => side.toSimple())
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
	 * @param {Counter} ship Inserting ship or same object
	 * @returns {void}
	 */
	insertShip(ship) {
		if (!ship.uid) {
			ship.uid = `${ship.type}_${this.generateUid()}`
		}
		this.objects[ship.uid] = ship
	}

	/**
	 * Get ship by uid
	 * @param {string} uid	ship id
	 * @returns {Counter} ship
	 */
	getShip(uid) {
		return this.objects[uid]
	}

	/**
	 * @param {number} sourceSide 	Index of source side
	 * @param {number} targetSide	*
	 * @return {boolean} 	true, if target is enemy for source
	 */
	isEnemy(sourceSide, targetSide) {
		const source = this.sides[sourceSide]
		return source.isEnemy(targetSide)
	}

	/**
	 * @param {Object} action	Action object
	 * @param {string} action.uid	ship ID
	 * @returns {void}
	 */
	addAction(action) {
		if (action) {
			this.actions.set(action.uid, action)
		}
	}

	/**
	 * Send new actions to controllers
	 * @returns {void}
	 */
	sendActions() {
		this.actions.forEach(action => {
			const {uid} = action
			if (action.state === ActionState.Begin) {
				const ship = this.objects[uid]
				const {ctrl} = ship
				if (!ctrl) {
					throw new Error(`Empty controller for ${ship.getSignature()}, action=${JSON.stringify(action)}`)
				}
				action.state = ActionState.Wait
				ctrl.onAction(this, action)
			}
		})
	}

	/**
	 * Обработанная акция пришла по внешнему каналу.
	 * Состояние не учитывается.
	 * @param {{name,state,uid:string}} action	Акция, обработанная клиентом
	 * @return {void}
	 */
	onActionIncome(action) {
		const oldAction = this.actions.get(action.uid)
		// Если вдруг приходит акция, не имеющая аналога среди существующих, то игнорируем
		if (!oldAction) {
			return
		}
		// Если акция пришла извне, то мержить полученные данные в существующий объект
		if (oldAction !== action) {
			mergeAction(this, action)
		}
		// Обозначить акцию, как законченную
		oldAction.state = ActionState.End
		// Продолжить жизненный цикл игры
		this.receiveActions()
	}

	/**
	 * Проверить список акций
	 * @return {boolean}	true, if all actions finished
	 */
	checkActions() {
		const actionsList = []
		for (const [uid, action] of this.actions) {
			if (action.state !== ActionState.End) {
				// Если есть незаконченная акция - дальше ничего не делать (будет новый вызов receiveActions)
				return false
			}
			actionsList.push(action)
		}
		// Если все акции обработаны контроллером, значит их нужно выполнить и удалить
		actionsList.forEach(action => {
			execAction(this, action)
			this.actions.delete(action.uid)
		})
		return true
	}

	/**
	 * Вызывается после обработки акции контроллером.
	 * Акции, обработанные контроллером, имеют состояние End.
	 * Передача на обработку агентам происходит только после закрытия всех акций.
	 * @returns {void}
	 */
	receiveActions() {
		if (this.checkActions()) {
			// Выполнить следующий ход
			this.idle()
		}
	}

	/**
	 * Добавить однократный обработчик конца хода
	 * @param {function(game:Game):void} handler Функция-обработчик конца хода
	 * @returns {void}
	 */
	// onceStepEnd(handler) {
	// 	this.fnStepEnd.push(handler)
	// }

	/**
	 * Получить список контроллеров (без повторений)
	 * @return {CtrlBase[]} список контроллеров
	 */
	getAllCtrls() {
		const all = new Set()
		const add = ctrl => {
			if (ctrl) {
				all.add(ctrl)
			}
		}
		this.sides.forEach(side => add(side.ctrl))
		Object.keys(this.objects).forEach(key => {
			const ship = this.objects[key]
			add(ship.ctrl)
		})
		return Array.from(all.values())
	}

	/**
	 * Выполнить очередной шаг
	 * @return {void}
	 */
	nextStep() {
		if (this.isNotActive()) {
			return
		}
		const evid = this.turnChart[this.turnStep]
		// Сообщение рассылается всем
		Events.toGame(evid, this)
		// Возможно, есть обработчик процедуры
		const specialHandler = TurnEvents[evid]
		if (specialHandler) {
			const params = {evid, game: this}
			specialHandler(params)
		}
		// Если появились акции - отправить на обработку
		this.sendActions()
		// Проверить, не закончена ли игра
		if (this.isActive()) {
			this.checkState(this)
		}
		// сообщить контроллерам
		this.sendStepToAll()
	}

	/**
	 * Отправить всем контроллерам сообщение о смене состояния игры
	 * @return {void}
	 */
	sendStepToAll() {
		const ctrls = this.getAllCtrls()
		ctrls.forEach(ctrl => ctrl.onStep(this))
	}

	/**
	 * Отправить информационное сообщение всем контроллерам.
	 * @param {{type:string}} info	JSON-структура
	 * @return {void}
	 */
	sendInfo(info) {
		const ctrls = this.getAllCtrls()
		ctrls.forEach(ctrl => ctrl.onInfo(this, info))
	}

	switchProc() {
		if (this.curTurn === 0) {
			// Самый первый ход
			this.curTurn++
			return
		}
		if (this.turnChart[this.turnStep] !== TurnPhase.ImpulseProc) {
			// Если не процедура импульса, то просто переход к следующей процедуре
			this.turnStep++
			if (this.turnStep === this.turnChart.length) {
				this.turnStep = 0
				this.curTurn++	// Новый ход
			} else if (this.turnChart[this.turnStep] === TurnPhase.ImpulseProc) {
				this.curImp = 0
			}
		} else {
			// Импульсы
			this.curProc++
			if (this.curProc === this.impChart.length) { // новый импульс
				this.curProc = 0
				this.curImp++
				if (this.curImp === this.turnLength) { // импульсы кончились. Base 0
					this.turnStep++
				}
			}
		}
	}

	/**
	 * Выполнять шаги, пока не появятся акции
	 * Когда акции будут выполнены, вызов receiveActions(), который снова запустит idle()
	 * @return {void}
	 */
	idle() {
		for (let j = 0; j < 300; j++) {
			// Только для активного состояния игры...
			if (this.isNotActive()) {
				return
			}
			// Если появились акции, прекратить выполнять шаги
			if (!this.checkActions()) {
				return
			}
			this.switchProc()
			this.nextStep()
			if (this.bIdleBreak) {
				return
			}
		}
		// Для предотвращения бесконечного цикла
		throw new Error('Dead loop in Game.idle()')
	}

	/**
	 * Отладочная функция для перемещения на указанную импульсную процедуру
	 * @param {string} impProcId		one of ImpPhase value
	 * @return {void}
	 * @throws {Error}	if dead loop
	 */
	goToImpProc(impProcId) {
		let guard = 100
		const svIdleBreak = this.bIdleBreak
		this.bIdleBreak = true
		while (guard > 0) {
			if (this.isImpulse() && this.impChart[this.curProc] === impProcId) {
				break
			}
			// console.log(this.curStepInfo())
			this.switchProc()
			if (this.actions.size > 0) {
				this.actions.clear()
			}
			this.nextStep()
			guard--
		}
		this.bIdleBreak = svIdleBreak
		if (!guard) {
			throw new Error('Dead loop in Game.goToImpProc')
		}
	}

	/**
	 * Создать акции для всех объектов, которые удовлетворяют указанному условию
	 * @param {Agent} agent агент
	 * @param {function(game:Game, ship:Counter):boolean} condition Условие
	 * @return {void}
	 */
	beginGlbActionIf(agent, condition) {
		Object.keys(this.objects).forEach(key => {
			const ship = this.objects[key]
			if (condition(this, ship)) {
				const action = agent.createAction({game: this, ship})
				if (action) {
					this.actions.set(ship.uid, action)
				}
			}
		})
	}

	/**
	 * Debug info about current step
	 * @return {string} turn, step, impulse and proc
	 */
	curStepInfo() {
		let stepInfo = `turn: ${this.curTurn}; turnStep: ${this.turnChart[this.turnStep]}`
		if (this.turnChart[this.turnStep] === TurnPhase.ImpulseProc) {
			stepInfo += `; imp: ${this.curImp}; impProc: ${this.impChart[this.curProc]}`
		}
		return stepInfo
	}
}

module.exports = {Game}
