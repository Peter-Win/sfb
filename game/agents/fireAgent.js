/**
 * Правила акции:
 * - Устройство может быть выбрано не более 1 раза
 * - Сумма энергии для выбранных фазеров не должна превышать phaserLimit
 * Created by PeterWin on 08.01.2018.
 */
const assert = require('assert')
const {Agent} = require('./Agent')
const {FiringArc} = require('../utils/FiringArc')
const {DeviceIds} = require('../devices/DeviceIds')
const {DeviceState} = require('../devices/DeviceState')
const {Events} = require('../Events')

const DamageType = Object.freeze({
	lost: 'lost',
	internal: 'internal',
	shield: 'shield',
})

class FireAgent extends Agent {

	constructor() {
		super('Fire')
	}

	/**
	 * Трассирующая линия для стрельбы определенным орудием по указанной цели
	 * Является частью акции. Используется контроллерами для информации и принятия решения.
	 * @param {Object} params	Параметры, совместимые со структурой события
	 * @param {Game} params.game	Main game object
	 * @param {Ship} params.ship	Стреляющий корабль
	 * @param {Device} params.dev	Стреляющее устройство
	 * @param {Counter} params.target	Цель
	 * @return {{
	 * 	devId:string,
	 * 	arcMap:number,
	 * 	pos:{x,y:number},
	 * 	targetPos:{x,y:number},
	 * 	}}	Информация о линии. JSON-совместимая структура
	 * 	Кроме того, разные виды оружия могут добавлять доп. инфу.
	 * 	Например, фазер содержит 6 возможных значений повреждений и энергию для выстрела
	 */
	createTrace(params) {
		const {ship, dev, target} = params
		const sourceArcMap = FiringArc.arc[dev.arc]
		if (!sourceArcMap) {
			throw new Error(`Invalid arc for device ${dev.devId} in ship ${ship.uid}`)
		}
		const trace = {
			devId: dev.devId,
			arc0: dev.arc,
			// Сектор обстрела, повернутый в направлении движения корабля
			arcMap: FiringArc.rotateArc(sourceArcMap, ship.dir),
			pos: ship.getPos(),
			targetId: target.uid,
			targetPos: target.getPos(),
		}
		dev.updateFireTrace(params, trace)
		return trace
	}

	findTrace(action, devId, targetId) {
		return action.traces.findIndex(trace => trace.targetId === targetId && trace.devId === devId)
	}

	/**
	 * Создание вариантов стрельбы
	 * @override
	 */
	createAction(params) {
		const {game, ship} = params
		const traces = ship.buildFireTargets(game)
		// Если доступных целей нет, то акция не будет создана
		if (!traces.length) {
			return null
		}
		const action = this.newActionObject(ship.uid)
		action.traces = traces	// Список возможных вариантов стрельбы. Только для чтения в контроллере.
		action.phaserLimit = ship.devs[DeviceIds.PhCap].energy
		action.choices = []	// Индексы выбранных трасс. Главное, чтобы не повторялись devId
		return action
	}

	/**
	 * @override
	 */
	mergeAction(alienAction, nativeAction) {
		// Единственное, что можно принять от клиента - список выбранных трасс
		nativeAction.choices = alienAction.choices
	}

	/**
	 * @override
	 */
	execAction(game, action) {
		assert(game, 'Invalid game object')
		// Получить список выбранных трасс
		const traces = action.choices.map(index => action.traces[index])
		// Проверка правильности
		if (this.checkFireAction(game, game.getShip(action.uid), traces)) {
			// Если ок, значит забросить трассы в особый список выстрелов
			game.fires.push({uid: action.uid, traces})
		}
	}

	/**
	 * Проверка правильности
	 * @param {Game} game	Main game object
	 * @param {Ship} ship	owner of weapons
	 * @param {{devId,targetId:string}[]} traces	*
	 * @return {boolean}	true, if action is valid
	 */
	checkFireAction(game, ship, traces) {
		// Подготовить признаки для всех трасс
		traces.forEach(trace => trace.ok = false)
		// Проверка специфичная для разных видов оружия
		const problem = traces.find((trace, index) => {
			const device = ship.getDevice(trace.devId)
			return !device.checkFireTraces(game, ship, traces, index)
		})
		return !problem
	}

	/**
	 * Описание удара
	 * @param {Game} game *
	 * @param {Object<string,number>} result	lost|internal|shield => value
	 * @param {Counter} targetShip *
	 * @param {Counter} sourceShip *
	 * @param {Device=} device	null for seeking weapon
	 * @return {{sourceId,targetId,targetState,type:string, result:Object}} hit
	 */
	createHit(game, result, targetShip, sourceShip, device) {
		const hit = {
			sourceId: sourceShip.uid,
			targetId: targetShip.uid,
			targetState: targetShip.state,
			result,
			type: device ? device.type : null,
		}
		if (device) {
			device.updateShotDescription(game, hit)
		}
		targetShip.updateShotDescription(game, hit)
		return hit
	}

	/**
	 * Применить все сделанные выстрелы
	 * @param {Game} game	Main game object
	 * @return {void}
	 */
	resolve(game) {
		const hits = []
		game.fires.forEach(shot => {
			const sourceShip = game.getShip(shot.uid)
			shot.traces.forEach(trace => {
				const target = game.getShip(trace.targetId)
				const device = sourceShip.getDevice(trace.devId)
				const damage = device.calcDamage(game, sourceShip, target)
				// if (device.state !== DeviceState.Dead) {
				// 	device.setState(DeviceState.Used)
				// }
				Events.toDevice({evid: 'FireEnd', game, ship: sourceShip, dev: device})
				const result = target.onDamage(game, sourceShip, device, damage)
				hits.push(this.createHit(game, result, target, sourceShip, device))
			})
		})
		if (hits.length) {
			game.sendInfo({type: 'hits', hits})
		}
		game.fires.length = 0
	}

	resolveSeeking(game) {
		const hits = []
		Object.keys(game.objects).forEach(uid => {
			const unit = game.getShip(uid)
			const hit = unit.onResolveSeeking(game)
			if (hit) {
				hits.push(hit)
			}
		})
		if (hits.length) {
			game.sendInfo({type: 'hits', hits})
		}
	}
}

const fireAgent = new FireAgent()

module.exports = {fireAgent, DamageType}
