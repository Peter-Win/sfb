/**
 * FSM structure: fsm.state.evid(params)
 * Created by PeterWin on 08.12.2017.
 */

class Events {
	/**
	 * Отправить сообщение в конечный автомат
	 * @param {Object} fsm	Конечный автомат
	 * @param {string} stateId	наименование состояния, в котором находится автомат
	 * @param {Object} params Параметры. Обязательные поля: evid, game
	 * @param {string} params.evid	идентификатор события
	 * @param {Game} params.game	Объект игры
	 * @return {void}
	 */
	static onFsm(fsm, stateId, params) {
		const {evid} = params
		const handle = part => {
			const stateObj = fsm[part]
			if (typeof stateObj === 'object') {
				const eventHandler = stateObj[evid]
				if (typeof eventHandler === 'function') {
					eventHandler(params)
				}
			}
		}
		handle('All')
		handle(stateId)
	}

	/**
	 * Event for all game objects
	 * @param {string} evid		event ID
	 * @param {Game} game		main game object
	 * @return {void}
	 */
	static toGame(evid, game, params) {
		Object.keys(game.objects).forEach(key => {
			const ship = game.objects[key]
			const side = game.sides[ship.side]
			Events.toShip(Object.assign({evid, game, side, ship}, params))
		})
	}

	/**
	 * Событие для корабля (или аналогичного объекта)
	 * @param {Object} params	Parameters
	 * @param {string} params.evid	event ID
	 * @param {Game} params.game	main game object
	 * @param {Side} params.side	side object
	 * @param {Ship} params.ship	ship object
	 * @return {void}
	 */
	static toShip(params) {
		const {ship} = params
		Events.onFsm(ship.getFsm(), ship.state, params)
		const {devs} = ship
		if (devs) {
			Object.keys(devs).forEach(key => {
				const device = devs[key]
				params.dev = device
				Events.toDevice(params)
			})
		}
	}

	/**
	 * Событие для корабельного устройства
	 * @param {Object} params Параметры
	 * @param {string} params.evid	ИД события
	 * @param {Game} params.game	общий объект игры
	 * @param {Side} params.side	сторона
	 * @param {Ship} params.ship	корабль
	 * @param {Device} params.dev	устройство
	 * @return {void}
	 */
	static toDevice(params) {
		const {dev} = params
		Events.onFsm(dev.fsm, dev.state, params)
	}
}

Events.BeginOfGame = 'BeginOfGame'

module.exports = {Events}
