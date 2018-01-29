/**
 * Created by PeterWin on 28.01.2018.
 */
const TurnMode = Object.freeze({
	Shuttle: [11, 23],
	AA: [8, 16, 24],
	A: [6, 12, 19, 26],
	B: [5, 10, 15, 21, 28],
	C: [4, 9, 14, 20, 27],
	D: [4, 8, 12, 17, 24],
	E: [3, 6, 10, 14, 20, 29],
	F: [3, 5, 9, 13, 17, 23, 29],
	/**
	 * Вычислить режим поворота по скорости и указанной таблице
	 * @param {number} speed	hexes per turn
	 * @param {Array<number>} table		for example: TurnMode.A
	 * @return {number}		calculated turn mode
	 */
	calc(speed, table) {
		let index = 0
		while (index < table.length && table[index] < speed) {
			index++
		}
		return index + 1
	},
})

module.exports = {TurnMode}
