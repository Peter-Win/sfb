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

	/**
	 * Проверка акции на соответствие
	 * @param {Object} action	Action
	 * @param {string} action.name	Должно совпадать с именем агента
	 * @returns {void}
	 * @throws {Error}
	 */
	checkAction(action) {
		if (name !== this.name) {
			throw new Error(`Action "${name}" can not be executed by "${this.name}" agent`)
		}
	}
}

module.exports = {Agent}
