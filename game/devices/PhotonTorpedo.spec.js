/**
 * Created by PeterWin on 14.02.2018.
 */
const {expect} = require('chai')
const {PhotonTorpedo} = require('./PhotonTorpedo')
const {Game} = require('../Game')
const {GameState} = require('../GameState')
const {second} = require('../scenarios/second')
const {CtrlSimple} = require('../ctrls/CtrlSimple')
const {fireAgent} = require('../agents/fireAgent')
const {DeviceState} = require('../devices/DeviceState')

class PTCtrl extends CtrlSimple{
	onAction(game, action) {
		const photA = game.getShip('Con').getDevice('PhotA')
		if (action.name === fireAgent.name) {

		} else {
			if (game.curTurn === 1) {
				// На первом ходу фотонная торпеда заряжена только наполовину
				expect(photA.state).to.be.equal(DeviceState.Half)
			}
			super.onAction(game, action)
		}
	}
}

describe('PhotonTorpedo', () => {
	it('test', () => {
		const game = new Game()
		game.create(second)
		const ship = game.getShip('Con')
		ship.setPos(0, 0, 2)
		ship.ctrl = new PTCtrl();
		// Запретить использование фазеров
		['PH1', 'PH2', 'PH3'].forEach(devId => {
			ship.getDevice(devId).setState(DeviceState.Disabled)
		});
		// Убрать первые 4 ракеты
		['droneA', 'droneB', 'droneC', 'droneD'].forEach(uid => {
			delete game.objects[uid]
		})
		const photA = ship.getDevice('PhotA')
		expect(photA.state).to.be.equal(DeviceState.Begin)
		game.idle()
		expect(game.curTurn).to.be.equal(2)
		// Акция стрельбы фотонными торпедами в начале второго хода
		expect(game.state).to.be.equal(GameState.Active)
	})

	it('isValidTarget', () => {
		const game = new Game()
		game.create(second)
		const droneA = game.getShip('droneA')
		const ship = game.getShip('Con')
		const photA = ship.getDevice('PhotA')
		// target in FA
		expect(photA.isValidTarget(ship, droneA)).to.be.true
		// not in FA sector
		ship.y--
		expect(photA.isValidTarget(ship, droneA)).to.be.false
		// in sector. but is too close
		ship.setPos(1, 8)
		expect(photA.isValidTarget(ship, droneA)).to.be.false
		// in same hex with target
		ship.setPos(0, 8)
		expect(photA.isValidTarget(ship, droneA)).to.be.false
		// good again
		ship.setPos(1, 9)
		expect(photA.isValidTarget(ship, droneA)).to.be.true
	})

	it('findChance', () => {
		const game = new Game()
		game.create(second)
		const ship = game.getShip('Con')
		const photA = ship.getDevice('PhotA')
		expect(PhotonTorpedo.findChance(photA.table, 2)).to.be.equal(5)
		expect(PhotonTorpedo.findChance(photA.table, 3)).to.be.equal(4)
		expect(PhotonTorpedo.findChance(photA.table, 4)).to.be.equal(4)
		expect(PhotonTorpedo.findChance(photA.table, 6)).to.be.equal(3)
		expect(PhotonTorpedo.findChance(photA.table, 9)).to.be.equal(2)
		expect(PhotonTorpedo.findChance(photA.table, 12)).to.be.equal(2)
		expect(PhotonTorpedo.findChance(photA.table, 13)).to.be.equal(1)
		expect(PhotonTorpedo.findChance(photA.table, 30)).to.be.equal(1)
		expect(PhotonTorpedo.findChance(photA.table, 31)).to.be.equal(0)
	})
	it('updateFireTrace', () => {
		const game = new Game()
		game.create(second)
		const droneA = game.getShip('droneA')
		const ship = game.getShip('Con')
		const photA = ship.getDevice('PhotA')
		expect(ship.distanceTo(droneA)).to.be.equal(8)
		const trace = fireAgent.createTrace({game, ship, dev: photA, target: droneA})
		photA.updateFireTrace({game, ship}, trace)
		expect(trace).to.have.property('damage', 8)
		expect(trace).to.have.property('chance', 3)
	})

	it('checkFireTraces', () => {
		const game = new Game()
		game.create(second)
		const droneA = game.getShip('droneA')
		const droneB = game.getShip('droneB')
		const ship = game.getShip('Con')
		const photA = ship.getDevice('PhotA')
		const photB = ship.getDevice('PhotB')
		{
			// Обе пушки бьют в одну цель
			const commonTarget = [
				fireAgent.createTrace({game, ship, dev: photA, target: droneA}),
				fireAgent.createTrace({game, ship, dev: photB, target: droneA}),
			]
			// console.log(JSON.stringify(commonTarget))
			expect(photA.checkFireTraces(game, ship, commonTarget, 0)).to.be.true
			expect(photB.checkFireTraces(game, ship, commonTarget, 1)).to.be.true
		}
		{
			// Каждая пушка бьёт в свою цель
			const diffTarget = [
				fireAgent.createTrace({game, ship, dev: photA, target: droneA}),
				fireAgent.createTrace({game, ship, dev: photB, target: droneB}),
			]
			expect(photA.checkFireTraces(game, ship, diffTarget, 0)).to.be.true
			expect(photB.checkFireTraces(game, ship, diffTarget, 1)).to.be.true
		}
		{
			// Имитация ошибки: первая пушка бьёт в две цели
			const dupTarget = [
				fireAgent.createTrace({game, ship, dev: photA, target: droneA}),
				fireAgent.createTrace({game, ship, dev: photA, target: droneB}),
			]
			expect(photA.checkFireTraces(game, ship, dupTarget, 0)).to.be.false
		}
	})
	it('isHit', () => {
		const game = new Game()
		game.create(second)
		const droneA = game.getShip('droneA')
		const ship = game.getShip('Con')
		const photA = ship.getDevice('PhotA')
		expect(ship.distanceTo(droneA)).to.be.equal(8)
		// Расстояние = 8 гексов, что означает 3 шанса из 6
		expect(photA.isHit(ship, droneA, 6)).to.be.false
		expect(photA.isHit(ship, droneA, 5)).to.be.false
		expect(photA.isHit(ship, droneA, 4)).to.be.false
		expect(photA.isHit(ship, droneA, 3)).to.be.true
		expect(photA.isHit(ship, droneA, 1)).to.be.true
		// Переместим корабль ближе к цели
		ship.setPos(1, 9)
		expect(ship.distanceTo(droneA)).to.be.equal(2)
		// Расстояние = 2 гекса, что означает 5 шансов из 6
		expect(photA.isHit(ship, droneA, 6)).to.be.false
		expect(photA.isHit(ship, droneA, 5)).to.be.true
	})
})
