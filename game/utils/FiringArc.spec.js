/**
 * Created by PeterWin on 09.01.2018.
 */
const {expect} = require('chai')
const {FiringArc, Snowflake} = require('./FiringArc')

// /00\__/20\__/40\
// \__/10\__/30\__/
// /01\__/21\__/41\
// \__/11\__/31\__/
// /02\__/22\__/42\
// \__/12\__/32\__/
// /03\__/23\__/43\
// \__/13\__/33\__/

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
		expect(snow.isRightDown({x: 0, y: 1})).to.be.true
		expect(snow.isRightDown({x: 2, y: 0})).to.be.false
		expect(snow.isRightDown({x: 3, y: 1})).to.be.false
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

describe('FiringArc', () => {
	// /00\__/20\__/40\
	// \__/10\__/30\__/
	// /01\__/21\__/41\
	// \__/11\__/31\__/
	// /02\__/22\__/42\
	// \__/12\@@/32\__/
	// /03\__/23\__/43\
	// \__/13\__/33\__/
	it('testPart', () => {
		const snow = new Snowflake({x: 2, y: 2})
		// 0 = RF
		expect(FiringArc.testPart[0](snow, {x: 3, y: 0})).to.be.true
		expect(FiringArc.testPart[0](snow, {x: 3, y: 2})).to.be.false
		expect(FiringArc.testPart[0](snow, {x: 1, y: 0})).to.be.false
		// 1 = R
		expect(FiringArc.testPart[1](snow, {x: 3, y: 0})).to.be.false
		expect(FiringArc.testPart[1](snow, {x: 3, y: 2})).to.be.true
		expect(FiringArc.testPart[1](snow, {x: 3, y: 3})).to.be.false
		// 2 = RR
		expect(FiringArc.testPart[2](snow, {x: 4, y: 2})).to.be.false
		expect(FiringArc.testPart[2](snow, {x: 3, y: 2})).to.be.true
		expect(FiringArc.testPart[2](snow, {x: 3, y: 3})).to.be.true
		expect(FiringArc.testPart[2](snow, {x: 1, y: 3})).to.be.false
		// 3 = LR
		expect(FiringArc.testPart[3](snow, {x: 3, y: 3})).to.be.false
		expect(FiringArc.testPart[3](snow, {x: 2, y: 4})).to.be.true
		expect(FiringArc.testPart[3](snow, {x: 1, y: 3})).to.be.true
		expect(FiringArc.testPart[3](snow, {x: 0, y: 2})).to.be.false
		// 4 = L
		expect(FiringArc.testPart[4](snow, {x: 1, y: 3})).to.be.false
		expect(FiringArc.testPart[4](snow, {x: 0, y: 3})).to.be.true
		expect(FiringArc.testPart[4](snow, {x: 0, y: 2})).to.be.true
		expect(FiringArc.testPart[4](snow, {x: 1, y: 1})).to.be.true
		expect(FiringArc.testPart[4](snow, {x: 1, y: 0})).to.be.false
		// 5 = LF
		expect(FiringArc.testPart[5](snow, {x: 0, y: 2})).to.be.false
		expect(FiringArc.testPart[5](snow, {x: 1, y: 1})).to.be.true
		expect(FiringArc.testPart[5](snow, {x: 1, y: 0})).to.be.true
		expect(FiringArc.testPart[5](snow, {x: 2, y: 0})).to.be.true
		expect(FiringArc.testPart[5](snow, {x: 3, y: 0})).to.be.false
	})
	// /00\__/20\__/40\
	// \__/10\__/30\__/
	// /01\__/21\__/41\
	// \__/11\__/31\__/
	// /02\__/22\__/42\
	// \__/12\@@/32\__/
	// /03\__/23\__/43\
	// \__/13\__/33\__/
	it('testArc, simple cases', () => {
		const p22 = {x: 2, y: 2}
		// RF
		expect(FiringArc.testArc(FiringArc.arc.RF, p22, {x: 1, y: 0})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.RF, p22, {x: 2, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RF, p22, {x: 4, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RF, p22, {x: 3, y: 3})).to.be.false
		// R
		expect(FiringArc.testArc(FiringArc.arc.R, p22, {x: 2, y: 0})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.R, p22, {x: 4, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.R, p22, {x: 3, y: 2})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.R, p22, {x: 3, y: 3})).to.be.false
		// RR
		expect(FiringArc.testArc(FiringArc.arc.RR, p22, {x: 4, y: 1})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.RR, p22, {x: 3, y: 2})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RR, p22, {x: 2, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RR, p22, {x: 1, y: 3})).to.be.false
		// LR
		expect(FiringArc.testArc(FiringArc.arc.LR, p22, {x: 3, y: 2})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.LR, p22, {x: 2, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LR, p22, {x: 0, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LR, p22, {x: 0, y: 2})).to.be.false
		// L
		expect(FiringArc.testArc(FiringArc.arc.L, p22, {x: 2, y: 3})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.L, p22, {x: 0, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.L, p22, {x: 0, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.L, p22, {x: 1, y: 0})).to.be.false
		// LF
		expect(FiringArc.testArc(FiringArc.arc.LF, p22, {x: 0, y: 2})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.LF, p22, {x: 0, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LF, p22, {x: 2, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LF, p22, {x: 3, y: 0})).to.be.false
	})
	// /00\__/20\__/40\__/
	// \__/10\__/30\__/50\
	// /01\__/21\__/41\__/
	// \__/11\__/31\__/51\
	// /02\__/22\**/42\__/
	// \__/12\__/32\__/52\
	// /03\__/23\__/43\__/
	// \__/13\__/33\__/53\
	it('testArc, complex cases', () => {
		const p31 = {x:3, y: 1}
		// FA
		expect(FiringArc.testArc(FiringArc.arc.FA, p31, {x: 0, y: 1})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.FA, p31, {x: 0, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.FA, p31, {x: 5, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.FA, p31, {x: 5, y: 1})).to.be.false
		// RA
		expect(FiringArc.testArc(FiringArc.arc.RA, p31, {x: 0, y: 2})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.RA, p31, {x: 0, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RA, p31, {x: 5, y: 2})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RA, p31, {x: 5, y: 1})).to.be.false
		// FX
		expect(FiringArc.testArc(FiringArc.arc.FX, p31, {x: 1, y: 3})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.FX, p31, {x: 0, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.FX, p31, {x: 1, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.FX, p31, {x: 4, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.FX, p31, {x: 5, y: 2})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.FX, p31, {x: 1, y: 3})).to.be.false
		// RX
		expect(FiringArc.testArc(FiringArc.arc.RX, p31, {x: 2, y: 0})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.RX, p31, {x: 0, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RX, p31, {x: 1, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RX, p31, {x: 5, y: 2})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RX, p31, {x: 4, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RX, p31, {x: 4, y: 0})).to.be.false
		// LS
		expect(FiringArc.testArc(FiringArc.arc.LS, p31, {x: 4, y: 0})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.LS, p31, {x: 3, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LS, p31, {x: 0, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LS, p31, {x: 1, y: 2})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LS, p31, {x: 3, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LS, p31, {x: 4, y: 3})).to.be.false
		// RS
		expect(FiringArc.testArc(FiringArc.arc.RS, p31, {x: 2, y: 0})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.RS, p31, {x: 3, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RS, p31, {x: 5, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RS, p31, {x: 4, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RS, p31, {x: 3, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RS, p31, {x: 2, y: 3})).to.be.false
	})
	// /00\__/20\__/40\__/
	// \__/10\__/30\__/50\
	// /01\__/21\__/41\__/
	// \__/11\__/31\__/51\
	// /02\__/22\__/42\__/
	// \__/12\@@/32\__/52\
	// /03\__/23\__/43\__/
	// \__/13\__/33\__/53\
	it('testArc, more complex cases', () => {
		const p22 = {x:2, y: 2}
		// LLF
		expect(FiringArc.testArc(FiringArc.arc.LLF, p22, {x: 3, y: 0})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.LLF, p22, {x: 2, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LLF, p22, {x: 0, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LLF, p22, {x: 0, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LLF, p22, {x: 1, y: 3})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.LLF, p22, {x: 5, y: 3})).to.be.false
		// RRF
		expect(FiringArc.testArc(FiringArc.arc.RRF, p22, {x: 1, y: 1})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.RRF, p22, {x: 2, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RRF, p22, {x: 5, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RRF, p22, {x: 5, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RRF, p22, {x: 4, y: 4})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.RRF, p22, {x: 1, y: 3})).to.be.false
		// LLR
		expect(FiringArc.testArc(FiringArc.arc.LLR, p22, {x: 0, y: 0})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.LLR, p22, {x: 1, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LLR, p22, {x: 0, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LLR, p22, {x: 1, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LLR, p22, {x: 2, y: 4})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LLR, p22, {x: 3, y: 3})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.LLR, p22, {x: 4, y: 2})).to.be.false
		// RRR
		expect(FiringArc.testArc(FiringArc.arc.RRR, p22, {x: 4, y: 0})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.RRR, p22, {x: 5, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RRR, p22, {x: 4, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RRR, p22, {x: 2, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RRR, p22, {x: 1, y: 3})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.RRR, p22, {x: 0, y: 0})).to.be.false
		// LFA
		expect(FiringArc.testArc(FiringArc.arc.LFA, p22, {x: 5, y: 1})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.LFA, p22, {x: 4, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LFA, p22, {x: 2, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LFA, p22, {x: 0, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LFA, p22, {x: 0, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.LFA, p22, {x: 0, y: 4})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.LFA, p22, {x: 2, y: 3})).to.be.false
		// RFA
		expect(FiringArc.testArc(FiringArc.arc.RFA, p22, {x: 0, y: 2})).to.be.false
		expect(FiringArc.testArc(FiringArc.arc.RFA, p22, {x: 0, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RFA, p22, {x: 2, y: 0})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RFA, p22, {x: 4, y: 1})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RFA, p22, {x: 5, y: 3})).to.be.true
		expect(FiringArc.testArc(FiringArc.arc.RFA, p22, {x: 4, y: 4})).to.be.false
		// 360
		const fullArc = FiringArc.arc['360']
		expect(FiringArc.testArc(fullArc, {x:1, y: 3}, {x: 0, y: 0})).to.be.true
		expect(FiringArc.testArc(fullArc, {x:4, y: 2}, {x: 0, y: 3})).to.be.true
		expect(FiringArc.testArc(fullArc, {x:0, y: 0}, {x: 5, y: 3})).to.be.true
		expect(FiringArc.testArc(fullArc, {x:3, y: 4}, {x: 4, y: 1})).to.be.true
	})
	it('rotateArc', () => {
		expect(FiringArc.rotateArc(FiringArc.arc.RF, 0)).to.be.equal(FiringArc.arc.RF)
		expect(FiringArc.rotateArc(FiringArc.arc.RF, 1)).to.be.equal(FiringArc.arc.R)
		expect(FiringArc.rotateArc(FiringArc.arc.RF, 2)).to.be.equal(FiringArc.arc.RR)
		expect(FiringArc.rotateArc(FiringArc.arc.RF, 3)).to.be.equal(FiringArc.arc.LR)
		expect(FiringArc.rotateArc(FiringArc.arc.RF, 4)).to.be.equal(FiringArc.arc.L)
		expect(FiringArc.rotateArc(FiringArc.arc.RF, 5)).to.be.equal(FiringArc.arc.LF)
		expect(FiringArc.rotateArc(FiringArc.arc.RS, 3)).to.be.equal(FiringArc.arc.LS)
	})
})
