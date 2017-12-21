/**
 * Created by PeterWin on 13.12.2017.
 */
const {movAgent} = require('./movAgent')

/**
 * @type {Object<string,Agent>}
 */
const AgentsMap = {}
AgentsMap[movAgent.name] = movAgent

/**
 * Выполнить акцию. Происходит поиск подходящего агента
 * @param {Game} game	main game object
 * @param {Object} action	Action object
 * @param {string} action.name	agent name
 * @returns {void}
 * @throws {Error}
 */
const execAction = (game, action) => {
	const agent = AgentsMap[action.name]
	if (!agent) {
		throw new Error(`Invalid agent name ${action.name}`)
	}
	agent.execAction(game, action)
}

module.exports = {AgentsMap, execAction}
