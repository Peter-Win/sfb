/**
 * Created by PeterWin on 18.12.2017.
 */
const {CtrlBase} = require('./CtrlBase')
const {ActionState} = require('../agents/ActionState')

class CtrlSimple extends CtrlBase {
	onAction(game, action) {
		// Самый примитивный контроллер. Просто закрывает акцию
		setTimeout(() => {
			action.state = ActionState.End
			game.receiveActions()
		}, 0)
	}
}

module.exports = {CtrlSimple}
