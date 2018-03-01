const {MovChart16} = require('../MovChart')
const {TurnChart} = require('../TurnChart')
const {ImpChart} = require('../ImpChart')
const KlingonCruiser = require('../ships/Klingon/CadetCruiser').CadetCruiser
const {ShipFCC} = require('../ships/ShipFCC')
const {Freighter} = require('../ships/Freighter')
const {ShipState} = require('../ships/Counter')
const {GameState} = require('../GameState')
const {mapSectorWidth, mapSectorHeight, turnLengthMedium} = require('../consts')
const {RaceType} = require('../Race')
const {CtrlSimple} = require('../ctrls/CtrlSimple')
const {isMainShipLost} = require('./common')
const {cadetSimple} = require('../handlers/cadetSimple')

const scenario04 = () => {
	const descr = {
		name: 'Cadet scenario #4: THE DAKOTA INCIDENT',
		width: mapSectorWidth * 2,
		height: 17,
		turnLength: turnLengthMedium,
		turnChart: TurnChart.Basic,
		impChart: ImpChart.Basic,
		movChart: MovChart16,
		sides: [
			{race: RaceType.Federation, enemy: 1},
			{race: RaceType.Klingon, enemy: 0},
			{race: 'Neutral', enemy: 1},
		],
		objects: [
			{
				uid: 'Main',
				name: 'Constellation',
				Type: ShipFCC,
				side: 0,
				x: 27, y: 16, dir: 5,
				speed: 16,
				handlers: cadetSimple,
			},
			...[
				{name: 'War', y: 16},
				{name: 'Fire', y: 15},
				{name: 'Death', y: 14},
			].map(({name, y}, i) => ({
				uid: `enemy${i}`,
				name,
				Type: KlingonCruiser,
				side: 1,
				x: 0, y, dir: 1,
				speed: 12,
				handlers: cadetSimple,
				ctrl: CtrlSimple,
			})),
			{
				uid: 'Dakota',
				name: 'SS Dakota',
				Type: Freighter,
				side: 2,
				x: 13, y: 4, dir: 0,
				speed: 0,
				ctrl: CtrlSimple,
			},
		],
		/**
		 * Проверка смены текущего состояния игры с Active на другое
		 * @param {Game} game	Main game object
		 * @return {void}
		 */
		checkState: (game) => {
			const ship = game.getShip('Main')
			if (isMainShipLost(game, ship, 1)) {
				return
			}
		},
	}
	return descr
}

module.exports = {scenario04}
