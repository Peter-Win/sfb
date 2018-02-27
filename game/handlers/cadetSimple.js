/**
 * Created by PeterWin on 15.12.2017.
 */
const {DamageType} = require('../agents/fireAgent')
const {ShipState} = require('../ships/Counter')
const {Energy} = require('../utils/Energy')

const cadetSimple = Object.freeze({
	autoEAlloc(params) {
		Energy.shipAutoEAlloc(params)
	},
	/**
	 * Получение 1 единицы внутреннего повреждения
	 * @param {Game} game *
	 * @param {Ship} ship *
	 * @return {string} DamageType
	 */
	onInternalDamage(game, ship) {
		ship.destroy(game, ShipState.Dead)
		return DamageType.internal
	},
})
module.exports = {cadetSimple}
