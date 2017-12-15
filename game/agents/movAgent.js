/**
 * Created by PeterWin on 13.12.2017.
 */
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
	 * @param {SfbObject} params.ship	ship object
	 * @return {Object|null} possible action object
	 */
	createAction(params) {
		const {ship} = params
		const bCanRotate = ship.ctrls.isCanChangeDir(params.game)
		const {dir} = ship
		if (bCanRotate) {
			const action = this.newActionObject()
			action.uid = ship.uid
			action.list = [
				Hex.nearPos[dir](ship),
				Hex.nearPos[Hex.normalDir(dir - 1)](ship),
				Hex.nearPos[Hex.normalDir(dir + 1)](ship),
			]
			action.current = 0
			return action
		}
		return null
	}
}

const movAgent = new MovAgent()

module.exports = {movAgent}
