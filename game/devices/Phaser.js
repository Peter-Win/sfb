/**
 * Created by PeterWin on 08.01.2018.
 */
const {Device} = require('./Device')
const {ImpPhase} = require('../ImpChart')
const {TurnPhase} = require('../TurnChart')

const phaserFsm = Object.freeze({
	All: {
		/**
		 * @param {Object} params	Parameters
		 * @param {Phaser} params.dev	this device
		 * @return {void}
		 */
		[ImpPhase.EndOfImp]: params => {
			params.dev.wait--	// decrease impulse counter
		},
		/**
		 * @param {{ship:Ship,dev:Phaser}} params	Parameters
		 * @return {void}
		 */
		onDestroy: params => {
			// decrease of ship phasers capasity
			ship.devs.PhCap.changeCapacity(-dev.ecost)
		},
	},
	Begin: {
		/**
		 * @param {{ship:Ship,dev:Phaser}} params		event parameters
		 * @return {void}
		 */
		CanFire(params) {
			const {dev, ship} = params
			if (dev.wait <= 0 && ship.devs.PhCap.energy >= dev.ecost) {
				params.ok = true
			}
		},
		/**
		 * @param {{game:Game, ship:Ship, dev:Phaser}} params	event parameters
		 * @return {void}
		 */
		FireEnd(params) {
			const {dev, ship, game} = params
			dev.wait = game.turnLength / 4
			dev.setState('Used')
			ship.devs.PhCap.energy -= dev.ecost
		},
	},
	Used: {
		/**
		 * @param {{dev:Phaser}} params		Event parameters
		 * @return {void}
		 */
		[TurnPhase.EndOfTurn]: params => {
			dev.setState('Begin')
		},
	},
})

class Phaser extends Device {
	constructor() {
		super()
		this.wait = 0
		this.ecost = 1
		this.fsm = phaserFsm
	}
}

module.exports = {Phaser}
