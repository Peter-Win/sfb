/**
 * Created by PeterWin on 03.02.2018.
 */
const cloneDeep = require('lodash/cloneDeep')
const {MovChart8} = require('../MovChart')
const {TurnChart} = require('../TurnChart')
const {ImpChart} = require('../ImpChart')
const {ShipFCC} = require('../ships/ShipFCC')
const KlingonCadetCruiser = require('../ships/Klingon/CadetCruiser').CadetCruiser
const {Missile} = require('../ships/Missile')
const {CtrlSeeking} = require('../ctrls/CtrlSeeking')
const {CtrlSimple} = require('../ctrls/CtrlSimple')
const {cadetSimple} = require('../handlers/cadetSimple')
const {ShipState} = require('../ships/Counter')
const {GameState} = require('../GameState')
const {mapSectorWidth, mapSectorHeight, turnLengthShort} = require('../consts')
const {RaceType} = require('../Race')

const {getTurnImp} = require('./common')
const {movAgent} = require('../agents/movAgent')
const {fireAgent} = require('../agents/fireAgent')

const second = {
	name: 'Cadet scenario #2: Under Attack',
	width: mapSectorWidth * 2,
	height: mapSectorHeight,
	turnLength: turnLengthShort,
	turnChart: TurnChart.Basic,
	impChart: ImpChart.Basic,
	movChart: MovChart8,
	sides: [
		{race: RaceType.Federation},
		{race: RaceType.Klingon},
	],
	objects: [
		{
			uid: 'Con',
			name: 'Constellation',
			Type: ShipFCC,
			side: 0,
			x: 8, y: 12, dir: 0,
			speed: 8,
			handlers: cadetSimple,
		},
		...[
			{id: 'A', x: 0, y: 8, dir: 2},
			{id: 'B', x: 2, y: 0, dir: 3},
			{id: 'C', x: 10, y: 0, dir: 3},
			{id: 'D', x: 16, y: 0, dir: 4},
			{id: 'E', x: 24, y: 0, dir: 4},
			{id: 'F', x: 27, y: 2, dir: 4},
			{id: 'G', x: 27, y: 7, dir: 4},
			{id: 'H', x: 27, y: 14, dir: 5},
		].map(({id, x, y, dir}) => ({
			uid: `drone${id}`,
			name: `Drone ${id}`,
			side: 1,
			x, y, dir,
			Type: Missile,
			ctrl: CtrlSeeking,
			targetId: 'Con',
			maxLife: 0,	// без ограничения на срок жизни
		})),
	],
	/**
	 * Проверка смены текущего состояния игры с Active на другое
	 * @param {Game} game	Main game object
	 * @return {void}
	 */
	checkState: (game) => {
		// Если Con выходит за границу карты или получает повреждение - это проигрыш
		const Con = game.getShip('Con')
		if (Con.isNotActive()) {
			const text = (Con.state === ShipState.Lost) ? '{name} left the map' : '{name} received critical damage'
			game.finish(1, {text, params: Con})
			return
		}
		let totalDrones = 0
		let deadDrones = 0
		Object.keys(game.objects).forEach(uid => {
			if (/^drone/.test(uid)) {
				totalDrones++
				const drone = game.getShip(uid)
				if (drone.isNotActive()) {
					deadDrones++
				}
			}
		})
		if (deadDrones === totalDrones) {
			game.finish(0, 'All targets are destroyed')
			return
		}
	},
}

/**
 * @param {Object=} params *
 * @param {string} params.race	Federation((deflt) | Klingon
 * @param {boolean=} params.demo	true, если демонстрационный режим
 * @return {Object} modified scenario 2
 */
const secondMod = (params = {}) => {
	const scenario = cloneDeep(second)
	const {race, demo} = params
	const ship = scenario.objects[0]
	if (race === RaceType.Klingon) {
		scenario.sides[0] = {race: RaceType.Klingon}
		scenario.sides[1] = {race: RaceType.Federation}
		ship.name = 'Destruction'
		ship.Type = KlingonCadetCruiser
		ship.disabledDevices = ['DRN']
		if (demo) {
			ship.ctrl = CtrlDemo02Klingon
		}
	} else { // Federation
		if (demo) {
			ship.ctrl = CtrlDemo02Federation
		}
	}
	return scenario
}

