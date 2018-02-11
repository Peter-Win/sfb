/**
 * Created by PeterWin on 15.12.2017.
 */
const {expect} = require('chai')
const {movAgent} = require('./movAgent')
const {fireAgent} = require('./fireAgent')
const {Game} = require('../Game')
const {GameState} = require('../GameState')
const {first} = require('../scenarios/first')
const {ActionState} = require('../agents/ActionState')
const {execAction} = require('../agents/AgentsMap')
const {ShipState} = require('../ships/Counter')
const {CtrlStop} = require('../ctrls/CtrlStop')

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
		expect(action.list[0]).to.be.eql({x: 0, y: 9, dir: 0})
		expect(action.list[1]).to.be.eql({x: -1, y: 9, dir: 5})
		expect(action.list[2]).to.be.eql({x: 1, y: 9, dir: 1})

		const {droneA} = game.objects
		const actionA = movAgent.createAction({game, ship: droneA})
		expect(actionA).to.be.ok
		expect(actionA.uid).to.be.equal('droneA')
	})

	it('mergeAction', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		const action = movAgent.createAction({game, ship})
		const x0 = action.list[0].x
		const y0 = action.list[0].y
		// позитивный сценарий
		movAgent.mergeAction({current:2}, action)
		expect(action).to.have.property('current', 2)
		// Попытка подсунуть ложный список
		movAgent.mergeAction({list:[{x: 999, y: 999}], current: 0}, action)
		expect(action).to.have.property('current', 0)	// Это поле применяется
		expect(action.list[0].x).to.be.equal(x0)	// А эти данные меняться не должны
		expect(action.list[0].y).to.be.equal(y0)
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
	// Правильность обработки автоматического хода в случае поворота с turnMode > 1
	it('Turn mode process', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		ship.ctrl = new CtrlStop()
		game.idle()
		// Шаг на импульсе 0
		{
			expect(game.state).to.be.equal(GameState.Active)
			const action = game.actions.get(ship.uid)
			expect(game.isImpulse()).to.be.true
			expect(game.curImp).to.be.equal(0)
			expect(action).to.be.ok
			expect(action.name).to.be.equal(movAgent.name)
			// Выполнить поворот направо, чтобы на следующем импульсе не иметь возможности выбора
			action.current = movAgent.Right
			game.onActionIncome(action)
		}
		// Процедура стрельбы на импульсе 0 (игнорируем)
		{
			expect(game.state).to.be.equal(GameState.Active)
			const action = game.actions.get(ship.uid)
			expect(game.isImpulse()).to.be.true
			expect(game.curImp).to.be.equal(0)
			expect(action).to.be.ok
			expect(action.name).to.be.equal(fireAgent.name)
			game.onActionIncome(action)
		}
		// Следующая акция - стрельба на импульсе 1. Потому что выбор направления отсутствует
		{
			expect(game.state).to.be.equal(GameState.Active)
			const action = game.actions.get(ship.uid)
			expect(game.isImpulse()).to.be.true
			expect(game.curImp).to.be.equal(1)
			expect(action).to.be.ok
			expect(action.name).to.be.equal(fireAgent.name)
			game.onActionIncome(action)
		}
	})
})
