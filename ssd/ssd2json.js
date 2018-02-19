const process = require('process')
const fs = require('fs')

const rxKey = /^[a-z0-9]$/i
const rxNum = /^[-0-9.]$/

const parse = source => {
	let pos = 0
	let c = ''
	let state = 'space'
	const result = {}
	const stack = [result]
	const keyStack = []
	let curKey = ''
	let curValue = ''
	let bSpecial = false
	const setState = (newName, offs = 0) => {
		state = newName
		pos += offs
	}
	const addValue = (bNumber) => {
		stack[0][curKey] = bNumber ? +curValue : curValue
	}
	const fsm = {
		space() {
			if (rxKey.test(c)) {
				curKey = ''
				return setState('key', -1)
			}
			if (c === '}') {
				let node = stack.shift()
				if (curKey === 'Cells' || '0000' in node) {
					node = Object.keys(node).reduce((acc, key) => {
						const item = node[key]
						acc.push(item)
						return acc
					}, [])
				}
				stack[0][keyStack.pop()] = node
			}
		},
		key() {
			if (rxKey.test(c)) {
				curKey += c
				return
			}
			if (stack.length === 1) {
				curKey = curKey.toLowerCase()
			}
			if (c === '=') {
				return setState('spaceValue')
			}
			if (c === '{') {
				stack.unshift({})
				keyStack.push(curKey)
				return setState('space')
			}
		},
		spaceValue() {
			curValue = ''
			if (c === '"') {
				return setState('string')
			}
			if (rxNum.test(c)) {
				return setState('number', -1)
			}
		},
		string() {
			if (bSpecial) {
				bSpecial = false
				switch (c) {
					case 'n':
						curValue += '\n'
						break
					case 't':
						curValue += '\t'
						break
					default:
						curValue += c
				}
			} else {
				if (c === '\\') {
					bSpecial = true
				} else if (c === '"') {
					addValue(false)
					return setState('space', 1)
				}
				curValue += c
			}
		},
		number() {
			if (rxNum.test(c)) {
				curValue += c
				return
			}
			addValue(true)
			return setState('space')
		}
	}
	while (pos < source.length) {
		c = source[pos++]
		fsm[state]()
	}
	return result
}

const convert = (sourceName, targetName) => {
	console.log(`convert ${sourceName} to ${targetName}`)
	const source = fs.readFileSync(sourceName, {encoding: 'utf8'})
	const result = parse(source)
	const resultText = JSON.stringify(result, null, '\t')
	fs.writeFileSync(targetName, resultText)
}

const main = () => {
	if (process.argv.length !== 4) {
		console.log('Usage: ssd2json source[.ssd] target[.json]')
	} else {
		convert(process.argv[2], process.argv[3])
	}
}
main()
