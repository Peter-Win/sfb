/**
 * Created by PeterWin on 14.01.2018.
 */
const {expect} = require('chai')
const {Ship} = require('./Ship')
const {Game} = require('../Game')
const {first} = require('../scenarios/first')
const {ImpPhase} = require('../ImpChart')
const {CtrlSimple} = require('../ctrls/CtrlSimple')
const {CtrlStop} = require('../ctrls/CtrlStop')
const {Sector} = require('../Sector')
const {DeviceIds} = require('../devices/DeviceIds')
const {movAgent} = require('../agents/movAgent')
const {fireAgent} = require('../agents/fireAgent')

describe('Ship', () => {
	it('buildEnemiesList', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		expect(ship).to.be.an.instanceof(Ship)
		const enemies = ship.buildEnemiesList(game)
		expect(enemies).to.have.lengthOf(5)	// 5 drones
		expect(enemies[0]).to.have.property('uid', 'droneA')
		expect(enemies[1]).to.have.property('uid', 'droneB')
		expect(enemies[2]).to.have.property('uid', 'droneC')
		expect(enemies[3]).to.have.property('uid', 'droneD')
		expect(enemies[4]).to.have.property('uid', 'droneE')
	})
	it('buildFireTargets', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		ship.devs[DeviceIds.PhCap].energy = 3
		const traces = ship.buildFireTargets(game)
		// console.log(JSON.stringify(traces))
		expect(traces.length).to.not.be.equal(0)
		// Вариантов может быть много. Но первый всегда будет такой: PH1 -> droneA
		const trace0 = traces[0]
		expect(trace0.devId).to.be.equal('PH1')
		expect(trace0.targetId).to.be.equal('droneA')
		expect(trace0.arcMap).to.be.equal(Sector.arc.FA)
		expect(trace0.pos).to.be.eql({x: 0, y: 10})
		expect(trace0.targetPos).to.be.eql({x: 0, y: 0})
	})
	it('turnModeCounter', () => {
		const game = new Game()
		game.create(first)
		const ship = game.getShip('Con')
		class CtrlTMC extends CtrlStop {
			onInfo(game, info) {
				if (info.type === 'move' && info.uid === 'Con') {
					// console.log(JSON.stringify(info))
				}
			}
		}
		ship.ctrl = new CtrlTMC()
		expect(ship.turnModeCounter).to.be.equal(0)

		game.idle()
		{
			const moveAction = game.actions.get(ship.uid)
			expect(moveAction).to.be.ok
			expect(moveAction.name).to.be.equal(movAgent.name)
			// Поворот направо задаётся actions.list[2]
			const choice = moveAction.list[2]
			expect(choice).to.have.property('x', 1)
			expect(choice).to.have.property('y', 9)
			expect(choice).to.have.property('dir', 1)
			// Повернуть
			moveAction.current = 2
			CtrlStop.closeAction(game, moveAction)
		}
		{
			expect(ship.getPosDir()).to.be.eql({x: 1, y: 9, dir: 1})
			// Здесь предполагается акция стрельбы. Она нам не нужна. Но импульс ещё не кончился.
			const fireAction = game.actions.get(ship.uid)
			expect(fireAction).to.be.ok
			expect(fireAction.name).to.be.equal(fireAgent.name)
			// И можно проверить turnModeCounter.
			// Он должен быть равен 1 (т.к. turnMode == 2, а после движения счетчик уменьшен)
			expect(ship.turnModeCounter).to.be.equal(1)
			CtrlStop.closeAction(game, fireAction)	// Идем дальше без стрельбы
		}
		{
			expect(game.curImp).to.be.equal(1)
			// И так как на импульсе #1 счетчик =1, поворачивать нельзя. А значит акция движения не генирируется
			// Значит здесь будет очередная акция стрельбы. И после перемещения счетчик уменьшается до 0
			const action1 = game.actions.get(ship.uid)
			expect(action1).to.have.property('name', fireAgent.name)
			expect(ship.turnModeCounter).to.be.equal(0)
			expect(ship.getPosDir()).to.be.eql({x: 2, y: 9, dir: 1})
			CtrlStop.closeAction(game, action1)	// Идем дальше без стрельбы
		}
		{
			// На втором импульсе снова возможен выбор направления
			expect(game.curImp).to.be.equal(2)
			const action2 = game.actions.get(ship.uid)
			expect(action2).to.have.property('name', movAgent.name)
		}
	})
})
