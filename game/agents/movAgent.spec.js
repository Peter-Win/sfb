/**
 * Created by PeterWin on 15.12.2017.
 */
const {expect} = require('chai')
const {movAgent} = require('./movAgent')
const {Game} = require('../Game')
const {first} = require('../scenarios/first')
const {ActionState} = require('../agents/ActionState')
const {execAction} = require('../agents/AgentsMap')
const {ShipState} = require('../ships/SfbObject')

describe('movAgent', () => {
	it('createAction', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		const action = movAgent.createAction({game, ship})
		expect(action).to.be.ok
		expect(action.name).to.be.equal(movAgent.name)
		expect(action.state).to.be.equal(ActionState.Begin)
		expect(action.uid).to.be.equal('Con')
		expect(action.current).to.be.equal(0)
		expect(action.list).to.have.lengthOf(3)
		expect(action.list[0]).to.be.eql({x: 0, y: 8, dir: 0})
		expect(action.list[1]).to.be.eql({x: -1, y: 8, dir: 5})
		expect(action.list[2]).to.be.eql({x: 1, y: 8, dir: 1})
	})

	it('execAction', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		// first step
		{
			const action1 = movAgent.createAction({game, ship})
			execAction(game, action1)
			expect(ship.state).to.be.equal(ShipState.Active)
		}
		// second step
		{
			const action2 = movAgent.createAction({game, ship})
			action2.current = 1	// Повернуть влево и выйти за пределы карты
			execAction(game, action2)
			expect(ship.state).to.be.equal(ShipState.Lost)	// Выход за пределы карты
		}
	})
})
