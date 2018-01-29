/**
 * Created by PeterWin on 29.01.2018.
 */
const {expect} = require('chai')
const {XMessage} = require('./XMessage')

describe('XMessage', () => {
	it('split', () => {
		expect(XMessage.split('a={x}, b={y}.', {x: 1, y: 2})).to.be.eql(['a=', ['x', ', b='], ['y','.']])
		expect(XMessage.split('{x={a}}', {a: 31})).to.be.eql(['', 'x=', ['a', '}']])
		expect(XMessage.split('hello')).to.be.eql(['hello'])
	})

	it('filter', () => {
		expect(XMessage.filter('hello', {x: 1, y: 2})).to.be.eql({})
		expect(XMessage.filter('x:{x}', {x: 1, y: 2})).to.be.eql({x: 1})
		expect(XMessage.filter('x:{x}, y:{y}', {x: 1})).to.be.eql({x: 1})
	})

	it('constructor', () => {
		const msg1 = new XMessage('hello')
		expect(msg1).to.have.property('text', 'hello')
		expect(msg1.params).to.be.eql({})

		const msg2 = new XMessage('({x}, {y})', {x: 22, y: 33, z: 44})
		expect(msg2).to.have.property('text', '({x}, {y})')
		expect(msg2.params).to.be.eql({x: 22, y: 33})
	})
})
