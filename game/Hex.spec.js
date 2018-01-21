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
})
