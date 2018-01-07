/**
 * (E2.11) TYPE I - OFFENSIVE PHASER:
 * This is the most powerful type of phaser, causing considerable damage out to as many as eight hexes.
 * This is the phaser used by the Federation ship (the one you will use in Scenario #1).
 * It is also used by all of the ships in Cadet Training Handbook except the Klingon.
 * It is often written as simply phaser-1 or ph-1.
 *
 * Created by PeterWin on 07.01.2018.
 */
const {Device} = require('./Device')

class Phaser1 extends Device {
	constructor() {
		super()
		this.name = 'Phaser-1'
		this.weap = 'PH-1'
		this.ecost = 1
	}
}

module.exports = {Phaser1}
