/**
 * Created by PeterWin on 03.12.2017.
 */

const {ImpChart} = require('./ImpChart')
const {TurnChart} = require('./TurnChart')
const {MovChart32} = require('./MovChart')
const {Side} = require('./Side')
const {SfbObject} = require('./ships/SfbObject')

const GameState = {
	Active: 'Active',
}

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
		this.impChart = []
		this.turnChart = []
		this.movChart = []
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
	 */
	create(scenario) {
		this.curTurn = 1
		this.curImp = 0
		this.curProc = 0
		this.uidGen = 0
		this.turnStep = 1
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
		this.objects = scenario.objects.reduce((map, objectData) => {
			const ship = SfbObject.create(objectData)
		}, {})
		Events.toGame(Events.BeginOfGame, this)
	}


}

module.exports = {Game}
