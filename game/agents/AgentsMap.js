/**
 * Created by PeterWin on 13.12.2017.
 */
const {movAgent} = require('./movAgent')

const AgentsMap = {}
AgentsMap[movAgent.name] = movAgent

module.exports = {AgentsMap}
