/**
 * Created by PeterWin on 12.12.2017.
 */
const {TurnPhase, TurnChart} = require('./TurnChart')
const {Events} = require('./Events')

const TurnEvents = {
	/**
	 * Begin of turn event
	 * @param {{evid:string, game:Game}} params Parameters
	 * @return {void}
	 */
	[TurnPhase.BeginOfTurn]: params => {
		Events.toGame(TurnPhase.BeginOfTurn, params.game)
		Events.toGame(TurnPhase.BeginOfTurn2, params.game)
	},

	/**
	 * @param {{evid:string, game:Game}} params Parameters
	 * @return {void}
	 */
	[TurnPhase.ImpulseProcBegin]: params => {
		params.game.curImp = 0
		params.game.curProc = 0
	},
}

module.exports = {TurnEvents}
