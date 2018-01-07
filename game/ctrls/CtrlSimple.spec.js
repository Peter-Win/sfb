/**
 * Created by PeterWin on 18.12.2017.
 */
const {expect} = require('chai')
const {CtrlSimple} = require('./CtrlSimple')
const {Game} = require('../Game')
const {GameState} = require('../GameState')
const {first} = require('../scenarios/first')
const {movAgent} = require('../agents/movAgent')
const {ActionState} = require('../agents/ActionState')

describe('CtrlSimple', () => {
	it('Interaction of Simple controller with Game', () => {
		game = new Game()
		game.create(first)
		const ship = game.objects.Con
		ship.ctrl = new CtrlSimple()
		const expectedY = ship.y - 1
		const action = movAgent.createAction({game, ship})
		game.addAction(action)

		return new Promise((resolve, reject) => {
			game.onceStepEnd(() => {
				expect(action.state, ActionState.End)
				expect(ship.y).to.be.equal(expectedY)
				game.setState(GameState.End) // прекратить игру, чтобы избежать зацикливания
				resolve()
			})
			game.sendActions()
		})
	})
})
