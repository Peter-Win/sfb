/**
 * Created by PeterWin on 19.02.2018.
 */

const {Ship} = require('../Ship')
const {DeviceIds} = require('../../devices/DeviceIds')
const {Device} = require('../../devices/Device')
const {Warp} = require('../../devices/Warp')
const {Phaser2} = require('../../devices/Phaser2')
const {Disruptor} = require('../../devices/Disruptor')
const {DroneRack} = require('../../devices/DroneRack')

class CadetCruiser extends Ship {
	constructor() {
		super()
		this.img = 'KCBC'
		this.ssd = 'kcbc'
		this.turnMode = [8, 16]
		this.shield0 = [16, 12, 8, 8, 8, 12]

		const {devs} = this
		Device.create(devs, DeviceIds.Warp, Warp, {hp: 16})
		Device.create(devs, 'PH1', Phaser2, {id: '1', arc: 'FX'})
		Device.create(devs, 'PH2', Phaser2, {id: '2', arc: 'FX'})
		Device.create(devs, 'PH3', Phaser2, {id: '3', arc: 'LLR'})
		Device.create(devs, 'PH4', Phaser2, {id: '4', arc: 'RRR'})

		Device.create(devs, 'DisrA', Disruptor, {id: 'A'})
		Device.create(devs, 'DisrB', Disruptor, {id: 'B'})
		Device.create(devs, 'DRN', DroneRack)
	}
}
module.exports = {CadetCruiser}
