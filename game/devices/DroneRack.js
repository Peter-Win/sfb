/**
 * (FD1.1) DRONE LAUNCHERS
 * Drones are carried in drone racks which carry four drones
 * and can launch one of them each turn (not within 1/4-turn of a
 * launch by that specific rack on the previous turn).
 */
const {Device} = require('./Device')
const {DeviceState} = require('./DeviceState')
const {ImpPhase} = require('../ImpChart')
const {TurnPhase} = require('../TurnChart')
const {CounterType} = require('../ships/CounterType')
const {Missile} = require('../ships/Missile')
const {CtrlSeeking} = require('../ctrls/CtrlSeeking')

class DroneRack extends Device {
	constructor(devId) {
		super(devId)
		this.wait = 0
		this.dronesCount = 4
		this.fsm = droneRackFsm
		this.setState(DeviceState.Ready)
	}
	toSimple() {
		const result = super.toSimple()
		result.dronesCount = this.dronesCount
		return result
	}

	/**
	 * @override
	 */
	isValidTarget(ship, target) {
		return target.type !== CounterType.PlasmaTorpedo
	}

	/**
	 * @param {Game} game *
	 * @param {Ship} ship *
	 * @param {string} targetId
	 * @param {number} dir
	 * @return {Counter} seeking weapon unit
	 */
	launch(game, ship, targetId, dir) {
		this.setState(DeviceState.Used)
		this.dronesCount--
		this.wait = game.turnLength / 4

		const seeking = new Missile()
		seeking.init({x: ship.x, y: ship.y, dir, targetId, ctrl: CtrlSeeking})
		game.insertShip(seeking)
		// console.log('Launch: ', JSON.stringify(seeking.toSimple()))
		return seeking
	}
}

const droneRackFsm = Object.freeze({
	All: {
		[ImpPhase.EndOfImp]: params => {
			params.dev.wait--
		},
	},
	[DeviceState.Ready]: {
		// Стрелять можно из активного состояния, если остались дроны
		// и после последнего выстрела прошло 1/4 хода
		CanLaunch: params => {
			const {dev, devList} = params
			if (dev.wait <= 0 && dev.dronesCount > 0) {
				devList.push(dev)
			}
		},
	},
	[DeviceState.Used]: {
		[TurnPhase.BeginOfTurn]: params => {
			params.dev.setState(DeviceState.Ready)
		},
	},
})

module.exports = {DroneRack}
