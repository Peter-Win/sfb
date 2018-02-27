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

	/**
	 * @param {Game} game *
	 * @param {{uid:string}} action *
	 * @return {Counter}	owner ship for action
	 */
	getShip(game, action) {
		return game.getShip(action.uid)
	}

	/**
	 * Создание возможных вариантов перемещения для указанного корабля
	 * @param {Object} params	Parameters
	 * @param {Game} params.game	main game object
	 * @param {Counter} params.ship	ship object
	 * @return {Object|null} possible action object
	 */
	createAction(params) {
		throw new Error('Abstract method Agent.createAction')
	}

	/**
	 * Выполнить акцию, которая уже обработана
	 * @param {Game} game	Main game object
	 * @param {Object<{name,uid:string}>} action *
	 * @return {void}
	 */
	execAction(game, action) {
		throw new Error('Abstract method Agent.execAction')
	}

	/**
	 * Акция, поступившая с клиента должна быть правильно обработана
	 * Например, для акции Move есть список возможных позиций. Но от клиента нельзя его принять.
	 * Иначе читеры смогут присылать некорректные позиции, а корабль сможет перемещаться куда угодно.
	 * То есть, с клиента можно принять только номер выбранного варианта
	 * _Результатом функции_ является перенос нужных полей из alienAction в nativeAction
	 * @param {Object} alienAction	[in] акция, поступившая с клиента
	 * @param {Object} nativeAction	[in/out] акция из списка game.actions
	 * @return {void}
	 * @abstract
	 */
	mergeAction(alienAction, nativeAction) {
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

	/**
	 * Перевести акцию в конечное состояние
	 * @param {Game} game	main game object
	 * @param {{uid:string}} action		Action
	 * @return {void}
	 */
	static closeAction(game, action) {
		const oldAction = game.actions.get(action.uid)
		if (oldAction) {
			oldAction.state = ActionState.End
		}
	}
}

module.exports = {Agent}
