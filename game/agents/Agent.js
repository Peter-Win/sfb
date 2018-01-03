/**
 * Created by PeterWin on 13.12.2017.
 */
const {ActionState} = require('./ActionState')

class Agent {
	constructor(name) {
		this.name = name
	}

	/**
	 * Создать объект акции
	 * @param {string} uid	Идентификатор корабля
	 * @return {{name: string, state: string, uid: string}} Акция
	 */
	newActionObject(uid) {
		if (!uid) {
			throw new Error(`Cant create action without uid in agent ${this.name}`)
		}
		return {name: this.name, state: ActionState.Begin, uid}
	}

	createAction(params) {
		throw new Error('Abstract method Agent.createAction')
	}

	execAction(game, action) {
		throw new Error('Abstract method Agent.execAction')
	}

	/**
	 * Проверка акции на соответствие
	 * @param {Object} action	Action
	 * @param {string} action.name	Должно совпадать с именем агента
	 * @returns {void}
	 * @throws {Error}
	 */
	checkAction(action) {
		if (action.name !== this.name) {
			throw new Error(`Action "${action.name}" can not be executed by "${this.name}" agent`)
		}
	}
}

module.exports = {Agent}
