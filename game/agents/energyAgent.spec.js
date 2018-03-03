const {expect} = require('chai')
const {energyAgent} = require('./energyAgent')
const {Game} = require('../Game')
const {scenario04} = require('../scenarios/scenario04')
const {Events} = require('../Events')
const {TurnPhase} = require('../TurnChart')

describe('energyAgent', () => {
	it('createAction', () => {
		const game = new Game()
		game.create(scenario04())
		const ship = game.getShip('Main')
		Events.toShip({evid: TurnPhase.BeginOfTurn, game, ship})
		const action = energyAgent.createAction({game, ship})
		expect(action.name).to.be.equal(energyAgent.name)
		expect(action.uid).to.be.equal(ship.uid)
		expect(action.src).to.be.eql({W: 16, I: 2, A: 2, B: 2})
	})
})