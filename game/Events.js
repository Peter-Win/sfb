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
	 *
	 * @param {string} evid
	 * @param {Game} game
	 */
	static toGame(evid, game) {
		game.sides.forEach(side => Events.toSide({evid, game, side}))
	}

	/**
	 * Событие для одной из сторон, участвующих в игоре
	 * @param {Object} params
	 * @param {string} params.evid
	 * @param {Game} params.game
	 * @param {Side} params.side
	 */
	static toSide(params) {
		const {side} = params;
		side.objects.forEach(ship => {
			params.ship = ship;
			Events.toShip(params)
		});
	}

	/**
	 * Событие для корабля (или аналогичного объекта)
	 * @param {Object} params
	 * @param {string} params.evid
	 * @param {Game} params.game
	 * @param {Side} params.side
	 * @param {Ship} params.ship
	 */
	static toShip(params) {
		const {ship} = params
		Events.onFsm(ship.getFsm(), ship.state, params)
		if (ship.devs) {
			ship.devs.forEach(device => {
				params.dev = device
				Events.toDevice(params)
			})
		}
	}


	/**
	 * Событие для корабельного устройства
	 * @param {Object} params
	 * @param {string} params.evid
	 * @param {Game} params.game
	 * @param {Side} params.side
	 * @param {Ship} params.ship
	 * @param {Device} params.dev
	 */
	static toDevice(params) {
		const {dev} = params
		Events.onFsm(dev.fsm, dev.state, params)
	}
}

Events.BeginOfGame = 'BeginOfGame'

module.exports = {Events}
