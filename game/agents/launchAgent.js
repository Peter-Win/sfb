/**
 * Агент, выполняющий старт ракет и плазменных торпед
 * Структура акции:
 * devId, targetId, dirs:{x,y,dir}[]
 * Если контроллер принял решение о пуске, заполняется result: devId => {targetId, dir}
 */
const assert = require('assert')
const {Agent} = require('./Agent')
const {Hex} = require('../Hex')

class LaunchAgent extends Agent {
	constructor() {
		super('Launch')
	}

	createPoint({game, ship, dev, target}) {
		const targetDir = Hex.locateDir(ship, target)[0]
		const point = {devId: dev.devId, targetId: target.uid, targetDir, dirs:[]}
		for (let dir = 0; dir < 6; dir++) {
			const rec = Hex.nearPos[dir](ship)
			if (game.inMap(rec)) {
				rec.dir = dir
				point.dirs.push(rec)
			}
		}
		return point
	}
	/**
	 * Включить список устройств для стрельбы.
	 * Для каждого нужно выбрать цель и направление
	 * @override
	 */
	createAction(params) {
		const {game, ship} = params
		const points = ship.buildLaunchTargets(game)
		// Если доступных целей нет, то акция не будет создана
		if (!points.length) {
			return null
		}
		const action = this.newActionObject(ship.uid)
		action.points = points	// Список возможных вариантов стрельбы. Только для чтения в контроллере.
		action.result = []	// Индексы выбранных точек. Главное, чтобы devId входили в points
		return action
	}

	/**
	 * @override
	 */
	mergeAction(alienAction, nativeAction) {
		// Единственное, что можно принять от клиента - список выбранных точек
		nativeAction.result = alienAction.result
	}

	/**
	 * @override
	 */
	execAction(game, action) {
		assert(game, 'Invalid game object')
		assert('result' in action, 'Invalid launch action')
		const {result, points} = action
		Object.keys(result).forEach(devId => {
			const {targetId, dir} = result[devId]
			// Если игрок ничего не подтасовал, то результат входит в исх. точки
			const testPoint = points.find(pt => pt.devId === devId && pt.targetId === targetId)
			if (testPoint) {
				// Запуск
				const ship = this.getShip(game, action)
				const device = ship.getDevice(devId)
				device.launch(game, ship, targetId, dir)
			} else {
				console.warn('launchAgent.execAction: Invalid result: ', JSON.stringify(result))
			}
		})
	}
}

const launchAgent = new LaunchAgent()

module.exports = {launchAgent}
