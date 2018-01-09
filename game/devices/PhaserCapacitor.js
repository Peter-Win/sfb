/**
 * (H6.0) PHASER CAPACITORS
 * Created by PeterWin on 08.01.2018.
 */
const {Device} = require('./Device')
const {TurnPhase} = require('../TurnChart')

const phCapFsm = Object.freeze({
	All: {
		/**
		 * @param {{dev:PhaserCapacitor}} params	Event parameters
		 * @return {void}
		 */
		[TurnPhase.BeginOfTurn]: params => {
			const {dev} = params
			dev.energyLim = `*${dev.capacity - dev.energy}`
		},
		/**
		 * @param {{dev:PhaserCapacitor}} params	Event parameters
		 * @return {void}
		 */
		[TurnPhase.OnEnergyAlloc]: params => {
			const {dev} = params
			dev.energy = Math.min(dev.energyIn, dev.capacity)
			dev.energyIn = 0
		},
	},
})

class PhaserCapacitor extends Device {
	constructor() {
		super()
		this.name = 'Phaser Capacitors'
		this.capacity = 0
		this.energy = 0
		this.hp = 0
		this.energyIn = 0
		this.energyLim = '*0'
		this.eAllocPrior = '09'
		this.eTypePrior = 'AIWB'
		this.fsm = phCapFsm
	}
	changeCapacity(delta) {
		this.capacity += delta
		this.energy = Math.min(this.energy, this.capacity)
	}
}
module.exports = {PhaserCapacitor}
