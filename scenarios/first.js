/**
 * First scenario
 * Created by PeterWin on 03.12.2017.
 */
const {MovChart8} = require('../game/MovChart')
const {TurnChart} = require('../game/TurnChart')
const {ImpChart} = require('../game/ImpChart')
const {ShipFCC} = require('../game/ships/ShipFCC')

const first = {
	name: 'CADET SCENARIO #1: BATTLE DRILL',
	width: 14,
	height: 16,
	turnLength: 8,
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
			type: ShipFCC,
			side: 0,
			x: 0, y: 10, dir: 0,
		},
		// {
		// 	uid: 'DroneA',
		// 	name: 'Drone A',
		// 	side: 1,
		// 	x: 0, y: 0, dir: 2,
		// },
	],
}

module.exports = {first}
