/**
 * Created by PeterWin on 15.02.2018.
 */
const {expect} = require('chai')
const {first, firstMod} = require('./first')
const {Game} = require('../Game')
const {DeviceState} = require('../devices/DeviceState')

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
		const ship = game.getShip('Des')
		expect(ship).to.be.ok
		expect(ship).to.have.property('speed', 8)
	})
})
