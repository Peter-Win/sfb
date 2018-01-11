/**
 * Created by PeterWin on 13.12.2017.
 */
const assert = require('assert')
const {Agent} = require('./Agent')
const {Hex} = require('../Hex')

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
		const bCanRotate = ship.handlers.isCanChangeDir(params.game)
		if (bCanRotate) {
			const {dir} = ship
			const action = this.newActionObject(ship.uid)
			action.list = [0, -1, 1].map(phi => {
				const curDir = Hex.normalDir(dir + phi)
				const pos = Hex.nearPos[curDir](ship)
				pos.dir = curDir
				return pos
			})
			action.current = 0
			return action
		}
		return null
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
		const pos = action.list[action.current]
		const ship = game.getShip(action.uid)
		ship.setPos(pos.x, pos.y, pos.dir)
		ship.updateState(game)
	}
}

const movAgent = new MovAgent()

module.exports = {movAgent}
