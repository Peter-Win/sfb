/**
 * Created by PeterWin on 06.01.2018.
 */
const {SfbObject} = require('./SfbObject')

class Missile extends SfbObject {
	constructor() {
		super()
		this.img = 'Drone'
		this.handlers.isCanChangeDir = () => true
	}
	isCanMove() {
		return true
	}
}

module.exports = {Missile}
