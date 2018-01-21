/**
 * Created by PeterWin on 20.01.2018.
 */
const {expect} = require('chai')
const {Phaser1} = require('./Phaser1')
const {Phaser} = require('./Phaser')

describe('Phaser1', () => {
	it('table', () => {
		const damages0 = Phaser.findDamages(Phaser1.table, 0)
		const average0 = Phaser.averageDamage(damages0)
		expect(average0).to.be.equal(6.5)
		expect(Phaser.averageDamage(Phaser.findDamages(Phaser1.table, 1))).to.be.closeTo(5.33, 0.01)
		expect(Phaser.averageDamage(Phaser.findDamages(Phaser1.table, 30))).to.be.closeTo(0.33, 0.01)
	})
})
