/**
 * Сравнение двух величин для использования в Array.sort
 * @param {any} a	first value
 * @param {any} b	second value
 * @return {number}		-1, 0 or 1
 */
const cmp = (a, b) => {
	if (a < b) {
		return -1
	}
	if (a > b) {
		return 1
	}
	return 0
}

module.exports = {cmp}
