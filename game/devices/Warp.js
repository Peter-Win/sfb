/**
 * Created by PeterWin on 15.02.2018.
 */
const {Device} = require('./Device')
const {TurnPhase} = require('../TurnChart')

class Warp extends Device {
	constructor(devId) {
		super(devId)
		this.fsm = warpFsm
	}
}

const warpFsm = Object.freeze({
	[Device.states.Begin]: {
		/**
		 * @param {{ship:Ship, dev: Device}} props *
		 * @return {void}
		 */
		[TurnPhase.BeginOfTurn]: props => {
			const {ship, dev} = props
			ship.energyPool.W += dev.hp
		},
	},
})

module.exports = {Warp}
