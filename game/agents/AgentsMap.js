/**
 * Created by PeterWin on 13.12.2017.
 */
const assert = require('assert')
const {movAgent} = require('./movAgent')
const {fireAgent} = require('./fireAgent')

/**
 * @type {Object<string,Agent>}
 */
const AgentsMap = {}
AgentsMap[movAgent.name] = movAgent
AgentsMap[fireAgent.name] = fireAgent

/**
 * Поиск агента для акции
 * @param {{name:string}} action	Action object
 * @return {Agent}	found agent
 * @throws {Error}	if invalid agent name
 */
const findAgent = (action) => {
	const agent = AgentsMap[action.name]
	if (!agent) {
		throw new Error(`Invalid agent name ${action.name}`)
	}
	return agent
}

/**
 * Выполнить акцию. Происходит поиск подходящего агента
 * @param {Game} game	main game object
 * @param {Object} action	Action object
 * @param {string} action.name	agent name
 * @returns {void}
 * @throws {Error}
 */
const execAction = (game, action) => {
	assert(game, 'Undefined game object')
	const agent = findAgent(action)
	agent.execAction(game, action)
}

/**
 * Принять акцию из внешнего источника.
 * Теоретически, клиент может прислать только те поля акции, которые можно менять.
 * Практически, по соображениям безопасности сервер не должен принимать любые полученные данные, а только разрешенные.
 * @param {Game} game	Main game object
 * @param {{uid:string}} alienAction	Акция, полученная с клиента
 * @return {void}
 */
const mergeAction = (game, alienAction) => {
	assert(game, 'Undefined game object')
	const nativeAction = game.actions.get(alienAction.uid)
	if (nativeAction) {
		const agent = findAgent(nativeAction)
		agent.mergeAction(alienAction, nativeAction)
	}
}

module.exports = {AgentsMap, execAction, mergeAction, findAgent}
