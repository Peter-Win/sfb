/**
 * Created by PeterWin on 06.01.2018.
 */
const {Counter} = require('./Counter')

class Missile extends Counter {
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
