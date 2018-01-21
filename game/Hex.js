/**
 * Created by PeterWin on 14.12.2017.
 */

const Hex = Object.freeze({
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

	/**
	 * Вычислить противоположное направление
	 * @param {number} dir	source direction [0;5]
	 * @return {number}		inversed direction
	 */
	inverseDir(dir) {
		return (dir + 3) % 6
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

	/**
	 * Actual distance between two points.
	 * Порядок следования точек не имеет значения
	 * /B \__/B\\__/
	 * \__/B \__/A*\<- исходная точка
	 * /B \__/B/\__/
	 * \__/B/\__/A \
	 * /B/\__/C \__/
	 * \__/C \__/A \
	 * /C \__/C \__/
	 * Есть три зоны:
	 * A - Вертикальная линия, проходящая через точку. dist = abs(dy)
	 * B - два треугольника слева и справа от точки dist = abs(dx)
	 * C - четыре треугольника. dist = dx + вертикальное расстояние зоны B
	 * @param {{x,y:number}} src	одна точка
	 * @param {{x,y:number}} dst	другая точка
	 * @return {number}		Расстояние в гексах (целое от 0)
	 */
	actualDistance(src, dst) {
		const dy = Math.abs(src.y - dst.y)
		const x0 = src.x
		let dx = Math.abs(dst.x - x0)
		if (!dx) {
			// Если точки находятся на одной вертикальной линии, то расстояние равно dy
			return dy
		}
		let c
		if (x0 & 1) { // Для четных и нечетных колонок коэффициент коррекции отличается
			c = dst.y > src.y ? 1 : 0
		} else {
			c = dst.y < src.y ? 1 : 0
		}
		const k = (dx + c) >> 1
		if (dy > k) {
			dx += dy - k
		}
		return dx
	},
})

module.exports = {Hex}
