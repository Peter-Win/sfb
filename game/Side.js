/**
 * Created by PeterWin on 09.12.2017.
 */
const {StateObject} = require('./StateObject')

class Side extends StateObject{
	/**
	 * @constructor
	 * @param {Object} params *
	 * @param {number} params.index 	Index of this side in game
	 * @param {string} params.race prefer RaceType.*
	 * @param {number=} params.enemy	Index of enemy side
	 * 		Если враг не указан, подразумевается две стороны друг против друга.
	 */
	constructor(params) {
		super(Side.states.Active)
		this.index = params.index
		this.name = params.race
		if ('enemy' in params) {
			this.enemy = params.enemy
		} else {
			this.enemy = this.index ^ 1
		}
	}
	toSimple() {
		return {state: this.state, name: this.name}
	}
	/**
	 * @param {number} sideIndex 	index of tested side
	 * @return {boolean} 	true, if enemy
	 */
	isEnemy(sideIndex) {
		return this.enemy === sideIndex
	}
}
Side.states = Object.freeze({
	Active: 'Active',
	Winner: 'Winner',
	Loser: 'Loser',
})

module.exports = {Side}
