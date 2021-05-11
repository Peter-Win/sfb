/**
 * Created by PeterWin on 15.02.2018.
 */
const {expect} = require('chai')
const {first, firstMod} = require('./first')
const {Game} = require('../Game')
const {DeviceState} = require('../devices/DeviceState')
const {Missile} = require('../ships/Missile')
const {CtrlStop} = require('../ctrls/CtrlStop')

describe('first scenario', () => {
	it('basic', () => {
		const game = new Game()
		game.create(first)
		const ship = game.getShip('Con')
		const photA = ship.getDevice('PhotA')
		expect(photA.state).to.be.equal(DeviceState.Disabled)
	})

	it('Klingon', () => {
		const game = new Game()
		const scenario = firstMod({race: 'Klingon'})
		expect(scenario).to.have.property('width', 14)
		game.create(scenario)
		expect(game.width).to.be.equal(14)
		const droneA = game.getShip('droneA')
		expect(droneA).to.be.instanceof(Missile)
		const ship = game.getShip('Con')
		expect(ship).to.be.ok
		expect(ship).to.have.property('speed', 8)
		expect(ship).to.have.property('name', 'Destruction')
		ship.ctrl = new CtrlStop()

		const droneRack = ship.getDevice('DRN')
		expect(droneRack).to.be.ok
		expect(droneRack.state).to.be.equal(DeviceState.Disabled)
		expect(droneRack.isCanFireTo(ship, droneA)).to.be.false

		game.idle()
		expect(droneRack.isCanFireTo(ship, droneA)).to.be.false
		expect(ship.buildLaunchTargets(game)).to.have.lengthOf(0)
	})
})
