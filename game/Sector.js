/**
 * /# \__/5 \__/# \__/0 \__/# \__/
 * \__/# \__/LF\__/RF\__/# \__/  \
 * /  \__/# \__/# \__/# \__/  \__/
 * \__/4 \__/# \__/# \__/1 \__/  \
 * /  \__/L \__/##\__/R \__/  \__/
 * \__/  \__/# \__/# \__/  \__/  \
 * /  \__/# \__/# \__/# \__/  \__/
 * \__/# \__/LR\__/RR\__/# \__/
 * /  \__/3 \__/# \__/2 \__/  \
 * Created by PeterWin on 08.01.2018.
 */

const RF = 0x01
const R =  0x02
const RR = 0x04
const LR = 0x08
const L =  0x10
const LF = 0x20

class Snowflake {
	/**
	 * @param {{x,y:number}} center	Центральная точка
	 */
	constructor(center) {
		this.x0 = center.x
		this.y0 = center.y
		this.oddColumn = center.x & 1
	}
	isRight(pos) {
		return pos.x >= this.x0
	}
	isLeft(pos) {
		return pos.x <= this.x0
	}

	/**
	 * Вычислить y для указанного x на прямой, которая проходит справа налево (вниз)
	 * @param {number} x *
	 * @return {number} y
	 */
	leftSlope(x) {
		const dx = x - this.x0
		const k = (dx + 1 - this.oddColumn) >> 1
		return this.y0 - k
	}

	/**
	 * Upper or equal then line from left to right (down)
	 * @param {{x,y:number}} pos	target position
	 * @return {boolean}	true, if upper or on line
	 */
	isLeftUp(pos) {
		const y = this.leftSlope(pos.x)
		return pos.y <= y
	}
	isLeftDown(pos) {
		const y = this.leftSlope(pos.x)
		return pos.y >= y
	}

	/**
	 * Вычислить y для указанного x на прямой, которая проходит слева направо (вниз)
	 * @param {number} x	*
	 * @return {number}	y
	 */
	rightSlope(x) {
		const dx = x - this.x0
		const k = (dx + this.oddColumn) >> 1
		return this.y0 + k
	}
	isRightUp(pos) {
		const y = this.rightSlope(pos.x)
		return pos.y <= y
	}
	isRightDown(pos) {
		const y = this.rightSlope(pos.x)
		return pos.y >= y
	}
}

const Sector = Object.freeze({
	/**
	 * Проверка попадания
	 * @param {{x,y,dir:number}} center *
	 * @param {{x,y:number}} target *
	 * @param {boolean} true, если в секторе
	 * @return {boolean} true, if in sector
	 */
	inSector(center, target) {
	},

	// (D2.2) COMBINED FIRING ARCS For simplicity, some firing arc designations are combined into a shorthand version.
	// Combined designations include:
	arc: {
		RF, R, RR, LR, L, LF,
		FA: LF | RF,
		RA: LR | RR,
		FX: L | LF | RF | R,
		RX: L | LR | RR | R,
		LS: LF | L | LR,
		RS: RF | R | RR,
		LLF: L | LF,
		RRF: R | RF,
		LLR: L | LR,
		RRR: R | RR,
		LFA: L | LF | RF,
		RFA: R | LF | RF,
		'360': RF | R | RR | LR | L | LF,
	},
	testPart: [
		/**
		 * 0 = RF
		 * @param {Snowflake} snow	Center position
		 * @param {{x,y:number}} pos	target position
		 * @return {boolean}	true, if pos in RF sector
		 */
		(snow, pos) => {
			return snow.isRight(pos) && snow.isLeftUp(pos)
		},
		// 1 = R
		(snow, pos) => {
			return snow.isRight(pos) && snow.isLeftDown(pos) && snow.isRightUp(pos)
		},
		// 2 = RR
		(snow, pos) => {
			return snow.isRight(pos) && snow.isRightDown(pos)
		},
		// 3 = LR
		(snow, pos) => {
			return snow.isLeft(pos) && snow.isRightDown(pos)
		},
		// 4 = L
		(snow, pos) => {
			return snow.isLeft(pos) && snow.isRightDown(pos) && snow.isLeftUp(pos)
		},
		// 5 = LF
		(snow, pos) => {
			return snow.isLeft(pos) && snow.isRightUp(pos)
		},
	],
})

module.exports = {Sector, Snowflake}
