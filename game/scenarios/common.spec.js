const {expect} = require('chai')
const {isMainShipLost} = require('./common')
const {Game} = require('../Game')
const {first} = require('./first')
const {ShipState} = require('../ships/Counter')
const {GameState} = require('../GameState')
const {Side} = require('../Side')

describe('Common scenario utilites', () => {
	it('isMainShipLost', () => {
		const game = new Game()
		game.create(first)
		const ship = game.getShip('Con')
		expect(isMainShipLost(game, ship, 1)).to.be.false
		ship.setState(ShipState.Lost)
		expect(game.state).to.be.equal(GameState.Active)
		expect(isMainShipLost(game, ship, 1)).to.be.true
		expect(game.state).to.be.equal(GameState.End)
		expect(game.sides[0].state).to.be.equal(Side.states.Loser)
		expect(game.sides[1].state).to.be.equal(Side.states.Winner)
		expect(game.reasonMessage.text).to.be.equal('{name} left the map')
		expect(game.reasonMessage.params).to.be.eql({name: 'Constellation'})
	})
})
