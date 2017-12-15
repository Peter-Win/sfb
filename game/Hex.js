/**
 * Created by PeterWin on 14.12.2017.
 */

const Hex = {
	// calculate position of near hex into each direction
	nearPos: [
		({x, y}) => ({x, y: y - 1}),
		({x, y}) => ({x: x + 1, y: y + (x & 1) - 1}),
		({x, y}) => ({x: x + 1, y: y + (x & 1)}),
		({x, y}) => ({x, y: y + 1}),
		({x, y}) => ({x: x - 1, y: y + (x & 1)}),
		({x, y}) => ({x: x - 1, y: y + (x & 1) - 1}),
	],

	/**
	 * Нормализация направления
	 * @param {number} dir	direction in wide diapasone
	 * @returns {number}	direction in diapasone [0;5]
	 */
	normalDir(dir) {
		const mod = dir % 6
		return mod < 0 ? 6 + mod : mod
	},

	// step to change direction [to][from]: -1, 0 or 1
	rotStep: [
		[ 0, -1, -1, -1,  1,  1],
		[ 1,  0, -1, -1, -1,  1],
		[ 1,  1,  0, -1, -1, -1],
		[-1,  1,  1,  0, -1, -1],
		[-1, -1,  1,  1,  0, -1],
		[-1, -1, -1,  1,  1,  0],
	],

}

module.exports = {Hex}
