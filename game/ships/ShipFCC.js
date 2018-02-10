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
		this.ssd = 'fcc'
		this.turnMode = [6, 16]

		const {devs} = this
		Device.create(devs, 'PH1', Phaser1, {id: '1', arc: 'FA'})
		Device.create(devs, 'PH2', Phaser1, {id: '2', arc: 'LS'})
		Device.create(devs, 'PH3', Phaser1, {id: '3', arc: 'RS'})
	}
}

module.exports = {ShipFCC}
