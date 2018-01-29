/**
 * Created by PeterWin on 09.12.2017.
 */
const {StateObject} = require('./StateObject')

class Side extends StateObject{
	constructor(name = '', lang = null) {
		super(Side.states.Active)
		this.name = name
		this.lang = lang
	}
	toSimple() {
		return {state: this.state}
	}
}
Side.states = Object.freeze({
	Active: 'Active',
	Winner: 'Winner',
	Loser: 'Loser',
})

module.exports = {Side}
