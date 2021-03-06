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

	relativeDir: [
		[0, 1, 2, 3, -2, -1],
		[-1, 0, 1, 2, 3, -2],
		[-2, -1, 0, 1, 2, 3],
		[3, -2, -1, 0, 1, 2],
		[2, 3, -2, -1, 0, 1],
		[1, 2, 3, -2, -1, 0],
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

	/**
	 * Определить направление от одного юнита до другого.
	 * Если юнит находится на разделительной оси, то возвращается два значения
	 * @param {{x,y:number}} from 	Исходная точка
	 * @param {{x,y:number}} to		Конечная точка
	 * @return {number[]}	direction 0-5. Одно или два значения. А если точки совпадают, то никаких точек
	 * 		В списке первое значение всегда меньше второго
	 * \__/05\__/  \__/  \__/01\
	 * /  \__/  \__/  \__/  \__/
	 * \__/ 5\__/ 0\__/  \__/  \
	 * / 5\__/05\__/ 0\__/01\__/
	 * \__/ 5\__/ 0\__/ 0\__/70\
	 * /*5\__/ 5\__/ 0\__/ 1\__/
	 * \__/*5\__/05\__/01\__/*1\
	 * /02\__/*5\__/ 0\__/*1\__/
	 * \__/12\__/*5\__/*1\__/72\
	 * /45\__/45\__/**\__/12\__/
	 * \__/13\__/ 4\__/ 2\__/73\
	 * /04\__/ 4\__/ 3\__/ 2\__/
	 * \__/  \__/  \__/  \__/ 2\
	 * /  \__/  \__/ 3\__/  \__/
	 */
	locateDir(from, to) {
		const x0 = from.x
		const y0 = from.y
		const x1 = to.x
		const y1 = to.y
		const dX = x1 - x0
		const dY = y1 - y0
		if (dY === 0) {
			// Если y совпадает...
			if (x0 === x1) {
				return []	// точки совпали
			}
			// Если x для обоих точек четный или нечетный, то они находятся в двух секторах
			if ((x0 & 1) === (x1 & 1)) {
				return x1 > x0 ? [1, 2] : [4, 5]
			}
			if (x1 > x0) {
				return x0 & 1 ? [1] : [2]
			}
			return x0 & 1 ? [5] : [4]
		}
		if (dX === 0) {
			return dY < 0 ? [0] : [3]
		}
		// dX       | 1 | 2 | 3 | 4 | 5 | 6 | 7  | 8  | 9
		// dY / чет | 2 | 3 | 5 | 6 | 8 | 9 | 11 | 12 | 14  (dX+1)*3/2-1
		// dY / неч | 1 | 3 | 4 | 6 | 7 | 9 | 10 | 12 | 13
		// dY \ чет | 1 | 3 | 4 | 6 | 7 | 9 | 10 | 12 | 13
		// dY \ неч | 2 | 3 | 5 | 6 | 8 | 9 | 11 | 12 | 14
		// чет dX: dY = dX * 3 / 2
		const dxRem = dX & 1
		const k = (dX + dxRem) * 3 / 2
		// Границы с вертикальными секторами
		// Сначала слева направо снизу вверх
		const dA = dxRem ? (k - 1 - (x0 & 1)) : k
		const yA = y0 - dA
		// console.log(`(${x0},${y0})->(${x1},${y1}), dxRem=${dxRem}, k=${k}, dA=${dA}, yA=${yA}`)
		if (y1 === yA) {
			// Попали в гекс, который отностися к двум соседним секторам
			return dX > 0 ? [0, 1] : [3, 4]
		}
		if (dX > 0 && y1 < yA) {
			return [0]	// Сектор 0 справа от вертикали
		}
		if (dX < 0 && y1 > yA) {
			return [3]	// Сектор 3 слева от оси
		}
		// слева направо сверху вниз
		const dB = dxRem ? ((k - 2 + (x0 & 1))) : k
		const yB = y0 + dB
		if (y1 === yB) {
			return dX > 0 ? [2, 3] : [0, 5]		// попадание в смежный гекс
		}
		if (dX > 0 && y1 > yB) {
			return [3]	// Сектор 3 справа от оси
		}
		if (dX < 0 && y1 < yB) {
			return [0]	//Сектор 0 слева от оси
		}
		// теперь остались только сектора, которые можно опознать по осям
		if (dX > 0) {
			return dY < 0 ? [1] : [2]
		}
		return dY > 0 ? [4] : [5]

	},

	/**
	 * Вычислить сторону, в которую приходится удар ракеты
	 * (D3.401) SEEKING WEAPONS: In the seeking weapons, this is the shield facing the hex
	 * that the weapon approached from.
	 * @param {number} sourceDir	0-5	Направление удара
	 * @param {number} targetDir	0-5 Направление цели
	 * @return {number}	0-5	Номер стороны цели
	 */
	calcStrikeSide(sourceDir, targetDir) {
		const inverseDir = Hex.inverseDir(sourceDir)
		return Hex.normalDir(inverseDir - targetDir)
	},

	/**
	 * Вычислить сторону попадания лучевого оружия
	 * (D3.402) DIRECT-FIRE WEAPONS: For direct-fire weapons, the line of fire must be determined.
	 * To do this simple draw an imaginary line from the center of the target ship's hex to
	 * the center of the firing ship's hex, and determine which shield is crossed.
	 * @param {{x,y,dir:number}} source *
	 * @param {{x,y,dir:number}} target *
	 * @return {number}		0..5
	 */
	calcBeamStrikeSide(source, target) {
		const dirs = Hex.locateDir(source, target)
		if (dirs.length === 0) {
			return Hex.calcStrikeSide(source.dir, target.dir)
		}
		if (dirs.length === 1) {
			return Hex.calcStrikeSide(dirs[0], target.dir)
		}
		// (D3.41) SHIELD BOUNDARIES: In the event that the line from firing to target hex
		// travels exactly along a hex side, then the shield actually hit is resolved as follows:
		// Стандартные правила слишком сложны. Поэтому использую свои:
		// - Если скорости разные, то используем большую. Если одинаковые, то цель
		// выбранный юнит перемещаем на один гекс вперед и снова ищем пересечение
		let newSource = source
		let newTarget = target
		if (source.speed > target.speed) {
			newSource = Hex.nearPos[source.dir](source)
		} else {
			newTarget = Hex.nearPos[target.dir](target)
		}
		const dirs2 = Hex.locateDir(newSource, newTarget)
		return Hex.calcStrikeSide(dirs2[0], target.dir)
	},

})

module.exports = {Hex}
