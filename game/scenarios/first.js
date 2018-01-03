/**
 * First scenario
 * Created by PeterWin on 03.12.2017.
 */
const {MovChart8} = require('../MovChart')
const {TurnChart} = require('../TurnChart')
const {ImpChart} = require('../ImpChart')
const {ShipFCC} = require('../ships/ShipFCC')
const {cadetSimple} = require('../handlers/cadetSimple')
const {ShipState} = require('../ships/SfbObject')
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
			x: 0, y: 9, dir: 0,
			speed: 8,
			handlers: cadetSimple,
		},
		// {
		// 	uid: 'DroneA',
		// 	name: 'Drone A',
		// 	side: 1,
		// 	x: 0, y: 0, dir: 2,
		// },
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
		}
	}
}

module.exports = {first}
