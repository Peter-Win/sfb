/**
 * Created by PeterWin on 29.01.2018.
 */
class XMessage {
	constructor(first, second) {
		if (typeof first === 'string') {
			this.text = first
			this.params = XMessage.filter(first, second)
		} else if (first && typeof first === 'object') {
			this.text = first.text
			this.params = XMessage.filter(first.text, first.params)
		} else {
			throw new Error('Invalid parameters for XMessage')
		}
	}
	toSimple() {
		return {text: this.text, params: this.params}
	}

	/**
	 * Оставить только те параметры, которые используются в тексте
	 * @param {string} text 	Text with possible parameters. Example: 'x={x}'
	 * @param {Object=} params	Optional parameters
	 * @return {{}}	Only parameters, used in text
	 */
	static filter(text, params) {
		if (!params) {
			return {}
		}
		const list = XMessage.split(text, params)
		const used = new Set()
		list.forEach(chunk => {
			if (Array.isArray(chunk)) {
				used.add(chunk[0])
			}
		})
		return Array.from(used.values()).reduce((acc, key) => {
			acc[key] = params[key]
			return acc
		}, {})
	}

	/**
	 * @param {string} text		Text with possible parameters. Example: 'x={x}'
	 * @param {Object<string,string>=} params	Possible parameters/ Example: {x: 22}
	 * @return {Array} *
	 */
	static split(text, params) {
		if (!params) {
			return [text]
		}
		const list = text.split('{')
		for (let i = 1; i < list.length; i++) {
			const chunk = list[i]
			const pos = chunk.indexOf('}')
			if (pos >= 0) {
				const pair = [chunk.slice(0, pos), chunk.slice(pos + 1)]
				if (pair[0] in params) {
					list[i] = pair
				}
			}
		}
		return list
	}
}

module.exports = {XMessage}
