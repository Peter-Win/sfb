/*
 * (E2.12) TYPE II - Offensive-Defensive phaser.
 */
const {Phaser} = require('./Phaser')

class Phaser2 extends Phaser {
	constructor(devId) {
		super(devId)
		this.type = 'Phaser-2'
		this.weapon = 'PH-2'
		this.energyCost = 1
		this.table = Phaser2.table
	}
}

Phaser2.table = Object.freeze({
	0:  [6, 6, 6, 5, 5, 5],
	1:  [5, 5, 4, 4, 4, 3],
	2:  [5, 4, 4, 4, 3, 3],
	3:  [4, 4, 4, 3, 3, 3],
	8:  [3, 2, 1, 1, 0, 0],
	15: [2, 1, 1, 0, 0, 0],
	30: [1, 1, 0, 0, 0, 0],
	50: [1, 0, 0, 0, 0, 0],
})

module.exports = {Phaser2}
