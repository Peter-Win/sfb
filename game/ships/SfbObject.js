/**
 * Created by PeterWin on 09.12.2017.
 */
const {Rules} = require('../Rules')

const ShipState = {
	Active: 'Active',
	Dead: 'Dead',
	Lost: 'Lost',
	Exploded: 'Exploded',
	Wait: 'Wait',
}

class SfbObject {
	constructor() {
		this.x = 0
		this.y = 0
		this.dir = 0
		this.uid = ''
		this.state = ShipState.Active
		this.speed = 1
		this.turnMode = 1
		this.turnCounter = 100
		this.moveAction = ''
		this.action = ''
		this.name = ''
		this.type = ''
		this.side = 0
		this.tractorSrc = ''	// UID of tractor beam source
		this.canBeTractored = 1	// 2 if unit can be towed from map
		this.fsm = {}
	}
	/**
	 * @return {Object} FSM object
	 */
	getFsm() {
		return this.fsm
	}

	init() {

	}

	/**
	 * Создать объект из описания
	 * @param {Object} description Описание, которое используется в сценариях
	 * @returns {SfbObject} Корабль или другой объект
	 */
	static create(description) {

	}
}

module.exports = {SfbObject, ShipState}
