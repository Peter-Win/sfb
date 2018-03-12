const {expect} = require('chai')
const {scenario04} = require('./scenario04')
const {Game} = require('../Game')

describe('scenario04', () => {
	it('standard', () => {
		const game = new Game()
		game.create(scenario04())
		expect(game.sides).to.have.lengthOf(3)
		const ship = game.getShip('Main')
		expect(ship).to.be.ok
		expect(ship.name).to.be.equal('Constellation')
	})
	it('enemy check', () => {
		const game = new Game()
		game.create(scenario04())
		expect(game.isEnemy(0, 0)).to.be.false
		expect(game.isEnemy(0, 1)).to.be.true
		expect(game.isEnemy(0, 2)).to.be.false
		expect(game.isEnemy(1, 0)).to.be.true
		expect(game.isEnemy(1, 1)).to.be.false
		expect(game.isEnemy(1, 2)).to.be.false
	})
})
