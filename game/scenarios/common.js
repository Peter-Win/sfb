const {ShipState} = require('../ships/Counter')

/**
 * Проверка, не погиб ли главный корабль сценария
 * Если вышел за карту или убит, то игра  завершается победой врага и формируется сообщение
 * @param {Game} game *
 * @param {Counter} ship Main ship of scenario
 * @param {number} enemySide Index of winner side
 * @return {boolean} true, если потерян
 */
const isMainShipLost = (game, ship, enemySide = 1) => {
	if (ship.isNotActive()) {
		const text = (ship.state === ShipState.Lost) ? '{name} left the map' : '{name} is dead'
		game.finish(1, {text, params: ship})
		return true
	}
	return false
}

module.exports = {isMainShipLost}
