
const {Agent} = require('./Agent')

class SpeedAgent extends Agent {
	constructor() {
		super('SpeedDeterm')
	}

	/**
	 * @override
	 */
	createAction(params) {
		const {ship} = params
		const action = this.newActionObject(ship.uid)
		action.maxSpeed = 8	// TODO: need calc
		action.speed = ship.speed
		return action
	}
	mergeAction(alienAction, nativeAction) {
		nativeAction.speed = alienAction.speed
	}
	execAction(game, action) {
		const ship = game.getShip(action.uid)
		ship.speed = action.speed
	}

}

const speedAgent = new SpeedAgent()

module.exports = {speedAgent}
