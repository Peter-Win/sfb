/**
 * Created by PeterWin on 31.12.2017.
 */
const {ImpPhase} = require('./ImpChart')
const {Events} = require('./Events')
const {movAgent} = require('./agents/movAgent')
const {fireAgent} = require('./agents/fireAgent')

const ImpEvents = {
	[ImpPhase.BeginOfImp]: game => {
		Events.toGame(ImpPhase.BeginOfImp, game)
	},
	[ImpPhase.MoveShips]: game => {
		game.beginGlbActionIf(movAgent, (game, ship) => !ship.isSeeking && ship.isCanMove(game))
	},
	[ImpPhase.MoveSeeking]: game => {
		game.beginGlbActionIf(movAgent, (game, ship) => ship.isSeeking && ship.isCanMove(game))
	},
	[ImpPhase.ResolveSeeking]: game => {
		fireAgent.resolveSeeking(game)
	},
	[ImpPhase.FireDirect]: game => {
		game.beginGlbActionIf(fireAgent, (game, ship) => ship.isCanFire(game))
	},
	[ImpPhase.ResolveDirect]: game => {
		fireAgent.resolve(game)
	},
}

module.exports = {ImpEvents}
