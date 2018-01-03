/*
 * Unit tests for SfbObject
 */
const {expect} = require('chai')
const {SfbObject} = require('./SfbObject')
const {Game} = require('../Game')
const {first} = require('../scenarios/first')

class SfbObjectTest extends SfbObject {
	constructor() {
		super()
		this.testInfo = 'Test info'
	}
}

describe('SfbObject', () => {
	it('create', () => {
		const ship = SfbObject.create({
			Type: SfbObjectTest,
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
		const ship = SfbObject.create({
			Type: SfbObjectTest,
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
})
