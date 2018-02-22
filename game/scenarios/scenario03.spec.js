const {expect} = require('chai')
const {scenario03} = require('./scenario03')
const {Game} = require('../Game')

describe('scenario03', () => {
	it('common', () => {
		const game = new Game()
		game.create(scenario03)
		const ship = game.getShip('Main')
		expect(ship).to.have.property('name', 'Destruction')
		expect(ship.canChangeSpeed).to.be.true
	})
})
