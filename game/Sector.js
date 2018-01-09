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
})
