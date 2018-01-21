/**
 * Created by PeterWin on 15.01.2018.
 */
const {expect} = require('chai')
const {Energy} = require('./Energy')

describe('Energy', () => {
	it('parseELim', () => {
		expect(Energy.parseELim('*0')).to.be.eql({Lim: 0})
		expect(Energy.parseELim('*125.5')).to.be.eql({Lim: 125.5})
		expect(Energy.parseELim('W=1')).to.be.eql({W:1, Lim: 1})
		expect(Energy.parseELim('W=9;I=1;Lim=8')).to.be.eql({W: 9, I: 1, Lim: 8})
		expect(Energy.parseELim('')).to.be.eql({Lim:0})
		expect(() => {
			Energy.parseELim('abcd')
		}).to.throw(Error)
	})
})
