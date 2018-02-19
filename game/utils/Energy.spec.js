/**
 * Created by PeterWin on 15.01.2018.
 */
const {expect} = require('chai')
const {Energy} = require('./Energy')
const {Game} = require('../Game')
const {second} = require('../scenarios/second')
const {DeviceIds} = require('../devices/DeviceIds')
const {Events} = require('../Events')
const {TurnPhase} = require('../TurnChart')

describe('Energy', () => {
	it('parseELim', () => {
		expect(Energy.parseELim('*0')).to.be.eql({Lim: 0})
		expect(Energy.parseELim('*125.5')).to.be.eql({Lim: 125.5})
		expect(Energy.parseELim('W=1')).to.be.eql({W:1, Lim: 1})
		expect(Energy.parseELim('W=9;I=1;Lim=8')).to.be.eql({W: 9, I: 1, Lim: 8})
		expect(Energy.parseELim('')).to.be.eql({Lim:0})
		expect(() => {
			Energy.parseELim('abcd')
		}).to.throw(Error)
	})
	it('getDevices', () => {
		const game = new Game()
		game.create(second)
		const ship = game.getShip('Con')
		const list = Energy.getDevices(ship)
		expect(list).to.have.lengthOf(3)
		expect(list[0]).to.have.property('devId', DeviceIds.PhCap)
		expect(list[1]).to.have.property('devId', 'PhotA')
		expect(list[2]).to.have.property('devId', 'PhotB')
	})
	it('getWantedEnergy', () => {
		const game = new Game()
		game.create(second)
		const ship = game.getShip('Con')
		const photA = ship.getDevice('PhotA')
		expect(photA).to.have.property('devId', 'PhotA')
		expect(photA.energyIn).to.be.equal(0)

		ship.energyPool.W = 4
		expect(Energy.getWantedEnergy('W', {W: 2, Lim: 10}, ship, photA)).to.be.equal(2)
		expect(Energy.getWantedEnergy('W', {W: 6, Lim: 10}, ship, photA)).to.be.equal(4)
	})
	it('translateEnergy', () => {
		const game = new Game()
		game.create(second)
		const ship = game.getShip('Con')
		ship.energyPool.W = 10
		ship.energyPool.A = 2
		const photA = ship.getDevice('PhotA')
		Energy.translateEnergy(3, 'W', ship, photA)
		expect(ship.energyPool.W).to.be.equal(7)
		expect(photA.energyIn).to.be.equal(3)
		expect(photA.energySrc).to.be.eql({W: 3})
		Energy.translateEnergy(1, 'A', ship, photA)
		expect(ship.energyPool.A).to.be.equal(1)
		expect(photA.energyIn).to.be.equal(4)
		expect(photA.energySrc).to.be.eql({W: 3, A: 1})
	})
	it('shipAutoEAlloc', () => {
		const game = new Game()
		game.create(second)
		const ship = game.getShip('Con')
		const phCap = ship.getDevice(DeviceIds.PhCap)
		const photA = ship.getDevice('PhotA')
		Events.toGame(TurnPhase.BeginOfTurn, game)	// зарядить энергию
		expect(ship.energyPool.W).to.be.equal(16)
		Energy.shipAutoEAlloc({ship})
		expect(phCap.energyIn).to.be.equal(3)
		expect(photA.energyIn).to.be.equal(2)
	})
})
