const {expect} = require('chai')
const {scenario03} = require('../scenarios/scenario03')
const {Game} = require('../Game')
const {DeviceState} = require('../devices/DeviceState')
const {ShipState} = require('../ships/Counter')

describe('Freighter', () => {
	it('common', () => {
		const game = new Game()
		game.create(scenario03())
		const freighter = game.getShip('freighterA')
		expect(freighter).to.be.ok
		expect(freighter).to.have.property('speed', 4)
		expect(freighter.shield).to.be.eql([5])
	})

	it('Simple damage', () => {
		const game = new Game()
		game.create(scenario03())
		const freighter = game.getShip('freighterA')
		const myPhaser = freighter.getDevice('PH')
		const enemy = game.getShip('Main')
		const phaser = enemy.getDevice('PH1')

		let res = freighter.onDamage(game, enemy, phaser, 1)
		expect(res).to.be.eql({shield: 1})
		expect(freighter.shield).to.be.eql([4])

		freighter.onDamage(game, enemy, phaser, 4)
		expect(freighter.shield).to.be.eql([0])
		expect(freighter.damagePoints).to.be.equal(0)

		res = freighter.onDamage(game, enemy, phaser, 4)
		expect(res).to.be.eql({internal: 4})
		expect(myPhaser.state).to.be.equal(DeviceState.Begin)

		freighter.onDamage(game, enemy, phaser, 1)
		expect(freighter.damagePoints).to.be.equal(5)
		expect(myPhaser.state).to.be.equal(DeviceState.Dead)

		freighter.onDamage(game, enemy, phaser, 4)
		expect(freighter.speed).to.be.equal(4)

		freighter.onDamage(game, enemy, phaser, 1)
		expect(freighter.speed).to.be.equal(3)

		freighter.onDamage(game, enemy, phaser, 4)
		expect(freighter.speed).to.be.equal(3)

		freighter.onDamage(game, enemy, phaser, 1)
		expect(freighter.damagePoints).to.be.equal(15)
		expect(freighter.speed).to.be.equal(2)

		freighter.onDamage(game, enemy, phaser, 4)
		expect(freighter.state).to.be.equal(ShipState.Active)

		res = freighter.onDamage(game, enemy, phaser, 2)
		expect(freighter.state).to.be.equal(ShipState.Dead)
		expect(res).to.be.eql({internal: 1, lost: 1})
	})
})
