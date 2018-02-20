const {expect} = require('chai')
const {Disruptor, stdDisruptorTable} = require('./Disruptor')
const {Game} = require('../Game')
const {firstMod} = require('../scenarios/first')

describe('Disruptor', () => {
	it('findRangeValue', () => {
		expect(Disruptor.findRangeValue(stdDisruptorTable, 0, 1)).to.be.equal(0)
		expect(Disruptor.findRangeValue(stdDisruptorTable, 0, 2)).to.be.equal(0)
		expect(Disruptor.findRangeValue(stdDisruptorTable, 1, 1)).to.be.equal(5)
		expect(Disruptor.findRangeValue(stdDisruptorTable, 1, 2)).to.be.equal(5)
	})
	it('calcFiringParams', () => {
		const game = new Game()
		game.create(firstMod({race: 'Klingon'}))
		const ship = game.getShip('Con')
		const disrA = ship.getDevice('DisrA')
		expect(disrA).to.be.ok
		const droneB = game.getShip('droneB')
		expect(ship.distanceTo(droneB)).to.be.equal(4)
		expect(disrA.calcFiringParams(ship, droneB)).to.be.eql({chance: 4, damage: 4})
	})
})
