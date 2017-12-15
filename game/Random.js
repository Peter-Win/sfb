/**
 * Created by PeterWin on 14.12.2017.
 */

class Random {
	/**
	 * @returns {number} Random integer from 0 to 5
	 */
	static int6() {
		return Math.floor(Math.random() * 6)
	}
}

module.exports = {Random}
