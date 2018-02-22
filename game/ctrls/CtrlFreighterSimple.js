/**
 * Простой контроллер для грузовиков.
 * Позволяет отстреливаться от врагов своим единственным фазером
 * The freighters move directly ahead without turning until they
 * reach hex row 15xx, at which point each freighter will turn to heading C.
 * They will fire their phasers as follows: Freighter A will
 * fire its phaser (at the Klingon or at a drone targeted on itself) on
 * impulse #2 of every turn. Freighter B will fire on impulse #4,
 * freighter C on impulse #6, freighter D on impulse #8.
 * Approaching drones have priority over the Klingon ship as a target.
 */
const {CtrlBase} = require('./CtrlBase')
const {ActionState} = require('../agents/ActionState')
const {fireAgent} = require('../agents/fireAgent')
const {movAgent} = require('../agents/movAgent')
const {CounterType} = require('../ships/CounterType')
const {Hex} = require('../Hex')

class CtrlFreighterSimple extends CtrlBase {
	/**
	 * @param {Object} params *
	 * @param {number} params.fireImp	Zero-based impulse number, when fire
	 * @param {number} params.enemySide Index of enemy side
	 */
	constructor(params) {
		super()
		this.fireImp = params.fireImp
		this.enemySide = params.enemySide
	}
	onAction(game, action) {
		const ship = game.getShip(action.uid)
		if (action.name === movAgent.name && ship.x === 14) {
			action.current = movAgent.Right
		} else if (action.name === fireAgent.name && game.curImp === this.fireImp) {
			this.selectTarget(game, action)
		}
		action.state = ActionState.End
		game.receiveActions()
	}

	selectTarget(game, action) {
		const ship = game.getShip(action.uid)
		const priorityTarget = {}
		const standardTarget = {}
		action.traces.forEach((trace, i) => {
			const unit = game.getShip(trace.targetId)
			const updateTarget = (targetRec, dist) => {
				if (!targetRec.unit || dist < targetRec.dist) {
					targetRec.unit = unit
					targetRec.dist = dist
					targetRec.traceIndex = i
				}
			}
			if (unit.side === this.enemySide) {
				// Максимальный приоритет - нацеленная ракета
				const dist = Hex.actualDistance(ship, unit)
				if (unit.type === CounterType.Drone && unit.target === ship.uid) {
					updateTarget(priorityTarget, dist)
				} else {
					updateTarget(standardTarget, dist)
				}
			}
		})
		if (standardTarget.unit) {
			const {traceIndex} = priorityTarget.unit ? priorityTarget : standardTarget
			action.choices.push(traceIndex)
		}
	}
}
module.exports = {CtrlFreighterSimple}

