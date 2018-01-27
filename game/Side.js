/**
 * Created by PeterWin on 09.12.2017.
 */
const {StateObject} = require('./StateObject')

class Side extends StateObject{
	constructor() {
		super(Side.states.Active)
		this.name = ''
	}
}
Side.states = Object.freeze({
	Active: 'Active',
	Winner: 'Winner',
	Loser: 'Loser',
})

module.exports = {Side}
