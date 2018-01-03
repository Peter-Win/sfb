/**
 * Created by PeterWin on 31.12.2017.
 */
const {ImpPhase} = require('./ImpChart')
const {Events} = require('./Events')
const {movAgent} = require('./agents/movAgent')

const ImpEvents = {
	[ImpPhase.BeginOfImp]: game => {
		Events.toGame(ImpPhase.BeginOfImp, game)
	},
	[ImpPhase.MoveShips]: game => {
		game.beginGlbActionIf(movAgent, (game, ship) => ship.isCanMove(game))
	},
}

module.exports = {ImpEvents}
