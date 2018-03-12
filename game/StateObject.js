/**
 * Created by PeterWin on 16.12.2017.
 */
const assert = require('assert')

class StateObject {
	constructor(state) {
		assert(state && typeof state === 'string', 'Invalid state: '+JSON.stringify(state))
		this.state = state
	}

	/**
	 * Set new state
	 * @param {string} newState new state
	 * @returns {void}
	 */
	setState(newState) {
		this.state = newState
	}

	isActive() {
		return this.state === 'Active'
	}

	isNotActive() {
		return !this.isActive()
	}
}

module.exports = {StateObject}
