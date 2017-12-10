/*
 * Unit tests for SfbObject
 */
const {expect} = require('chai')
const {SfbObject} = require('./SfbObject')

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
})