const {expect} = require('chai')
const {launchAgent} = require('./launchAgent')
const {Game} = require('../Game')
const {scenario03} = require('../scenarios/scenario03')
const {DeviceState} = require('../devices/DeviceState')
const {DroneRack} = require('../devices/DroneRack')

describe('launchAgent', () => {
	it('synthetic test', () => {
		const game = new Game()
		game.create(scenario03())
		const ship = game.getShip('Main')

		// createAction
		const action = launchAgent.createAction({game, ship})
		expect(action).to.be.ok
		expect(action.points).to.have.lengthOf(4)
		expect(action.points[0]).to.have.property('targetId', 'freighterA')
		expect(action.points[1]).to.have.property('devId', 'DRN')

		// mergeAction
		launchAgent.mergeAction({result: {DRN: {targetId: 'freighterA', dir: 2}}}, action)
		expect(action.result).to.have.property('DRN')
		expect(action.result.DRN).to.have.property('targetId', 'freighterA')
		expect(action.result.DRN).to.have.property('dir', 2)

		// execAction
		launchAgent.execAction(game, action)
		const seekingId = Object.keys(game.objects).find(uid => {
			const unit = game.getShip(uid)
			return unit.isSeeking
		})
		expect(seekingId).to.be.ok
		const seeking = game.getShip(seekingId)
		expect(seeking).to.have.property('dir', 2)
		expect(seeking).to.have.property('targetId', 'freighterA')

		// Проверка пусковой установки
		const droneRack = ship.getDevice('DRN')
		expect(droneRack).to.be.instanceof(DroneRack)
		// console.log(JSON.stringify(droneRack.toSimple()))
		// console.log(JSON.stringify(droneRack))
		expect(droneRack.state).to.be.equal(DeviceState.Used)
		expect(droneRack.wait).to.be.equal(game.turnLength / 4)
		expect(droneRack.dronesCount).to.be.equal(3)
	})
})
