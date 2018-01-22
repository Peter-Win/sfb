const {expect} = require('chai')
const {Missile} = require('./Missile')
const {Game} = require('../Game')
const {first} = require('../scenarios/first')
const {ShipState} = require('./Counter')

describe('Missile', () => {
	it('canDamagedBy', () => {
		const game = new Game()
		game.create(first)
		const enemyShip = game.getShip('Con')
		const droneA = game.getShip('droneA')
		const droneB = game.getShip('droneB')
		expect(droneA.canDamagedBy(enemyShip, null)).to.be.false
		expect(droneA.canDamagedBy(enemyShip, enemyShip.getDevice('PH1'))).to.be.true
		expect(droneA.canDamagedBy(droneB, null)).to.be.true
	})

	it('onDamage', () => {
		const game = new Game()
		game.create(first)
		const enemyShip = game.getShip('Con')
		const droneA = game.getShip('droneA')
		const result = droneA.onDamage(enemyShip, enemyShip.getDevice('PH1'), 4)
		expect(droneA.health).to.be.equal(0)
		expect(droneA.state).to.be.equal(ShipState.Exploded)
		expect(droneA.isActive()).to.be.false
		expect(droneA.isNotActive()).to.be.true
		expect(result).to.be.eql({internal: 4})
	})
})
