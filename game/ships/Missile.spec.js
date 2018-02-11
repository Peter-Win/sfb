const {expect} = require('chai')
const {Missile} = require('./Missile')
const {Game} = require('../Game')
const {first} = require('../scenarios/first')
const {second} = require('../scenarios/second')
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
	it('isInTargetHex', () => {
		const game = new Game()
		game.create(first)
		const enemyShip = game.getShip('Con')
		const droneA = game.getShip('droneA')
		expect(droneA.isInTargetHex(game)).to.be.false
		droneA.setPos(enemyShip.x, enemyShip.y)
		expect(droneA.isInTargetHex(game)).to.be.false	// Потому что не является целью
		droneA.target = enemyShip.uid
		expect(droneA.isInTargetHex(game)).to.be.true
		droneA.x++
		expect(droneA.isInTargetHex(game)).to.be.false
	})
	it('onResolveSeeking', () => {
		const game = new Game()
		game.create(second)
		const enemyShip = game.getShip('Con')
		const droneA = game.getShip('droneA')
		expect(droneA.onResolveSeeking(game)).to.be.null
		droneA.setPos(enemyShip.x, enemyShip.y)
		const hit = droneA.onResolveSeeking(game)
		expect(hit).to.be.ok
		expect(hit.targetId).to.be.equal(enemyShip.uid)
		expect(hit.result).to.be.eql({shield: 6})
		// Теперь ракета взорвалась, поэтому повторно она уже не может быть использована
		expect(droneA.onResolveSeeking(game)).to.be.null
	})
})
