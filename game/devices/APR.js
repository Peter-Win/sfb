/*
 * REACTOR POWER: This is the amount of power from nuclear reactors.
 */
const {Device} = require('./Device')
const {DeviceIds} = require('./DeviceIds')
const {TurnPhase} = require('../TurnChart')

class APR extends Device {
	constructor(devId = DeviceIds.APR) {
		super(devId)
		this.fsm = aprFsm
	}
}

const aprFsm = Object.freeze({
	[Device.states.Begin]: {
		/**
		 * @param {{ship:Ship, dev: Device}} props *
		 * @return {void}
		 */
		[TurnPhase.BeginOfTurn]: props => {
			const {ship, dev} = props
			ship.energyPool.A += dev.hp
		},
	},
})

module.exports = {APR}
