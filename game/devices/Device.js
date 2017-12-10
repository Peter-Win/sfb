/**
 * Created by PeterWin on 09.12.2017.
 */

class Device {
	constructor() {
		this.fsm = {}
		this.state = 'Begin'
		this.type = ''
		this.hp = 1
		this.energyWanted = 1.0e6
	}
}

module.exports = {Device}