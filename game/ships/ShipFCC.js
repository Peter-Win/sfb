/**
 * Created by PeterWin on 10.12.2017.
 */

const {Ship} = require('./Ship')
const {RaceType} = require('../Race')
const {Device} = require('../devices/Device')
const {Phaser1} = require('../devices/Phaser1')

class ShipFCC extends Ship {
	constructor() {
		super()
		this.img = 'FCC'

		this.devs.PH1 = Device.create(Phaser1, {id: '1', dir: 'FA'})
		this.devs.PH2 = Device.create(Phaser1, {id: '2', dir: 'LS'})
		this.devs.PH3 = Device.create(Phaser1, {id: '3', dir: 'RS'})
	}
}

module.exports = {ShipFCC}
