/*
 * Unit tests for Counter
 */
const {expect} = require('chai')
const {Counter} = require('./Counter')
const {Game} = require('../Game')
const {first} = require('../scenarios/first')

class CounterTest extends Counter {
	constructor() {
		super()
		this.testInfo = 'Test info'
	}
}

describe('Counter', () => {
	it('create', () => {
		const ship = Counter.create({
			Type: CounterTest,
			x: 4, y: 12, dir: 3,
			extStr: 'hello!',
			extBool: true,
		})
		expect(ship).to.have.property('x', 4)
		expect(ship).to.have.property('y', 12)
		expect(ship).to.have.property('dir', 3)
		expect(ship).to.have.property('extStr', 'hello!')
		expect(ship).to.have.property('extBool', true)
		expect(ship).to.have.property('testInfo', 'Test info')
	})

	// проверка попадания объекта в границы карты
	it('inMap', () => {
		const myMapWidth = 4
		const myMapHeight = 3
		// Тестовая игра
		const game = new Game()
		game.width = myMapWidth
		game.height = myMapHeight
		// Тестовый корабль
		const ship = Counter.create({
			Type: CounterTest,
		})
		// случаи с попаданием в карту
		// верхний левый угол карты
		ship.setPos(0, 0)
		expect(ship.inMap(game)).to.be.ok
		// верхний правый угол
		ship.setPos(myMapWidth - 1, 0)
		expect(ship.inMap(game)).to.be.ok
		// нижний левый угол
		ship.setPos(0, myMapHeight - 1)
		expect(ship.inMap(game)).to.be.ok
		// нижний правый угол
		ship.setPos(myMapWidth - 1, myMapHeight - 1)
		expect(ship.inMap(game)).to.be.ok
		// Середина карты
		ship.setPos(myMapWidth >> 1, myMapHeight >> 1)
		expect(ship.inMap(game)).to.be.ok
		// случаи с непопаданием
		// верхний левый угол
		ship.setPos(-1, 0)
		expect(ship.inMap(game)).to.be.false
		ship.setPos(0, -1)
		expect(ship.inMap(game)).to.be.false
		// верхний правый угол
		ship.setPos(myMapWidth, 0)
		expect(ship.inMap(game)).to.be.false
		ship.setPos(myMapHeight - 1, -1)
		expect(ship.inMap(game)).to.be.false
		// нижний левый угол
		ship.setPos(-1, myMapHeight - 1) // выход по x
		expect(ship.inMap(game)).to.be.false
		ship.setPos(0, myMapHeight)	// выход по y
		expect(ship.inMap(game)).to.be.false
		// нижний правый угол
		ship.setPos(myMapWidth, myMapHeight - 1) // выход по х
		expect(ship.inMap(game)).to.be.false
		ship.setPos(myMapWidth - 1, myMapHeight) // выход по y
		expect(ship.inMap(game)).to.be.false
	})

	it('isCanMove', () => {
		const game = new Game()
		game.create(first)
		const {Con} = game.objects
		// При скорости 8 корабль может двигаться на каждом импульсе
		expect(Con.isCanMove(game)).to.be.true
		game.curImp = game.turnLength - 2
		expect(Con.isCanMove(game)).to.be.true
		game.curImp = game.turnLength - 1
		expect(Con.isCanMove(game)).to.be.true
		// При скорости 1 корабль двигается только на последнем импульсе
		Con.speed = 1
		game.curImp = 0
		expect(Con.isCanMove(game)).to.be.false
		game.curImp = game.turnLength - 2
		expect(Con.isCanMove(game)).to.be.false
		game.curImp = game.turnLength - 1
		expect(Con.isCanMove(game)).to.be.true
	})

	it('getTurnMode', () => {
		const game = new Game()
		game.create(first)
		const ship = game.getShip('Con')
		expect(ship.speed).to.be.equal(8)
		expect(ship.turnMode).to.be.eql([6, 16])
		// При скорости 7 и выше - режим поворота учебного крейсера = 2
		expect(ship.getTurnMode()).to.be.equal(2)
		ship.speed = 7
		expect(ship.getTurnMode()).to.be.equal(2)
		ship.speed = 6
		expect(ship.getTurnMode()).to.be.equal(1)
		ship.speed = 5
		expect(ship.getTurnMode()).to.be.equal(1)
		ship.speed = 0
		expect(ship.getTurnMode()).to.be.equal(1)
	})

	it('getNextPos', () => {
		const game = new Game()
		game.create(first)
		const ship = game.getShip('Con')
		expect(ship.getPosDir()).to.be.eql({x: 0, y: 10, dir: 0})
		expect(ship.getNextPos()).to.be.eql({x: 0, y: 9})
		ship.dir = 1
		expect(ship.getNextPos()).to.be.eql({x: 1, y: 9})
		ship.dir = 2
		expect(ship.getNextPos()).to.be.eql({x: 1, y: 10})
		ship.dir = 3
		expect(ship.getNextPos()).to.be.eql({x: 0, y: 11})
	})
})
