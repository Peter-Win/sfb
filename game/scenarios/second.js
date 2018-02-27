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
const {cadetSimple} = require('../handlers/cadetSimple')
const {ShipState} = require('../ships/Counter')
const {GameState} = require('../GameState')
const {mapSectorWidth, mapSectorHeight, turnLengthShort} = require('../consts')
const {RaceType} = require('../Race')

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
 * @return {Object} modified scenario 2
 */
const secondMod = (params = {}) => {
	const scenario = cloneDeep(second)
	const {race} = params
	if (race === RaceType.Klingon) {
		scenario.sides[0] = {race: RaceType.Klingon}
		scenario.sides[1] = {race: RaceType.Federation}
		scenario.objects[0].name = 'Destruction'
		scenario.objects[0].Type = KlingonCadetCruiser
	}
	return scenario
}

module.exports = {second, secondMod}
