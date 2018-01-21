/**
 * (E2.11) TYPE I - OFFENSIVE PHASER:
 * This is the most powerful type of phaser, causing considerable damage out to as many as eight hexes.
 * This is the phaser used by the Federation ship (the one you will use in Scenario #1).
 * It is also used by all of the ships in Cadet Training Handbook except the Klingon.
 * It is often written as simply phaser-1 or ph-1.
 *
 * Created by PeterWin on 07.01.2018.
 */
const {Phaser} = require('./Phaser')

class Phaser1 extends Phaser {
	constructor(devId) {
		super(devId)
		this.name = 'Phaser-1'
		this.weapon = 'PH-1'
		this.energyCost = 1
		this.table = Phaser1.table
	}
}

Phaser1.table = Object.freeze({
	0:  [9, 8, 7, 6, 5, 4],
	1:  [8, 7, 5, 4, 4, 4],
	2:  [7, 6, 5, 4, 4, 3],
	3:  [6, 5, 4, 4, 4, 3],
	4:  [5, 5, 4, 4, 3, 2],
	5:  [5, 4, 4, 3, 3, 2],
	8:  [4, 3, 3, 2, 1, 0],
	15: [3, 2, 1, 0, 0, 0],
	25: [2, 1, 0, 0, 0, 0],
	50: [1, 1, 0, 0, 0, 0],
	75: [1, 0, 0, 0, 0, 0],
})

module.exports = {Phaser1}
