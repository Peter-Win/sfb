/**
 * Created by PeterWin on 13.12.2017.
 */
const {ActionState} = require('./ActionState')

class Agent {
	constructor(name) {
		this.name = name
	}

	newActionObject() {
		return {name: this.name, state: ActionState.Begin}
	}
}

module.exports = {Agent}
