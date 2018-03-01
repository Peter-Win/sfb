const {expect} = require('chai')
const {Side} = require('./Side')
const {RaceType} = require('./Race')

describe('Side', () => {
	it('standard', () => {
		const side = new Side({
			index: 0,
			race: RaceType.Federation,
		})
		expect(side.index).to.be.equal(0)
		expect(side.name).to.be.equal('Federation')
		expect(side.enemy).to.be.equal(1)
	})
	it('with enemy', () => {
		const side = new Side({
			index: 2,
			race: 'Neutral',
			enemy: 0,
		})
		expect(side.index).to.be.equal(2)
		expect(side.name).to.be.equal('Neutral')
		expect(side.enemy).to.be.equal(0)
	})
})
