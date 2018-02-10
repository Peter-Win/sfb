/**
 * Контроллер для управления ракетами и торпедами
 * Важный параметр: target = uid цели
 * Created by PeterWin on 03.02.2018.
 */

const {CtrlBase} = require('./CtrlBase')
const {ActionState} = require('../agents/ActionState')
const {movAgent} = require('../agents/movAgent')
const {Hex} = require('../Hex')
const {Random} = require('../Random')

class CtrlSeeking extends CtrlBase {
	onAction(game, action) {
		if (action.name === movAgent.name) {
			const unit = game.getShip(action.uid)
			if (unit.target) {
				const targetShip = game.getShip(unit.target)
				const choice = this.selectDirection(unit, targetShip, action)
				action.current = choice
			}
		}
		action.state = ActionState.End
		game.receiveActions()
	}

	/**
	 * @param {Counter} sourceUnit *
	 * @param {Counter} targetUnit *
	 * @param {{list:{x,y,dir:number}[]}} action *
	 * @return {number} index of desired direction (field 'current' in action structure)
	 */
	selectDirection(sourceUnit, targetUnit, action) {
		const list = action.list
		const sectors = Hex.locateDir(sourceUnit, targetUnit)
		if (sectors.length === 1) {
			const needDir = sectors[0]
			// Искать направление среди возможных
			const index = list.findIndex(possible => possible.dir === needDir)
			if (index >= 0) {
				return index
			}
			// Искать наиболее подходящее направление для поворота
			const leftDir = Hex.normalDir(list[1].dir - 1)
			if (leftDir === needDir) {
				return movAgent.Left
			}
			const rightDir = Hex.normalDir(list[2].dir + 1)
			if (rightDir === needDir) {
				return movAgent.Right
			}
			// Поворот на 180 гр. С учетом направления цели
			const dirDiff = Hex.relatoveDir[sourceUnit.dir][targetUnit.dir]
			if (dirDiff < 0) {
				return movAgent.Left
			} else if (dirDiff > 0 && dirDiff < 3) {
				return movAgent.Right
			}
			// Иначе выбор случайный - 1 или 2
			return 1 + (Random.int6() & 1)
		} else if (sectors.length === 2) {
			// два
			const cross = list.reduce((sum, possible, i) => {
				return (possible.dir === sectors[0] || possible.dir === sectors[1]) ? [...sum, i] : sum
			}, [])
			if (cross.length === 2) {
				// Если оба сектора попадают в предложенные три варианта, то движемся в центральном направлении
				return 0
			} else if (cross.length === 1) {
				// Если один, то поворачиваем в ту сторону
				return cross[0]
			} else {

			}
		}
		return movAgent.Center
	}
}

module.exports = {CtrlSeeking}
