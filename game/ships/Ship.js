/**
 * Корабль или объект с похожим поведением
 * Created by PeterWin on 09.12.2017.
 */
const {SfbObject} = require('./SfbObject')
const {TurnPhase} = require('../TurnChart')
const {Device} = require('../devices/Device')
const {PhaserCapacitor} = require('../devices/PhaserCapacitor')

class Ship extends SfbObject {
	constructor() {
		super()
		// warp, impulse, APR, btty
		this.energyPool = {W: 0, I: 0, A: 0, B: 0}
		this.moveCost = 1
		this.bFire = true
		this.lockOn = 1
		this.type = 'Ship'
		this.moveAction = 'MoveShips'
		this.squads = {}
		this.crewMin = 1	// minimum crew for moving ship
		this.crewHP = 0		// hit points, striked to crew/boarding parties
		this.armor = 0
		this.srcSide = 0	// Source side (side in begin of combat)

		// TODO: пока события не доделаны...
		this.fsm = {}
		this.fsm.All = {
			[TurnPhase.BeginOfTurn]: params => {
				const ep = this.energyPool
				ep.A = ep.B = ep.I = ep.W = 0
			},
		}

		this.devs = {
			PhCap: Device.create(PhaserCapacitor)
		}
	}

	/**
	 * @override
	 */
	init(description) {
		super.init(description)
	}

	/**
	 * Корабль может стрелять, если он в активном состоянии
	 * @override
	 */
	isCanFire(game) {
		return this.isActive()
	}
}

module.exports = {Ship}
