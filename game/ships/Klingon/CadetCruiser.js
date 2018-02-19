/**
 * Created by PeterWin on 19.02.2018.
 */

const {Ship} = require('../Ship')
const {DeviceIds} = require('../../devices/DeviceIds')
const {Device} = require('../../devices/Device')
const {Warp} = require('../../devices/Warp')

class CadetCruiser extends Ship {
	constructor() {
		super()
		this.img = 'KCBC'
		this.ssd = 'kcbc'
		this.turnMode = [8, 16]
		this.shield0 = [16, 12, 8, 8, 8, 12]

		const {devs} = this
		Device.create(devs, DeviceIds.Warp, Warp, {hp: 16})
	}
}
module.exports = {CadetCruiser}
