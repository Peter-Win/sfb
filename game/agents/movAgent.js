/**
 * Created by PeterWin on 13.12.2017.
 */
const assert = require('assert')
const {Agent} = require('./Agent')
const {Hex} = require('../Hex')
const {ActionState} = require('../agents/ActionState')

class MovAgent extends Agent {
	constructor() {
		super('Move')
	}

	/**
	 * Создание возможных вариантов перемещения для указанного корабля
	 * @param {Object} params	Parameters
	 * @param {Game} params.game	main game object
	 * @param {Counter} params.ship	ship object
	 * @return {Object|null} possible action object
	 */
	createAction(params) {
		const {ship} = params
		const {dir} = ship
		const action = this.newActionObject(ship.uid)
		const canRotate = ship.isCanRotate()
		const deltaDir = canRotate ? [0, -1, 1] : [0]
		action.list = deltaDir.map(phi => {
			const curDir = Hex.normalDir(dir + phi)
			const pos = Hex.nearPos[curDir](ship)
			pos.dir = curDir
			return pos
		})
		action.current = 0
		if (!canRotate) {
			// Если невозможно поворачивать, то движение вперёд без обращения к контроллеру
			action.state = ActionState.End
		}
		return action
	}

	/**
	 * @override
	 */
	mergeAction(alienAction, nativeAction) {
		// Единственное поле, которое может изменить пользователь - current
		nativeAction.current = alienAction.current
	}

	/**
	 * Выполнить акцию
	 * @param {Game} game	main game object
	 * @param {Object} action	Action
	 * @param {string} action.name	Должно совпадать с именем агента
	 * @param {string} action.state Предполагается ActionState.End
	 * @param {{x,y,dir: number}[]} action.list	Список вариантов
	 * @param {number} action.current	Выбор, сделанный контроллером
	 * @returns {void}
	 */
	execAction(game, action) {
		assert(game, 'Invalid game object')
		this.checkAction(action)
		assert(action.current >=0 && action.current < action.list.length, `Invalid current index = ${action.current}`)
		const pos = action.list[action.current]
		const ship = game.getShip(action.uid)
		if (ship.dir !== pos.dir) {
			// Выполнен поворот. Необходимо установить счетчик
			ship.turnModeCounter = ship.getTurnMode()
		}
		const oldPos = ship.getPosDir()
		ship.setPos(pos.x, pos.y, pos.dir)
		// После каждого перемещения уменьшается turnModeCounter
		ship.turnModeCounter--
		ship.updateState(game)
		game.sendInfo({type: 'move', uid: ship.uid, from: oldPos, to: pos})
	}
}

const movAgent = new MovAgent()
movAgent.Center = 0
movAgent.Left = 1
movAgent.Right = 2

module.exports = {movAgent}
