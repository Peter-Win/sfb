/**
 * Created by PeterWin on 12.02.2018.
 */
const {expect} = require('chai')
const {second, secondMod} = require('./second')
const {Game} = require('../Game')
const {GameState} = require('../GameState')
const {Side} = require('../Side')
const {CtrlSimple} = require('../ctrls/CtrlSimple')
const {ShipState} = require('../ships/Counter')
const {RaceType} = require('../Race')
const {DeviceState} = require('../devices/DeviceState')

describe('second', () => {
	it('Con left the map', () => {
		const game = new Game()
		game.create(second)
		const Con = game.getShip('Con')
		Con.ctrl = new CtrlSimple()
		// Перенести корабль на край карты, чтобы следующим ходом он вылетел
		Con.y = 0
		game.idle()
		expect(Con.y).to.be.equal(-1)
		expect(Con.state).to.be.equal(ShipState.Lost)
		expect(game.state).to.be.equal(GameState.End)
		expect(game.sides[0].state).to.be.equal(Side.states.Loser)
		expect(game.reasonMessage).to.have.property('text', '{name} left the map')
	})
	it('Con received damage', () => {
		const game = new Game()
		game.create(second)
		const Con = game.getShip('Con')
		Con.ctrl = new CtrlSimple()
		const droneA = game.getShip('droneA')
		const droneB = game.getShip('droneB')
		// Направить обе ракеты в корму корабля. Два попадания туда приведут к появлению внутренних повреждений
		droneA.setPos(Con.x, Con.y, Con.dir)
		droneB.setPos(Con.x, Con.y, Con.dir)
		game.idle()
		expect(Con.state).to.be.equal(ShipState.Dead)
		expect(game.state).to.be.equal(GameState.End)
		expect(game.sides[0].state).to.be.equal(Side.states.Loser)
		expect(game.reasonMessage).to.have.property('text', '{name} received critical damage')
	})
	it('All drones eliminated', () => {
		const game = new Game()
		game.create(second)
		const Con = game.getShip('Con')
		Con.ctrl = new CtrlSimple()
		Object.keys(game.objects).forEach(uid => {
			if (/^drone/.test(uid)) {
				const drone = game.getShip(uid)
				drone.setState(ShipState.Exploded)
			}
		})
		game.idle()
		expect(Con.state).to.be.equal(ShipState.Active)
		expect(game.state).to.be.equal(GameState.End)
		expect(game.sides[0].state).to.be.equal(Side.states.Winner)
	})
	it('Klingon', () => {
		const game = new Game()
		game.create(secondMod({race: RaceType.Klingon}))
		const ship = game.getShip('Con')
		const droneRack = ship.getDevice('DRN')
		expect(droneRack).to.be.ok
		expect(droneRack.state).to.be.equal(DeviceState.Disabled)
	})
})
