/**
 * Created by PeterWin on 16.12.2017.
 */

class StateObject {
	constructor(state) {
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
}

module.exports = {StateObject}
