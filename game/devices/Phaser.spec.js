/**
 * Created by PeterWin on 14.01.2018.
 */
const {expect} = require('chai')
const {DeviceIds} = require('./DeviceIds')
const {Phaser} = require('./Phaser')
const {Game} = require('../Game')
const {first} = require('../scenarios/first')
const {Events} = require('../Events')
const {TurnPhase} = require('../TurnChart')

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
})