/**
 * Created by PeterWin on 14.01.2018.
 */
const {expect} = require('chai')
const {DeviceIds} = require('./DeviceIds')
const {DeviceState} = require('./DeviceState')
const {Phaser} = require('./Phaser')
const {Game} = require('../Game')
const {first} = require('../scenarios/first')
const {Events} = require('../Events')
const {TurnPhase} = require('../TurnChart')
const {ImpPhase} = require('../ImpChart')
const {CtrlBase} = require('../ctrls/CtrlBase')
const {ActionState} = require('../agents/ActionState')
const {ShipState} = require('../ships/Counter')

describe('Phaser', () => {
	it('isValidTarget', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		expect(ship).to.be.ok
		const phaser = ship.devs.PH1
		expect(phaser).to.be.an.instanceof(Phaser)
		expect(phaser.arc).to.be.equal('FA')
		const {droneA, droneD} = game.objects
		// В исходном положении 0 фазер PH1 не захватывает только droneD
		expect(phaser.isValidTarget(ship, droneA)).to.be.true
		expect(phaser.isValidTarget(ship, droneD)).to.be.false
		// Повернуть корабль в направлении 1. В этом случае видны оба дрона
		ship.dir = 1
		expect(phaser.isValidTarget(ship, droneA)).to.be.true
		expect(phaser.isValidTarget(ship, droneD)).to.be.true
		// В положении 2 дрон А не виден
		ship.dir = 2
		expect(phaser.isValidTarget(ship, droneA)).to.be.false
		expect(phaser.isValidTarget(ship, droneD)).to.be.true
	})
	it('CanFire', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		const phCap = ship.devs[DeviceIds.PhCap]
		const dev = ship.devs.PH1

		Events.toGame(TurnPhase.BeginOfTurn, game)
		expect(phCap.energyLim).to.be.equal('*3')
		Events.toGame(TurnPhase.AutoEAlloc, game)
		expect(phCap.energyIn).to.be.equal(3)
		Events.toGame(TurnPhase.OnEnergyAlloc, game)
		expect(phCap.capacity).to.be.equal(3)
		expect(phCap.energy).to.be.equal(3)
		const params = {evid: 'CanFire', game, ship, dev, devList: []}
		Events.toDevice(params)
		const {devList} = params
		expect(devList).to.have.lengthOf(1)
	})
	it('checkFireTraces', () => {
		const game = new Game()
		game.create(first)
		const ship = game.getShip('Con')
		/**
		 * @type {Phaser}
		 */
		const phaser = ship.getDevice('PH1')

		// invalid list - PH1 can not be used two times
		const traces1 = [
			{devId: 'PH1', targetId: 'droneA', phaserEnergy: 1},
			{devId: 'PH1', targetId: 'droneB', phaserEnergy: 1},
		]
		expect(phaser.checkFireTraces(game, ship, traces1, 0)).to.be.false

		// good list - разные орудия могут стрелять в одну цель
		const traces2 = [
			{devId: 'PH1', targetId: 'droneA', phaserEnergy: 1},
			{devId: 'PH2', targetId: 'droneA', phaserEnergy: 1},
		]
		expect(phaser.checkFireTraces(game, ship, traces2, 0)).to.be.true
	})

	it('fire only once per turn', () => {
		const game = new Game()
		game.create(first)
		const ship = game.getShip('Con')
		ship.dir = 1
		const phaser = ship.getDevice('PH1')
		class CtrlSpecial extends CtrlBase {
			onAction(game, action) {
				// console.log('onAction: ', JSON.stringify(action))
				if (action.name !== 'Fire') {
					action.state = ActionState.End
					game.receiveActions()
				}
			}
			onInfo(game, info) {
				// console.log('onInfo: ', JSON.stringify(info))
			}
			onStep(game) {
				// На всех импульсах, кроме первого, фазер должен быть использован
				// console.log('onStep: ', game.curStepInfo(), ', actions: ', JSON.stringify(game.actions))
				if (game.isImpulse()) {
					expect(ship.isCanFire(game)).to.be.true
					if (game.curImp > 0) {
						expect(phaser.state).to.be.equal(DeviceState.Used)
					} else if (game.impChart[game.curProc] === ImpPhase.FireDirect) {
						expect(phaser.state).to.be.equal(DeviceState.Begin)
						const phCap = ship.getDevice(DeviceIds.PhCap)
						expect(phCap.energy).to.be.equal(3)
						const traces = ship.buildFireTargets(game)
						expect(traces).to.be.ok
					}
				}
			}
		}
		ship.ctrl = new CtrlSpecial()
		expect(phaser.state).to.be.equal(DeviceState.Begin)
		// Drone D, если по нему не попасть, выхоодит за пределы карты на первом ходу.
		// Поэтому отодвигаем на 2 гекса назад
		game.getShip('droneD').setPos(9, 10)
		let guard = 200
		let actionStep = 1
		expect(game.state).to.be.equal('Active')
		for (; guard > 0; guard--) {
			game.idle()
			expect(game.state).to.be.equal('Active')
			expect(game.actions.size).to.be.equal(1)
			const action = game.actions.get('Con')
			expect(action).to.be.ok
			expect(action).to.have.property('name', 'Fire')
			if (actionStep === 1) {
				// Это на первом ходу
				expect(game.curTurn).to.be.equal(1)
				action.state = ActionState.End
				// Найти все типы орудий
				const phasersMap = action.traces.reduce((map, trace, index) => {
					map[trace.devId] = index
					return map
				}, {})
				// Пальнуть из каждого орудия в любую цель
				action.choices = Object.keys(phasersMap).map(devId => phasersMap[devId])
				game.receiveActions()
			} else {
				// Так как все орудия уже стреляли на первом ходу, то следующий раз возможен только на втором ходу
				expect(game.curTurn).to.be.equal(2)
				break
			}
			actionStep++
		}
		expect(guard).to.be.above(0)
	})

	it('calcDamage', () => {
		const game = new Game()
		game.create(first)
		const ship = game.getShip('Con')
		const phaser1 = ship.getDevice('PH1')
		const droneA = game.getShip('droneA')
		expect(ship.distanceTo(droneA)).to.be.equal(10)
		// На расстоянии 10 фазер-1 бьёт от 0 до 3
		for (let i = 0; i < 30; i++) {
			const dmg = phaser1.calcDamage(game, ship, droneA)
			expect(dmg).to.be.within(0, 3)
		}
		const droneB = game.getShip('droneB')
		expect(ship.distanceTo(droneB)).to.be.equal(4)
		// На расстоянии 4 фазер-1 бьёт от 2 до 5
		for (let i = 0; i < 30; i++) {
			const dmg = phaser1.calcDamage(game, ship, droneB)
			expect(dmg).to.be.within(2, 5)
		}
	})
})
