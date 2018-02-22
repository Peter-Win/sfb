const {expect} = require('chai')
const {CtrlFreighterSimple} = require('./CtrlFreighterSimple')
const {Game} = require('../Game')
const {scenario03} = require('../scenarios/scenario03')
const {fireAgent} = require('../agents/fireAgent')
const {ImpPhase} = require('../ImpChart')
const {DeviceIds} = require('../devices/DeviceIds')
const {CtrlSimple} = require('./CtrlSimple')
const {Missile} = require('../ships/Missile')

describe('CtrlFreighterSimple', () => {
	it('selectTarget', () => {
		const game = new Game()
		game.create(scenario03)
		const ctrl = new CtrlFreighterSimple({enemySide: 0})
		const enemy = game.getShip('Main')
		enemy.ctrl = new CtrlSimple()
		const freighterA = game.getShip('freighterA')
		const phaser = freighterA.getDevice('PH')
		game.goToImpProc(ImpPhase.BeginOfImp)

		// проверки
		{
			expect(game.isImpulse()).to.be.true
			const enemies = freighterA.buildEnemiesList(game)
			// console.log(JSON.stringify(traces))
			expect(enemies).to.have.lengthOf(1)
			expect(enemies[0]).to.have.property('uid', 'Main')

			expect(phaser.isValidTarget(freighterA, enemies[0])).to.be.true
			const phCap = freighterA.getDevice(DeviceIds.PhCap)
			expect(phCap).to.be.ok
			expect(phCap).to.have.property('energy', 1)

			const traces = freighterA.buildFireTargets(game)
			expect(traces).to.have.lengthOf(1)
			expect(traces[0]).to.have.property('targetId', 'Main')
		}

		// В качестве цели - вражеский корабль
		{
			const action = fireAgent.createAction({game, ship: freighterA})
			expect(action.traces).to.have.lengthOf(1)
			ctrl.selectTarget(game, action)
			expect(action.choices).to.be.eql([0])
		}
		// Добавим ракету, но не направленную на freighterA
		const missile1 = new Missile()
		missile1.uid = 'missile1'
		missile1.side = enemy.side
		missile1.setPos(0, 7, 3)	// Ракета ближе, чем корабль
		game.insertShip(missile1)
		{
			const action = fireAgent.createAction({game, ship: freighterA})
			expect(action.traces).to.have.lengthOf(2)
			ctrl.selectTarget(game, action)
			expect(action.traces[action.choices[0]].targetId).to.be.equal('missile1')
		}
		// Теперь слелаем корабль ближе, чем ракету
		enemy.setPos(0, 8)
		{
			const action = fireAgent.createAction({game, ship: freighterA})
			expect(action.traces).to.have.lengthOf(2)
			ctrl.selectTarget(game, action)
			expect(action.traces[action.choices[0]].targetId).to.be.equal('Main')
		}
		// Теперь нацелим ракету на freighterA
		missile1.target = freighterA.uid
		{
			const action = fireAgent.createAction({game, ship: freighterA})
			expect(action.traces).to.have.lengthOf(2)
			ctrl.selectTarget(game, action)
			expect(action.traces[action.choices[0]].targetId).to.be.equal('missile1')
		}
	})
})
