/**
 * Контроллер для дебажных целей.
 * Не выполняет никаких действий. Останавливает функцию Game.idle() после любой акции
 * Created by PeterWin on 01.02.2018.
 */
const {CtrlBase} = require('./CtrlBase')
const {ActionState} = require('../agents/ActionState')

class CtrlStop extends CtrlBase {
	onAction(game, action) {
		// Акцию обрабатывает внешний код, который должен затем вызвать closeAction
	}

	static closeAction(game, action) {
		action.state = ActionState.End
		game.receiveActions()
	}
}

module.exports = {CtrlStop}