// Демо-Контроллер для крейсера Федерации
// Прохождение за минимальное время без получения каких-либо повреждений даже при самых неудачных обстоятельсвах
// 8 целей, 3 фазера. Это значит, что если стрелять только фазерами, то потребуется три хода.
// Выстрел фазером в соседний гекс гарантирует уничтожение цели.
// Фокус в траектории, которая позволяет приблизиться к каждой ракете вплотную.
// На втором ходу заряжаются фотонные торпеды. Но у них пенальти, поэтому вероятность попадания невелика
// Таким образом, торпеды используются как бонус. Они бьют по целям F и G. Если повезет, то победа за 2 хода
// Если нет, то они уничтожаются на первом импульсе 3-го хода

const pushFire = (action, devId, targetId) => {
	const index = fireAgent.findTrace(action, devId, targetId)
	if (index >= 0) {
		action.choices.push(index)
	}
}
const pushFireCases = (action, devId, targetIds) => {
	let i = 0
	while (i < targetIds.length) {
		const index = fireAgent.findTrace(action, devId, targetIds[i])
		if (index >= 0) {
			action.choices.push(index)
			return
		}
		i++
	}
}

const fedCommands = Object.freeze({
	Move_102: action => action.current = movAgent.Left,
	Fire_104: action => pushFire(action, 'PH2', 'droneA'),
	Move_106: action => action.current = movAgent.Right,
	Fire_107: action => pushFire(action, 'PH1', 'droneB'),
	Fire_108: action => pushFire(action, 'PH3', 'droneC'),
	Move_202: action => action.current = movAgent.Right,
	Fire_202: action => pushFire(action, 'PH3', 'droneD'),
	Move_205: action => action.current = movAgent.Right,
	Fire_206: action => pushFire(action, 'PH2', 'droneE'),
	Fire_207: action => {
		pushFire(action, 'PhotA', 'droneF')
		pushFire(action, 'PhotB', 'droneG')
	},
	Move_208: action => action.current = movAgent.Right,
	Fire_208: action => action.choices[0] = fireAgent.findTrace(action, 'PH1', 'droneH'),
	Fire_301: action => {
		pushFire(action, 'PH2', 'droneF')
		pushFire(action, 'PH3', 'droneG')
	},
})

class CtrlDemo02Federation extends CtrlSimple {
	/**
	 * @override
	 */
	onAction(game, action) {
		const stepId = getTurnImp(game)
		const key = `${action.name}_${stepId}`
		const handler = fedCommands[key]
		if (handler) {
			handler(action)
		}
		setTimeout(() => {
			super.onAction(game, action)
		}, 1000)
	}
}

const allDrones = ['droneC', 'droneD', 'droneE', 'droneF', 'droneG', 'droneH']

// Этот путь не идеальный. И есть вероятность гибели, если допущены промахи по А и С
const klinCommands = Object.freeze({
	Move_102: action => action.current = movAgent.Left,
	Fire_104: action => pushFire(action, 'PH3', 'droneA'), // Если ракета не уничтожена, она промахивается и летит следом
	Move_106: action => action.current = movAgent.Right,
	Fire_107: action => {
		pushFire(action, 'PH1', 'droneB')
		pushFire(action, 'DisrA', 'droneB')	// Небольшая страховка на случай промаха фазера
	},
	Fire_108: action => {
		pushFire(action, 'PH2', 'droneC')
		pushFire(action, 'DisrB', 'droneС')
		pushFire(action, 'PH4', 'droneD')
	},
	Move_202: action => action.current = movAgent.Right,
	Fire_202: action => pushFire(action, 'PH4', 'droneD'), // Второй выстрел по дрону D, который гарантирует его уничтожение
	Move_205: action => action.current = movAgent.Right,
	Fire_206: action => {
		pushFire(action, 'PH1', 'droneE')
		pushFire(action, 'DisrA', 'droneE')
	},
	Move_208: action => action.current = movAgent.Right,
	Fire_208: action => {
		pushFire(action, 'PH2', 'droneF')
		pushFire(action, 'PH3', 'droneG')
		pushFire(action, 'DisrB', 'droneH')	// Тут шансов мало
	},
	Move_301: action => action.current = movAgent.Right,
	Fire_301: action => pushFireCases(action, 'PH4', allDrones),
	Fire_302: action => pushFireCases(action, 'PH3', allDrones),
	Fire_401: action => pushFireCases(action, 'PH3', allDrones),
	Fire_402: action => pushFireCases(action, 'PH4', allDrones),
})

class CtrlDemo02Klingon extends CtrlSimple {
	/**
	 * @override
	 */
	onAction(game, action) {
		const stepId = getTurnImp(game)
		const key = `${action.name}_${stepId}`
		const handler = klinCommands[key]
		if (handler) {
			handler(action)
		}
		setTimeout(() => {
			super.onAction(game, action)
		}, 1000)
	}
}

module.exports = {second, secondMod}
