/**
 * Проверка класса Game
 * Created by PeterWin on 12.12.2017.
 */
const {expect} = require('chai')
const {Game, GameState} = require('./Game')
const {first} = require('./scenarios/first')
const {ShipFCC} = require('./ships/ShipFCC')
const {ShipState} = require('./ships/SfbObject')

describe('Game', () => {
	it('create first scenario', () => {
		const game = new Game()
		game.create(first)

		expect(game.width).to.be.equal(14)
		expect(game.height).to.be.equal(16)
		expect(game.turnLength).to.be.equal(8)
		expect(game.state).to.be.equal(GameState.Active)

		const ship = game.objects.Con
		expect(ship).to.not.be.empty
		expect(ship).to.be.instanceOf(ShipFCC)
		expect(ship.x).to.be.equal(0)
		expect(ship.y).to.be.equal(9)
		expect(ship.state).to.be.equal(ShipState.Active)
	})
})
