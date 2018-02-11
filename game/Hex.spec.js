/**
 * Created by PeterWin on 14.12.2017.
 */
const {expect} = require('chai')
const {Hex} = require('./Hex')
const {Random} = require('./Random')

describe('Hex', () => {
	//    __    __                __
	//   /00\__/20\__          __/0 \__
	//   \__/10\__/30\        /5 \__/1 \
	//   /01\__/21\__/        \__/  \__/
	//   \__/11\__/31\        /4 \__/2 \
	//      \__/22\__/        \__/3 \__/
	it('NearPos', () => {
		const pt00 = {x: 0, y: 0}
		const pt01 = {x: 0, y: 1}
		const pt10 = {x: 1, y: 0}
		const pt11 = {x: 1, y: 1}
		const pt20 = {x: 2, y: 0}
		const pt21 = {x: 2, y: 1}
		const pt22 = {x: 2, y: 2}
		const pt30 = {x: 3, y: 0}
		const pt31 = {x: 3, y: 1}
		expect(Hex.nearPos[0](pt11)).to.be.eql(pt10)
		expect(Hex.nearPos[1](pt01)).to.be.eql(pt10)
		expect(Hex.nearPos[1](pt11)).to.be.eql(pt21)
		expect(Hex.nearPos[2](pt10)).to.be.eql(pt21)
		expect(Hex.nearPos[2](pt21)).to.be.eql(pt31)
		expect(Hex.nearPos[3](pt21)).to.be.eql(pt22)
		expect(Hex.nearPos[4](pt30)).to.be.eql(pt21)
		expect(Hex.nearPos[4](pt21)).to.be.eql(pt11)
		expect(Hex.nearPos[5](pt22)).to.be.eql(pt11)
		expect(Hex.nearPos[5](pt11)).to.be.eql(pt01)
	})

	it('normalDir', () => {
		expect(Hex.normalDir(-7)).to.be.equal(5)
		expect(Hex.normalDir(-6)).to.be.equal(0)
		expect(Hex.normalDir(-5)).to.be.equal(1)
		expect(Hex.normalDir(-4)).to.be.equal(2)
		expect(Hex.normalDir(-3)).to.be.equal(3)
		expect(Hex.normalDir(-2)).to.be.equal(4)
		expect(Hex.normalDir(-1)).to.be.equal(5)
		expect(Hex.normalDir(0)).to.be.equal(0)
		expect(Hex.normalDir(1)).to.be.equal(1)
		expect(Hex.normalDir(2)).to.be.equal(2)
		expect(Hex.normalDir(3)).to.be.equal(3)
		expect(Hex.normalDir(4)).to.be.equal(4)
		expect(Hex.normalDir(5)).to.be.equal(5)
		expect(Hex.normalDir(6)).to.be.equal(0)
		expect(Hex.normalDir(7)).to.be.equal(1)
		expect(Hex.normalDir(8)).to.be.equal(2)
		expect(Hex.normalDir(9)).to.be.equal(3)
		expect(Hex.normalDir(10)).to.be.equal(4)
		expect(Hex.normalDir(11)).to.be.equal(5)
		expect(Hex.normalDir(12)).to.be.equal(0)
		expect(Hex.normalDir(13)).to.be.equal(1)
		expect(Hex.normalDir(14)).to.be.equal(2)
		expect(Hex.normalDir(15)).to.be.equal(3)
	})

	it('RotStep', () => {
		// Случайный поиск (100 раз)
		for (let i = 0; i < 100; i++) {
			const target = Random.int6()
			let current = Random.int6()
			// перемещение не должно занять более 3 шагов
			let limit = 3
			while (current !== target && limit > 0) {
				const step = Hex.rotStep[target][current]
				current = current + step
				current = current > 5 ? 0 : current
				current = current < 0 ? 5 : current
				limit--
			}
			expect(current).to.be.equal(target)
		}
	})

	//   __    __
	//  /00\__/20\__
	//  \__/10\__/30\
	//  /01\__/21\__/
	//  \__/11\__/31\
	//  /02\__/22\__/
	//  \__/12\__/32\
	//     \__/  \__/
	it('actualDistance', () => {
		expect(Hex.actualDistance({x: 0, y: 0}, {x: 0, y: 0})).to.be.equal(0)
		// dist=1 to direction=0
		expect(Hex.actualDistance({x: 0, y: 1}, {x: 0, y: 0})).to.be.equal(1)
		expect(Hex.actualDistance({x: 1, y: 1}, {x: 1, y: 0})).to.be.equal(1)
		// dist=1 to direction=1
		expect(Hex.actualDistance({x: 0, y: 1}, {x: 1, y: 0})).to.be.equal(1)
		expect(Hex.actualDistance({x: 1, y: 1}, {x: 2, y: 1})).to.be.equal(1)
		// dist=1 to direction=2
		expect(Hex.actualDistance({x: 0, y: 1}, {x: 1, y: 1})).to.be.equal(1)
		expect(Hex.actualDistance({x: 1, y: 1}, {x: 2, y: 2})).to.be.equal(1)
		// dist=1 to direction=3
		expect(Hex.actualDistance({x: 0, y: 1}, {x: 0, y: 2})).to.be.equal(1)
		expect(Hex.actualDistance({x: 1, y: 1}, {x: 1, y: 2})).to.be.equal(1)
		// dist=1 to direction=4
		expect(Hex.actualDistance({x: 2, y: 0}, {x: 1, y: 0})).to.be.equal(1)
		expect(Hex.actualDistance({x: 1, y: 1}, {x: 0, y: 2})).to.be.equal(1)
		// dist=1 to direction=5
		expect(Hex.actualDistance({x: 2, y: 1}, {x: 1, y: 0})).to.be.equal(1)
		expect(Hex.actualDistance({x: 1, y: 1}, {x: 0, y: 1})).to.be.equal(1)
		// dist=2, direction=0
		expect(Hex.actualDistance({x: 0, y: 2}, {x: 0, y: 0})).to.be.equal(2)
		expect(Hex.actualDistance({x: 1, y: 2}, {x: 1, y: 0})).to.be.equal(2)
		expect(Hex.actualDistance({x: 1, y: 2}, {x: 2, y: 1})).to.be.equal(2)
		// dist=2, dir=1
		expect(Hex.actualDistance({x: 0, y: 1}, {x: 2, y: 0})).to.be.equal(2)
		expect(Hex.actualDistance({x: 1, y: 2}, {x: 3, y: 1})).to.be.equal(2)
		// dist=2, dir=2
		expect(Hex.actualDistance({x: 0, y: 0}, {x: 2, y: 1})).to.be.equal(2)
		expect(Hex.actualDistance({x: 1, y: 0}, {x: 3, y: 1})).to.be.equal(2)
		// dist=2, dir=3
		expect(Hex.actualDistance({x: 0, y: 0}, {x: 0, y: 2})).to.be.equal(2)
		expect(Hex.actualDistance({x: 1, y: 0}, {x: 1, y: 2})).to.be.equal(2)
		// dist=3 in areaB
		expect(Hex.actualDistance({x: 3, y: 0}, {x: 0, y: 0})).to.be.equal(3)
		// dist=4 in area C
		expect(Hex.actualDistance({x: 2, y: 0}, {x: 1, y: 3})).to.be.equal(4)
	})

	it('inverseDir', () => {
		expect(Hex.inverseDir(0)).to.be.equal(3)
		expect(Hex.inverseDir(1)).to.be.equal(4)
		expect(Hex.inverseDir(2)).to.be.equal(5)
		expect(Hex.inverseDir(3)).to.be.equal(0)
		expect(Hex.inverseDir(4)).to.be.equal(1)
		expect(Hex.inverseDir(5)).to.be.equal(2)
	})

	/**
	 * /00\__/20\__/40\__/60\__/80\
	 * \__/10\__/30\__/50\__/70\__/
	 * /01\__/21\__/41\__/61\__/81\
	 * \__/11\__/31\__/51\__/71\__/
	 * /02\__/22\__/42\__/62\__/
	 * \__/12\__/32\__/52\__/72
	 * /03\__/23\__/43\__/63\__
	 * \__/13\__/33\__/53\__/73
	 * /04\__/24\__/44\__/64\__
	 * \__/14\__/34\__/54\__/
	 * /05\__/25\__/45\__/
	 * \__/15\__/35\__/
	 * /06\__/26\__/46\
	 * \__/16\__/36\__/
	 * /07\__/27\__/
	 * \__/17\__/37\
	 * /08\__/28\__/
	 * \__/18\__/
	 * /09\__/29\
	 * \__/19\__/
	 * /0A\__/
	 * \__/1A\
	 * /0B\__/
	 */
	it('locateDir', () => {
		// Для совпадающих точек - пустой список
		expect(Hex.locateDir({x: 3, y: 2}, {x: 3, y: 2})).to.be.eql([])
		// Для точек с одинаковым Y
		// если dX четный, то попадание в 2 сектора
		expect(Hex.locateDir({x: 3, y: 1}, {x: 5, y: 1})).to.be.eql([1, 2])
		expect(Hex.locateDir({x: 2, y: 2}, {x: 6, y: 2})).to.be.eql([1, 2])
		expect(Hex.locateDir({x: 5, y: 1}, {x: 3, y: 1})).to.be.eql([4, 5])
		expect(Hex.locateDir({x: 6, y: 2}, {x: 2, y: 2})).to.be.eql([4, 5])
		// Если dX нечетный, то сектор 1
		expect(Hex.locateDir({x: 1, y: 0}, {x: 4, y: 0})).to.be.eql([1])
		expect(Hex.locateDir({x: 2, y: 1}, {x: 3, y: 1})).to.be.eql([2])
		expect(Hex.locateDir({x: 4, y: 1}, {x: 3, y: 1})).to.be.eql([4])
		expect(Hex.locateDir({x: 5, y: 1}, {x: 4, y: 1})).to.be.eql([5])
		// Попадание строго в сектор 0
		expect(Hex.locateDir({x: 3, y: 2}, {x: 3, y: 0})).to.be.eql([0]) // Вертикаль
		expect(Hex.locateDir({x: 3, y: 4}, {x: 5, y: 0})).to.be.eql([0]) // Четная dX справа
		expect(Hex.locateDir({x: 4, y: 4}, {x: 2, y: 0})).to.be.eql([0]) // четная dX слева
		expect(Hex.locateDir({x: 0, y: 8}, {x: 3, y: 2})).to.be.eql([0])
		// Попадание в соседние сектора 0 и 1
		expect(Hex.locateDir({x: 3, y: 3}, {x: 5, y: 0})).to.be.eql([0, 1])
		expect(Hex.locateDir({x: 0, y: 8}, {x: 3, y: 3})).to.be.eql([0, 1])
		expect(Hex.locateDir({x: 1, y: 8}, {x: 5, y: 2})).to.be.eql([0, 1])
		expect(Hex.locateDir({x: 4, y: 3}, {x: 2, y: 0})).to.be.eql([0, 5])
		expect(Hex.locateDir({x: 4, y: 4}, {x: 3, y: 2})).to.be.eql([0, 5])
		expect(Hex.locateDir({x: 5, y: 6}, {x: 2, y: 2})).to.be.eql([0, 5])
		expect(Hex.locateDir({x: 4, y: 6}, {x: 1, y: 1})).to.be.eql([0, 5])
		expect(Hex.locateDir({x: 5, y: 6}, {x: 2, y: 2})).to.be.eql([0, 5])
		// Попадание строго в сектор 1
		expect(Hex.locateDir({x: 1, y: 4}, {x: 7, y: 1})).to.be.eql([1])	// Прямо на оси (чет)
		expect(Hex.locateDir({x: 1, y: 4}, {x: 7, y: 0})).to.be.eql([1])	// Выше оси
		expect(Hex.locateDir({x: 1, y: 4}, {x: 7, y: 3})).to.be.eql([1])	// ниже оси
		expect(Hex.locateDir({x: 0, y: 8}, {x: 5, y: 4})).to.be.eql([1])
		expect(Hex.locateDir({x: 1, y: 7}, {x: 4, y: 4})).to.be.eql([1])
		// Строго в сектор 2
		expect(Hex.locateDir({x: 2, y: 0}, {x: 6, y: 2})).to.be.eql([2])	// На оси (чет)
		expect(Hex.locateDir({x: 1, y: 0}, {x: 7, y: 1})).to.be.eql([2])	// Выше оси (чет)
		expect(Hex.locateDir({x: 4, y: 0}, {x: 6, y: 2})).to.be.eql([2])	// Ниже оси (чет)
		expect(Hex.locateDir({x: 0, y: 0}, {x: 5, y: 6})).to.be.eql([2])
		expect(Hex.locateDir({x: 1, y: 0}, {x: 4, y: 4})).to.be.eql([2])
		// 2, 3
		expect(Hex.locateDir({x: 0, y: 0}, {x: 5, y: 7})).to.be.eql([2, 3])
		expect(Hex.locateDir({x: 1, y: 0}, {x: 4, y: 5})).to.be.eql([2, 3])
		// Попадание строго в сектор 3
		expect(Hex.locateDir({x: 5, y: 1}, {x: 5, y: 10})).to.be.eql([3])
		expect(Hex.locateDir({x: 2, y: 0}, {x: 4, y: 4})).to.be.eql([3])	// четный dX, справа
		expect(Hex.locateDir({x: 6, y: 0}, {x: 4, y: 4})).to.be.eql([3])	// четный dX, слева
		expect(Hex.locateDir({x: 0, y: 0}, {x: 5, y: 8})).to.be.eql([3])
		expect(Hex.locateDir({x: 1, y: 0}, {x: 4, y: 6})).to.be.eql([3])
		expect(Hex.locateDir({x: 6, y: 0}, {x: 1, y: 8})).to.be.eql([3])
		// [3, 4]
		expect(Hex.locateDir({x: 6, y: 0}, {x: 1, y: 7})).to.be.eql([3, 4])
		// Попадание строго в сектор 4
		expect(Hex.locateDir({x: 7, y: 0}, {x: 1, y: 3})).to.be.eql([4])	// на оси, чет dX
		expect(Hex.locateDir({x: 6, y: 0}, {x: 0, y: 4})).to.be.eql([4])	// ниже оси, чет dX
		expect(Hex.locateDir({x: 6, y: 1}, {x: 2, y: 4})).to.be.eql([4])	// выше оси, чет dX
		expect(Hex.locateDir({x: 6, y: 0}, {x: 1, y: 6})).to.be.eql([4])
		// Попадание строго в сектор 5
		expect(Hex.locateDir({x: 6, y: 4}, {x: 2, y: 2})).to.be.eql([5])	// на оси, чет dX
		expect(Hex.locateDir({x: 6, y: 4}, {x: 2, y: 0})).to.be.eql([5])	// выше оси, чет dX
		expect(Hex.locateDir({x: 5, y: 3}, {x: 1, y: 2})).to.be.eql([5])	// ниже оси, чет dX
	})
})
