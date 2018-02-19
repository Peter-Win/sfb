/**
 * First scenario
 * Created by PeterWin on 03.12.2017.
 */
const cloneDeep = require('lodash/cloneDeep')
const {MovChart8} = require('../MovChart')
const {TurnChart} = require('../TurnChart')
const {ImpChart} = require('../ImpChart')
const {ShipFCC} = require('../ships/ShipFCC')
const KlingonCruiser = require('../ships/Klingon/CadetCruiser').CadetCruiser
const {Missile} = require('../ships/Missile')
const {CtrlSimple} = require('../ctrls/CtrlSimple')
const {cadetSimple} = require('../handlers/cadetSimple')
const {ShipState} = require('../ships/Counter')
const {GameState} = require('../GameState')
const {mapSectorWidth, mapSectorHeight, turnLengthShort} = require('../consts')
const {RaceType} = require('../Race')

const first = {
	name: 'Cadet scenario #1: Battle Drill',
	width: mapSectorWidth,
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
			x: 0, y: 10, dir: 0,
			speed: 8,
			handlers: cadetSimple,
			disabledDevices: ['PhotA', 'PhotB'],
		},
		{
			uid: 'droneA',
			name: 'Drone A',
			Type: Missile,
			side: 1,
			x: 0, y: 0, dir: 2,
			ctrl: CtrlSimple,
		},
		{
			uid: 'droneB',
			name: 'Drone B',
			Type: Missile,
			side: 1,
			x: 1, y: 6, dir: 1,
			ctrl: CtrlSimple,
		},
		{
			uid: 'droneC',
			name: 'Drone C',
			Type: Missile,
			side: 1,
			x: 6, y: 4, dir: 3,
			ctrl: CtrlSimple,
		},
		{
			uid: 'droneD',
			name: 'Drone D',
			Type: Missile,
			side: 1,
			x: 7, y: 9, dir: 5,
			ctrl: CtrlSimple,
		},
		{
			uid: 'droneE',
			name: 'Drone E',
			Type: Missile,
			side: 1,
			x: 7, y: 0, dir: 3,
			ctrl: CtrlSimple,
		},
	],
	/**
	 * Проверка смены текущего состояния игры с Active на другое
	 * @param {Game} game	Main game object
	 * @return {void}
	 */
	checkState: (game) => {
		// Если Con выходит за границу карты - это проигрыш
		const ship = game.getShip('Con')
		if (ship.isNotActive()) {
			game.finish(1, {text: '{name} left the map', params: ship})
			return
		}
		let exploded = 0
		// Проверить дроны. Если есть хотя бы один в состоянии Lost, то миссия провалена
		const lostDrone = Object.keys(game.objects).find(key => {
			const counter = game.objects[key]
			if (counter.state === ShipState.Exploded) {
				exploded++
			}
			return /^drone/.test(counter.uid) && counter.state === ShipState.Lost
		})
		if (lostDrone) {
			game.finish(1, {text: '{name} left the map', params: game.getShip(lostDrone)})
			return
		}
		if (exploded === 5) {
			game.finish(0, 'All targets are destroyed')
			return
		}
	},
}

const firstMod = params => {
	const {race} = params
	const scenario = cloneDeep(first)
	const {objects} = scenario
	if (race === RaceType.Klingon) {
		scenario.sides = [
			{race: RaceType.Klingon},
			{race: RaceType.Federation},
		]
		objects.forEach((item, i) => {
			objects[i] = Object.assign({}, item)
			if (i === 0) {
				Object.assign(objects[i], {
					name: 'Destruction',
					Type: KlingonCruiser,
					disabledDevices: null,
				})
			}
		})
	}
	return scenario
}

module.exports = {first, firstMod}
