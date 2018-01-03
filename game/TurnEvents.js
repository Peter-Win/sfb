/**
 * Created by PeterWin on 12.12.2017.
 */
const {TurnPhase} = require('./TurnChart')
const {Events} = require('./Events')
const {ImpEvents} = require('./ImpEvents')

const TurnEvents = {
	/**
	 * Begin of turn event
	 * @param {{evid:string, game:Game}} params Parameters
	 * @return {void}
	 */
	[TurnPhase.BeginOfTurn]: params => {
		const {game} = params
		game.turnStep = 0
		Events.toGame(TurnPhase.BeginOfTurn, game)
		Events.toGame(TurnPhase.BeginOfTurn2, game)
	},

	/**
	 * @param {{evid:string, game:Game}} params Parameters
	 * @return {void}
	 */
	[TurnPhase.ImpulseProcBegin]: params => {
	},

	/**
	 *
	 * @param {{evid:string, game:Game}} params Parameters
	 * @return {void}
	 */
	[TurnPhase.ImpulseProc]: params => {
		const {game} = params
		const {curProc} = game
		const curProcId = game.impChart[curProc]
		const impEventHandler = ImpEvents[curProcId]
		if (impEventHandler) {
			impEventHandler(game)
		} else {
			Events.toGame(curProcId, game)
		}
	}
}

module.exports = {TurnEvents}
