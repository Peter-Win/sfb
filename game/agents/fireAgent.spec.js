/**
 * Created by PeterWin on 14.01.2018.
 */
const {expect} = require('chai')
const {fireAgent} = require('./fireAgent')
const {Game} = require('../Game')
const {first} = require('../scenarios/first')
const {Ship} = require('../ships/Ship')
const {Phaser} = require('../devices/Phaser')
const {Missile} = require('../ships/Missile')
const {FiringArc} = require('../utils/FiringArc')
const {Events} = require('../Events')
const {ImpPhase} = require('../ImpChart')
const {ImpEvents} = require('../ImpEvents')
const {TurnPhase} = require('../TurnChart')
const {CtrlBase} = require('../ctrls/CtrlBase')
const {ActionState} = require('../agents/ActionState')

describe('fireAgent', () => {
	it('createTrace', () => {
		const game = new Game()
		game.create(first)
		/**
		 * @type {Ship}
		 */
		const ship = game.objects.Con
		expect(ship).to.be.an.instanceof(Ship)
		const dev = ship.devs.PH1
		expect(dev).to.be.an.instanceof(Phaser)
		const target = game.objects.droneB
		expect(target).to.be.an.instanceof(Missile)
		// Проверка расстояния до цели
		expect(ship.distanceTo(target)).to.be.equal(4)
		const trace = fireAgent.createTrace({game, ship, dev, target})
		expect(trace).to.be.ok
		// Общая инфа
		expect(trace).to.have.property('devId', 'PH1')
		expect(trace).to.have.property('arcMap', FiringArc.arc.FA)
		expect(trace).to.have.property('arc0', 'FA')
		expect(trace.pos).to.be.eql({x: 0, y: 10})
		expect(trace).to.have.property('targetId', 'droneB')
		expect(trace.targetPos).to.be.eql({x: 1, y: 6})
		// Инфа специфичная для фазера
		expect(trace).to.have.property('phaserEnergy', 1)
		expect(trace.damages).to.be.eql([5, 5, 4, 4, 3, 2])
	})

	it('Action generator', () => {
		const game = new Game()
		game.create(first)
		Events.toGame(TurnPhase.AutoEAlloc, game)
		Events.toGame(TurnPhase.OnEnergyAlloc, game)
		expect(game.objects.Con.devs.PhCap.energy).to.be.equal(3)
		ImpEvents[ImpPhase.FireDirect](game)
		expect(game.actions.size).to.be.equal(1)
	})

	it('mergeAction', () => {
		const nativeAction = {}
		fireAgent.mergeAction({uid: 'abc', traces:[], choices: [1, 5]}, nativeAction)
		expect(nativeAction).to.be.eql({choices: [1, 5]})
	})

	it('checkFireAction', () => {
		const game = new Game()
		game.create(first)
		const ship = game.getShip('Con')
		const tracesOk = [
			{devId: 'PH1', targetId: 'droneA', phaserEnergy: 1},
			{devId: 'PH2', targetId: 'droneA', phaserEnergy: 1},
			{devId: 'PH3', targetId: 'droneB', phaserEnergy: 1},
		]
		expect(fireAgent.checkFireAction(game, ship, tracesOk)).to.be.true

		// PH1 can not be used twice
		const tracesInv1 = [
			{devId: 'PH1', targetId: 'droneA', phaserEnergy: 1},
			{devId: 'PH2', targetId: 'droneA', phaserEnergy: 1},
			{devId: 'PH1', targetId: 'droneB', phaserEnergy: 1},
		]
		expect(fireAgent.checkFireAction(game, ship, tracesInv1)).to.be.false
	})

	it('Action exec', () => {
		const game = new Game()
		game.create(first)
		game.objects.Con.ctrl = new CtrlFireTest()
		game.goToImpProc(ImpPhase.FireDirect)
		game.idle()
		expect(game.impChart[game.curProc]).to.be.equal(ImpPhase.FireDirect)
		expect(game.actions.size).to.be.equal(1)	// Одна акция для стрельбы
		const action = game.actions.get('Con')
		expect(action).to.be.ok
		expect(action.traces).to.be.instanceof(Array)
		// Будем стрелять из PH1 по droneB. Расстояние для стрельбы = 4, среднее повреждение 3.8
		// Для поражения дрона нужно 4 ед. Только в 4 случаях из 6 выстрел уничтожит дрон.
		const traceIndex = action.traces.findIndex(t => t.devId === 'PH1' && t.targetId === 'droneB')
		const trace = action.traces[traceIndex]
		expect(trace).to.be.ok
		expect(trace).to.have.property('devId', 'PH1')
		expect(trace).to.have.property('targetId', 'droneB')
		// emulate client fire
		action.choices = [traceIndex]
		action.state = ActionState.End
		game.fires.length = 0
		fireAgent.execAction(game, action)
		// Дожен появиться запрос на выстрел
		expect(game.fires).to.have.lengthOf(1)
		const fireItem = game.fires[0]
		expect(fireItem).to.have.property('uid', 'Con')
		expect(fireItem).to.have.property('traces')
		expect(fireItem.traces).to.have.lengthOf(1)
		expect(fireItem.traces[0]).to.have.property('devId', 'PH1')
		expect(fireItem.traces[0]).to.have.property('targetId', 'droneB')
	})
})

class CtrlFireTest extends CtrlBase {
	onAction(game, action) {
		if (action.name !== fireAgent.name) {
			action.state = ActionState.End
			game.receiveActions()
		}
	}
}

