/**
 * Created by PeterWin on 09.01.2018.
 */
const {expect} = require('chai')
const {Sector, Snowflake} = require('./Sector')

// /00\__/20\__/40\
// \__/10\__/30\__/
// /01\__/21\__/41\
// \__/11\__/31\__/
// /02\__/22\__/42\
// \__/12\__/32\__/
// /03\__/23\__/43\
// \__/22\__/33\__/

describe('Snowflake', () => {
	it('Left', () => {
		const snow = new Snowflake({x:2, y: 2})
		expect(snow.isLeft({x: 0, y: 0})).to.be.true
		expect(snow.isLeft({x: 1, y: 1})).to.be.true
		expect(snow.isLeft({x: 2, y: 0})).to.be.true
		expect(snow.isLeft({x: 3, y: 10})).to.be.false
		expect(snow.isLeft({x: 4, y: 1})).to.be.false
	})
	it('Right', () => {
		const snow = new Snowflake({x:2, y: 2})
		expect(snow.isRight({x: 0, y: 0})).to.be.false
		expect(snow.isRight({x: 1, y: 1})).to.be.false
		expect(snow.isRight({x: 2, y: 0})).to.be.true
		expect(snow.isRight({x: 3, y: 10})).to.be.true
		expect(snow.isRight({x: 4, y: 1})).to.be.true
	})
	it('RightSlope', () => {
		const snow = new Snowflake({x: 2, y: 2})
		expect(snow.rightSlope(2)).to.be.equal(2)
		expect(snow.rightSlope(1)).to.be.equal(1)
		expect(snow.rightSlope(0)).to.be.equal(1)
		expect(snow.rightSlope(3)).to.be.equal(2)
		expect(snow.rightSlope(4)).to.be.equal(3)
		expect(snow.rightSlope(5)).to.be.equal(3)
		expect(snow.rightSlope(6)).to.be.equal(4)

		const snow1 = new Snowflake({x: 3, y: 1})
		expect(snow1.rightSlope(0)).to.be.equal(0)
		expect(snow1.rightSlope(1)).to.be.equal(0)
		expect(snow1.rightSlope(2)).to.be.equal(1)
		expect(snow1.rightSlope(3)).to.be.equal(1)
		expect(snow1.rightSlope(4)).to.be.equal(2)
		expect(snow1.rightSlope(5)).to.be.equal(2)
		expect(snow1.rightSlope(6)).to.be.equal(3)
		expect(snow1.rightSlope(7)).to.be.equal(3)
	})
	// /00\__/20\__/40\__/
	// \__/10\__/30\__/50\
	// #01\__/21\__/41\__/
	// \__#11\__/31\__/51\
	// /02\__#22\__/42\__/
	// \__/12\__#32\__/52\
	// /03\__/23\__#43\__/
	// \__/13\__/33\__#53\
	// /04\__/24\__/44\__#
	it('RightUp', () => {
		const snow = new Snowflake({x:2, y: 2})
		expect(snow.isRightUp({x: 0, y: 1})).to.be.true
		expect(snow.isRightUp({x: 2, y: 0})).to.be.true
		expect(snow.isRightUp({x: 5, y: 0})).to.be.true
		expect(snow.isRightUp({x: 1, y: 1})).to.be.true
		expect(snow.isRightUp({x: 2, y: 2})).to.be.true
		expect(snow.isRightUp({x: 3, y: 2})).to.be.true
		expect(snow.isRightUp({x: 4, y: 3})).to.be.true
		expect(snow.isRightUp({x: 0, y: 2})).to.be.false
		expect(snow.isRightUp({x: 0, y: 2})).to.be.false
		expect(snow.isRightUp({x: 1, y: 2})).to.be.false
		expect(snow.isRightUp({x: 2, y: 3})).to.be.false
		expect(snow.isRightUp({x: 3, y: 3})).to.be.false
		const snow1 = new Snowflake({x:3, y: 2})
		expect(snow1.isRightUp({x: 0, y: 1})).to.be.true
		expect(snow1.isRightUp({x: 1, y: 1})).to.be.true
		expect(snow1.isRightUp({x: 2, y: 2})).to.be.true
		expect(snow1.isRightUp({x: 3, y: 2})).to.be.true
		expect(snow1.isRightUp({x: 4, y: 3})).to.be.true
		expect(snow1.isRightUp({x: 5, y: 3})).to.be.true
		expect(snow1.isRightUp({x: 3, y: 1})).to.be.true
		expect(snow1.isRightUp({x: 4, y: 2})).to.be.true
		expect(snow1.isRightUp({x: 0, y: 2})).to.be.false
		expect(snow1.isRightUp({x: 1, y: 2})).to.be.false
		expect(snow1.isRightUp({x: 2, y: 3})).to.be.false
		expect(snow1.isRightUp({x: 3, y: 3})).to.be.false
		expect(snow1.isRightUp({x: 4, y: 4})).to.be.false
	})
	// /00\__/20\__/40\__/
	// \__/10\__/30\__/50\
	// #01\__/21\__/41\__/
	// \__#11\__/31\__/51\
	// /02\__#22\__/42\__/
	// \__/12\__#32\__/52\
	// /03\__/23\__#43\__/
	// \__/13\__/33\__#53\
	// /04\__/24\__/44\__#
	it('isRightDown', () => {
		const snow = new Snowflake({x:2, y: 2})
		expect(snow.isRightDown({x: 0, y: 1})).to.be.false
		expect(snow.isRightDown({x: 2, y: 0})).to.be.false
		expect(snow.isRightDown({x: 5, y: 0})).to.be.false
		expect(snow.isRightDown({x: 1, y: 1})).to.be.true
		expect(snow.isRightDown({x: 2, y: 2})).to.be.true
		expect(snow.isRightDown({x: 3, y: 2})).to.be.true
		expect(snow.isRightDown({x: 4, y: 3})).to.be.true
		expect(snow.isRightDown({x: 0, y: 2})).to.be.true
		expect(snow.isRightDown({x: 0, y: 2})).to.be.true
		expect(snow.isRightDown({x: 1, y: 2})).to.be.true
		expect(snow.isRightDown({x: 2, y: 3})).to.be.true
		expect(snow.isRightDown({x: 3, y: 3})).to.be.true
		const snow1 = new Snowflake({x:3, y: 2})
		expect(snow1.isRightDown({x: 0, y: 1})).to.be.true
		expect(snow1.isRightDown({x: 1, y: 1})).to.be.true
		expect(snow1.isRightDown({x: 2, y: 2})).to.be.true
		expect(snow1.isRightDown({x: 3, y: 2})).to.be.true
		expect(snow1.isRightDown({x: 4, y: 3})).to.be.true
		expect(snow1.isRightDown({x: 5, y: 3})).to.be.true
		expect(snow1.isRightDown({x: 3, y: 1})).to.be.false
		expect(snow1.isRightDown({x: 4, y: 2})).to.be.false
		expect(snow1.isRightDown({x: 0, y: 2})).to.be.true
		expect(snow1.isRightDown({x: 1, y: 2})).to.be.true
		expect(snow1.isRightDown({x: 2, y: 3})).to.be.true
		expect(snow1.isRightDown({x: 3, y: 3})).to.be.true
		expect(snow1.isRightDown({x: 4, y: 4})).to.be.true
	})
	// /00\__/20\__/40\
	// \__/10\__/30\__/
	// /01\__/21\__/41#
	// \__/11\__/31#__/
	// /02\__/22#__/42\
	// \__/12#__/32\__/
	// /03#__/23\__/43\
	// #__/13\__/33\__/
	// /04\__/24\__/44\
	it('leftSlope', () => {
		const snow = new Snowflake({x: 2, y: 2})
		expect(snow.leftSlope(0)).to.be.equal(3)
		expect(snow.leftSlope(1)).to.be.equal(2)
		expect(snow.leftSlope(2)).to.be.equal(2)
		expect(snow.leftSlope(3)).to.be.equal(1)
		expect(snow.leftSlope(4)).to.be.equal(1)
		expect(snow.leftSlope(5)).to.be.equal(0)

		const snow1 = new Snowflake({x: 3, y: 2})
		expect(snow1.leftSlope(0)).to.be.equal(4)
		expect(snow1.leftSlope(1)).to.be.equal(3)
		expect(snow1.leftSlope(2)).to.be.equal(3)
		expect(snow1.leftSlope(3)).to.be.equal(2)
		expect(snow1.leftSlope(4)).to.be.equal(2)
		expect(snow1.leftSlope(5)).to.be.equal(1)
	})

	// /00\__/20\__/40\
	// \__/10\__/30\__/
	// /01\__/21\__/41#
	// \__/11\__/31#__/
	// /02\__/22#__/42\
	// \__/12#__/32\__/
	// /03#__/23\__/43\
	// #__/13\__/33\__/
	// /04\__/24\__/44\
	it('isLeftUp', () => {
		const snow = new Snowflake({x: 2, y: 2})
		expect(snow.isLeftUp({x: 2, y: 2})).to.be.true
		expect(snow.isLeftUp({x: 1, y: 2})).to.be.true
		expect(snow.isLeftUp({x: 4, y: 1})).to.be.true
		expect(snow.isLeftUp({x: 2, y: 1})).to.be.true
		expect(snow.isLeftUp({x: 0, y: 0})).to.be.true
		expect(snow.isLeftUp({x: 1, y: 3})).to.be.false
		expect(snow.isLeftUp({x: 2, y: 3})).to.be.false
		expect(snow.isLeftUp({x: 3, y: 2})).to.be.false
		expect(snow.isLeftUp({x: 4, y: 4})).to.be.false

		const snow1 = new Snowflake({x: 3, y: 2})
		expect(snow1.isLeftUp({x: 3, y: 2})).to.be.true
		expect(snow1.isLeftUp({x: 2, y: 3})).to.be.true
		expect(snow1.isLeftUp({x: 4, y: 2})).to.be.true
		expect(snow1.isLeftUp({x: 0, y: 4})).to.be.true
		expect(snow1.isLeftUp({x: 2, y: 4})).to.be.false
		expect(snow1.isLeftUp({x: 3, y: 3})).to.be.false
		expect(snow1.isLeftUp({x: 4, y: 3})).to.be.false
		expect(snow1.isLeftUp({x: 4, y: 4})).to.be.false
	})
	// /00\__/20\__/40\
	// \__/10\__/30\__/
	// /01\__/21\__/41#
	// \__/11\__/31#__/
	// /02\__/22#__/42\
	// \__/12#__/32\__/
	// /03#__/23\__/43\
	// #__/13\__/33\__/
	// /04\__/24\__/44\
	it('isLeftDown', () => {
		const snow = new Snowflake({x: 2, y: 2})
		expect(snow.isLeftDown({x: 2, y: 2})).to.be.true
		expect(snow.isLeftDown({x: 1, y: 2})).to.be.true
		expect(snow.isLeftDown({x: 4, y: 1})).to.be.true
		expect(snow.isLeftDown({x: 2, y: 1})).to.be.false
		expect(snow.isLeftDown({x: 0, y: 0})).to.be.false
		expect(snow.isLeftDown({x: 1, y: 3})).to.be.true
		expect(snow.isLeftDown({x: 2, y: 3})).to.be.true
		expect(snow.isLeftDown({x: 3, y: 2})).to.be.true
		expect(snow.isLeftDown({x: 4, y: 4})).to.be.true

		const snow1 = new Snowflake({x: 3, y: 2})
		expect(snow1.isLeftDown({x: 3, y: 2})).to.be.true
		expect(snow1.isLeftDown({x: 2, y: 3})).to.be.true
		expect(snow1.isLeftDown({x: 4, y: 2})).to.be.true
		expect(snow1.isLeftDown({x: 0, y: 4})).to.be.true
		expect(snow1.isLeftDown({x: 2, y: 4})).to.be.true
		expect(snow1.isLeftDown({x: 3, y: 3})).to.be.true
		expect(snow1.isLeftDown({x: 4, y: 3})).to.be.true
		expect(snow1.isLeftDown({x: 4, y: 4})).to.be.true
		expect(snow1.isLeftDown({x: 0, y: 2})).to.be.false
		expect(snow1.isLeftDown({x: 1, y: 1})).to.be.false
		expect(snow1.isLeftDown({x: 2, y: 1})).to.be.false
		expect(snow1.isLeftDown({x: 3, y: 0})).to.be.false
		expect(snow1.isLeftDown({x: 0, y: 0})).to.be.false
	})
})

describe('Sector', () => {

})
