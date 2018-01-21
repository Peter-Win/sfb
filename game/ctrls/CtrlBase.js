/**
 * Created by PeterWin on 18.12.2017.
 */

class CtrlBase {
	/**
	 * Начать выполнение акции
	 * @abstract
	 * @param {Game} game	main game object
	 * @param {Object} action	Action
	 * @param {string} action.name	Agent name
	 * @param {string} action.uid	ship ID
	 * @param {string} action.state	Usually ActionState.Wait. Need set to ActionState.End, when ready
	 * @return {void}
	 */
	onAction(game, action) {
		throw new Error(`Abstract CtrlBase.onAction(${action.name})`)
	}

	/**
	 * Получить информацию о каком-то событии.
	 * Используется для уведомления клиента.
	 * @abstract
	 * @param {Game} game 	Main game object
	 * @param {{type:string}} info	JSON-структура. Обязательное поле type. Остальная инфа зависит от типа.
	 * @return {void}
	 */
	onInfo(game, info) {
	}

	/**
	 * Оповещает контроллер о начале очередного хода
	 * @abstract
	 * @param {Game} game 	main game object
	 * @return {void}
	 */
	onStep(game) {
	}
}

module.exports = {CtrlBase}
