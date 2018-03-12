const {Agent} = require('./Agent')
const {Energy} = require('../utils/Energy')

class EnergyAgent extends Agent {
	constructor() {
		super('Energy')
	}
	/**
	 * Создание акции
	 * @override
	 */
	createAction(params) {
		const {game, ship} = params
		const action = this.newActionObject(ship.uid)
		action.src = ship.energyPool
		const devices = Energy.getDevices(ship)
		action.dst = devices.map(device => ({
			id: device.devId,
			lim: device.energyLim,
			prior: device.eTypePrior,
		}))
		return action
	}
}

const energyAgent = new EnergyAgent()

module.exports = {energyAgent}
