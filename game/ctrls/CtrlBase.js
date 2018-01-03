/**
 * Created by PeterWin on 18.12.2017.
 */

class CtrlBase {
	/**
	 * Начать выполнение акции
	 * @param {Game} game	main game object
	 * @param {Object} action	Action
	 * @param {string} action.name	Agent name
	 * @param {string} action.uid	ship ID
	 * @param {string} action.state	Usually ActionState.Wait. Need set to ActionState.End, when ready
	 * @return {void}
	 * @abstract
	 */
	onAction(game, action) {
		throw new Error(`Abstract CtrlBase.onAction(${action.name})`)
	}

	/**
	 * Оповещает контроллер о начале очередного хода
	 * @param {Game} game 	main game object
	 * @return {void}
	 */
	onStep(game) {
	}
}

module.exports = {CtrlBase}
