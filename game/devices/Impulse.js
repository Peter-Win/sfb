/*
 * REACTOR POWER: This is the amount of power from nuclear reactors.
 */
const {Device} = require('./Device')
const {TurnPhase} = require('../TurnChart')

class Impulse extends Device {
	constructor(devId) {
		super(devId)
		this.fsm = impFsm
	}
}

const impFsm = Object.freeze({
	[Device.states.Begin]: {
		/**
		 * @param {{ship:Ship, dev: Device}} props *
		 * @return {void}
		 */
		[TurnPhase.BeginOfTurn]: props => {
			const {ship, dev} = props
			ship.energyPool.I += dev.hp
		},
	},
})

module.exports = {Impulse}
