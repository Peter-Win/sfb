/**
 * Проверка класса Game
 * Created by PeterWin on 12.12.2017.
 */
const {expect} = require('chai')
const {Game, GameState} = require('./Game')
const {first} = require('./scenarios/first')
const {ShipFCC} = require('./ships/ShipFCC')
const {ShipState} = require('./ships/SfbObject')
const {movAgent} = require('./agents/movAgent')

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

	it('toSimple', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		// с тестовой целью создать акцию
		game.addAction(movAgent.createAction({game, ship}))

		const simple = game.toSimple()
		expect(simple).to.have.property('turnLength', 8)
		expect(simple).to.have.property('width', 14)
		expect(simple).to.have.property('height', 16)
		expect(simple).to.have.property('state', GameState.Active)
		expect(simple).to.have.property('curTurn', 1)
		expect(simple).to.have.property('curImp', 0)
		expect(simple).to.have.property('curProc', 0)
		expect(simple).to.have.property('userSpeed', 0)
		expect(simple).to.have.property('actions')

		const {actions} = simple
		expect(actions).to.have.property('Con')
		expect(actions.Con).to.have.property('name', movAgent.name)
		expect(actions.Con).to.have.property('uid', 'Con')

		const {objects} = simple
		expect(objects).to.have.property('Con')
		expect(objects.Con).to.have.property('state', ShipState.Active)
		expect(objects.Con).to.have.property('x', 0)
	})
})
