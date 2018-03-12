/*
 * CADET SCENARIO #3: CONVOY RAID
 * The neutral planet of Iridima has refused to sell its iridium to
 * the Klingon Empire, preferring instead to sell it to the Federation.
 * This metal is vitally important to starship construction, and while
 * the supply from Iridima represents only a fraction of that available
 * to the Federation or the Empire, it could make an important
 * difference. A convoy of four freighters is now headed toward the
 * Federation border. Your battlecruiser, the Imperial Klingon
 * Vessel Destruction, is assigned to pursue and destroy this
 * convoy, preventing it from reaching Federation territory. This will
 * teach the Iridimans that they will sell their iridium to the Empire or
 * to no one at all. This scenario can be replayed with minor
 * variations; see the section on INSTANT REPLAY below.
 */
const cloneDeep = require('lodash/cloneDeep')
const {MovChart8} = require('../MovChart')
const {TurnChart} = require('../TurnChart')
const {ImpChart} = require('../ImpChart')
const KlingonCruiser = require('../ships/Klingon/CadetCruiser').CadetCruiser
const {ShipFCC} = require('../ships/ShipFCC')
const {Freighter} = require('../ships/Freighter')
const {CtrlFreighterSimple} = require('../ctrls/CtrlFreighterSimple')
const {cadetSimple} = require('../handlers/cadetSimple')
const {ShipState} = require('../ships/Counter')
const {GameState} = require('../GameState')
const {mapSectorWidth, mapSectorHeight, turnLengthShort} = require('../consts')
const {RaceType} = require('../Race')
const {isMainShipLost} = require('./common')

const baseScenario = Object.freeze({
	name: 'Cadet scenario #3: Convoy Raid',
	width: mapSectorWidth * 2,
	height: mapSectorHeight,
	turnLength: turnLengthShort,
	turnChart: TurnChart.Basic,
	impChart: ImpChart.Basic,
	movChart: MovChart8,
	sides: [
		{race: RaceType.Klingon},
		{race: 'Iridima'},
	],
	objects: [
		{
			uid: 'Main',
			name: 'Destruction',
			Type: KlingonCruiser,
			side: 0,
			x: 0, y: 3, dir: 2,
			speed: 8,
			handlers: cadetSimple,
			canChangeSpeed: true,
		},
		...[
			{id: 'A', x: 0, y: 11, fireImp: 1},
			{id: 'B', x: 0, y: 9, fireImp: 3},
			{id: 'C', x: 2, y: 8, fireImp: 5},
			{id: 'D', x: 2, y: 10, fireImp: 7},
		].map(({id, x, y, fireImp}) => ({
			uid: `freighter${id}`,
			name: `Freighter ${id}`,
			Type: Freighter,
			side: 1,
			x, y, dir: 1,
			speed: 4,
			ctrl: new CtrlFreighterSimple({fireImp, enemySide: 0}),
		})),
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
		let deadFreighters = 0
		let totalFreighters = 0
		let leftFreighter = null
		Object.keys(game.objects).forEach(uid => {
			if (/^freighter/.test(uid)) {
				const freighter = game.getShip(uid)
				totalFreighters++
				switch (freighter.state) {
					case ShipState.Lost:
						if (freighter.x === baseScenario.width) {
							leftFreighter = freighter
						} else {
							deadFreighters++
						}
						break
					case ShipState.Dead:
						deadFreighters++
						break
				}
			}
		})
		if (leftFreighter) {
			game.finish(1, {text: '{name} left the map', params: leftFreighter})
			return
		}
		if (totalFreighters === deadFreighters) {
			game.finish(0, {text: 'All enemies are destroyed'})
			return
		}
	},
})

/**
 * @param {Object} params *
 * @param {string} params.race Klingon(deflt)|Federation
 * @return {Object} scenario III
 */
const scenario03 = (params = {}) => {
	const scenario = cloneDeep(baseScenario)
	const {race} = params
	if (race === RaceType.Federation) {
		scenario.sides[0].race = race
		const shipDescr = scenario.objects[0]
		shipDescr.name = 'Constellation'
		shipDescr.Type = ShipFCC
	}
	return scenario
}

module.exports = {scenario03}
