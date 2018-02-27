/**
 * Created by PeterWin on 03.02.2018.
 */
const {expect} = require('chai')
const {CtrlSeeking} = require('./CtrlSeeking')
const {Game} = require('../Game')
const {second} = require('../scenarios/second')
const {movAgent} = require('../agents/movAgent')
const {Hex} = require('../Hex')

describe('CtrlSeeking', () => {
	it('common', () => {
		const game = new Game()
		game.create(second)
		const ship = game.getShip('Con')
		const droneA = game.getShip('droneA')
		expect(droneA).to.be.ok
		expect(droneA).to.have.property('targetId', 'Con')
		expect(ship.canDamagedBy(droneA, null)).to.be.true
	})
	it('selectDirection', () => {
		const game = new Game()
		game.create(second)
		const ship = game.getShip('Con')
		const droneA = game.getShip('droneA')
		const {ctrl} = droneA
		{
			const action1 = movAgent.createAction({game, ship: droneA})
			expect(ctrl.selectDirection(droneA, ship, action1)).to.be.equal(movAgent.Center)
			// Перенести цель в сектор 1, что требует поворота налево (current = 1)
			ship.y = 6
			expect(ctrl.selectDirection(droneA, ship, action1)).to.be.equal(movAgent.Left)
			// Теперь сектор 3, что требует поворота право (current = 2)
			ship.setPos(1, 14)
			expect(ctrl.selectDirection(droneA, ship, action1)).to.be.equal(movAgent.Right)
		}
		{
			// Теперь перенести ракету в центр доски
			droneA.setPos(14, 8)
			const action2 = movAgent.createAction({game, ship: droneA})
			// Цель слева вне доступного сектора поворота
			ship.setPos(15, 0)
			expect(Hex.locateDir(droneA, ship)).to.be.eql([0])	// цель в секторе 0
			expect(action2.list[1].dir).to.be.equal(1)	// Поворот налево указывает на сектор 1
			expect(ctrl.selectDirection(droneA, ship, action2)).to.be.equal(movAgent.Left)	// Поэтому поворот налево
			// Цель справа вне доступного сектора поворота
			ship.setPos(8, 12)
			expect(Hex.locateDir(droneA, ship)).to.be.eql([4])	// Цель в секторе 4
			expect(action2.list[2].dir).to.be.equal(3)	// поворот направо указывает в сектор 3
			expect(ctrl.selectDirection(droneA, ship, action2)).to.be.equal(movAgent.Right)	// Поэтому поворот направо
			// Цель позади, но движется так, что выгоднее поворот налево
			ship.y = 5
			expect(Hex.locateDir(droneA, ship)).to.be.eql([5])	// Цель в секторе 5
			// Проверка несколько раз, т.к. возможен случайный выбор
			for (let i = 0; i < 10; i++) {
				expect(ctrl.selectDirection(droneA, ship, action2)).to.be.equal(movAgent.Left)
			}
			// Теперь цель движется так, что выгоднее поворот направо
			ship.dir = 3
			// Проверка несколько раз, т.к. возможен случайный выбор
			for (let i = 0; i < 10; i++) {
				expect(ctrl.selectDirection(droneA, ship, action2)).to.be.equal(movAgent.Right)
			}
		}
	})
})
