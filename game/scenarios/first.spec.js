/**
 * Created by PeterWin on 15.02.2018.
 */
const {expect} = require('chai')
const {first} = require('./first')
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
})
