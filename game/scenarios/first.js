/**
 * First scenario
 * Created by PeterWin on 03.12.2017.
 */
const {MovChart8} = require('../MovChart')
const {TurnChart} = require('../TurnChart')
const {ImpChart} = require('../ImpChart')
const {ShipFCC} = require('../ships/ShipFCC')
const {Missile} = require('../ships/Missile')
const {CtrlSimple} = require('../ctrls/CtrlSimple')
const {cadetSimple} = require('../handlers/cadetSimple')
const {ShipState} = require('../ships/Counter')
const {GameState} = require('../GameState')
const {mapSectorWidth, mapSectorHeight, turnLengthShort} = require('../consts')

const first = {
	name: 'Cadet scenario #1: Battle Drill',
	width: mapSectorWidth * 2,
	height: mapSectorHeight,
	turnLength: turnLengthShort,
	turnChart: TurnChart.Basic,
	impChart: ImpChart.Basic,
	movChart: MovChart8,
	sides: [
		{},
		{},
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
		if (game.objects.Con.state !== ShipState.Active) {
			game.setState(GameState.Fail)
			return
		}
		// Проверить дроны. Если есть хотя бы один в состоянии Lost, то миссия провалена
		const lostDrone = Object.keys(game.objects).find(key => {
			const counter = game.objects[key]
			return /^drone/.test(counter.uid) && counter.state === ShipState.Lost
		})
		if (lostDrone) {
			game.setState(GameState.Fail)
			return
		}
	},
}

module.exports = {first}
