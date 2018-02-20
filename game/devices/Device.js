/**
 * Created by PeterWin on 09.12.2017.
 */
const {StateObject} = require('../StateObject')
const {Energy} = require('../utils/Energy')
const {DeviceIds} = require('./DeviceIds')
const {DeviceState} = require('./DeviceState')

// Приоритет распределения энергии (поле eAllocPrior)
const EAllocPrior = Object.freeze({
	PhaserCapacitor: 9,
	PhotonTorpedo: 10,
	Disruptor: 10,
	Engine: 14,
})

class Device extends StateObject{
	constructor(devId) {
		super(DeviceState.Begin)
		this.devId = devId
		this.fsm = {}
		this.type = ''
		this.hp = 1
		this.energyWanted = 1.0e6
		this.energyLim = ''
		this.energyCost = 0
		this.eAllocPrior = null
		this.eTypePrior = ''	// May be combination of W I B or A. For Engine = 'WI' (Warp first, Impulse second)
		this.energySrc = {}		// Перечислены источники поступившей энергии на текущий ход. Например, {W:4, I:1}
		this.energyIn = 0	// Сумма поступившей энергии на текущий ход
	}

	/**
	 * Создание нового экземпляра устройства с указанными характеристиками
	 * @param {Object<string,Device>} devices	in/out Список устройств, в котором регистрируется создаваемое устройство
	 * @param {string} devId	Идентификатор устройства
	 * @param {function} Type	Класс устройства (наследник Device)
	 * @param {Object=} params	Дополнительные характеристики
	 * @return {Device}	Экземпляр устройства
	 */
	static create(devices, devId, Type, params) {
		if (!devId) {
			throw new Error(`Require devId in Device.create. params=${JSON.stringify(params)}`)
		}
		const device = new Type(devId)
		if (params) {
			Object.keys(params).forEach(key => device[key] = params[key])
		}
		devices[devId] = device
		return device
	}

	isActive() {
		return this.state !== DeviceState.Disabled && this.state !== DeviceState.Dead
	}

	/**
	 * Попадает ли указанная цель в зону обстрела
	 * @param {{x,y,dir:number}} ship	Корабль-владелец устройства
	 * @param {{x,y:number}} target		Проверяемая цель
	 * @return {boolean}	true, if target in sector
	 */
	isValidTarget(ship, target) {
		return false
	}

	/**
	 * Выделить энергию для устройства
	 * @param {Ship} ship IN
	 * @return {void}
	 */
	allocEnergy(ship) {
		const limits = Energy.parseELim(this.energyLim)
		for (let i = 0; i < this.eTypePrior.length && this.energyIn <= limits.Lim; i++) {
			const type = this.eTypePrior[i]
			this.allocSpecialEnergy(type, limits, ship)
		}
	}

	/**
	 * @param {string} type	IN. one of A B I or W
	 * @param {Object<string, number>} limits	IN. Map type => value
	 * @param {Ship} ship	IN
	 * @return {void}
	 */
	allocSpecialEnergy(type, limits, ship) {
		const energy = Energy.getWantedEnergy(type, limits, ship, this)
		Energy.translateEnergy(energy, type, ship, this)
	}

	/**
	 * Внести дополнительную информацию в трассировочный элемент акции стрельбы
	 * @abstract
	 * @param {{game:Game, ship:Ship, targetId:string}} params	in
	 * @param {Object} trace	in/out
	 * @return {void}
	 */
	updateFireTrace(params, trace) {
	}

	/**
	 * @abstract
	 * @param {Game} game	Main game object
	 * @param {Ship} ship	device owner
	 * @param {{devId,targetId:string,ok:boolean}[]} traces	all traces
	 * @param {number} traceIndex	index of checked trace
	 * @return {boolean}	true, if ok
	 */
	checkFireTraces(game, ship, traces, traceIndex) {
		return true
	}

	/**
	 * Вычислить величину повреждения, наносимого выстрелом по указанной цели
	 * Результат зависит от случайной величины
	 * @abstract
	 * @param {Game} game	Main game object
	 * @param {Ship} ship	Owner of device
	 * @param {Counter} target	*
	 * @return {number}	Random damage value
	 */
	calcDamage(game, ship, target) {
		return 0
	}

	/**
	 * Заполнить структуру выполняемого выстрела
	 * Эта информация используется клиентом для отображения эффекта вымтрела
	 * @param {Game} game	Main game object
	 * @param {{sourceId, targetId}} shot	IN/OUT	Заполняется специфичная информация
	 * @return {void}
	 */
	updateShotDescription(game, shot) {
	}
}
Device.ids = DeviceIds
Device.states = DeviceState

module.exports = {Device, EAllocPrior}
