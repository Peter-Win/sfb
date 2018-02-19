/**
 * Created by PeterWin on 15.01.2018.
 */
const {cmp} = require('../utils/cmp')

class Energy {
	/**
	 * Распарсить описание энергозатрат
	 * @param {string} description	Examples: "*1" or "W=1;I=1;Lim=2"
	 * @return {Object<string,number>}	energy limits map
	 */
	static parseELim (description) {
		const lims = {}
		if (!description) {
			lims.Lim = 0
		} else if (description[0] === '*') {
			lims.Lim = +description.slice(1)
		} else {
			const sum = description.split(';').reduce((acc, expr) => {
				const pair = expr.split('=')
				if (pair.length !== 2) {
					throw new Error(`Invalid energy description: ${description}`)
				}
				const id = pair[0]
				const value = +pair[1]
				lims[id] = value
				return acc + value
			}, 0)
			if (!('Lim' in lims)) {
				lims.Lim = sum
			}
		}
		return lims
	}

	/**
	 * Получить количество энергии, доступное для передачи устройству
	 * @param {string} type		W | I | A | B
	 * @param {Object<string,number>} limits	type => energy
	 * @param {Ship} ship	*
	 * @param {Device} device	*
	 * @return {number}	energy value
	 */
	static getWantedEnergy(type, limits, ship, device) {
		let energy = Math.min(ship.energyPool[type], Math.min(limits.Lim, device.energyWanted) - device.energyIn)
		if (type in limits) {
			energy = Math.min(energy, limits[type])
		} else if (device.energyLim !== `*${limits.Lim}`) {
			energy = 0
		}
		return energy
	}

	/**
	 * @param {number} energy	count of specific energy
	 * @param {string} type		type of energy (W|I|A|B)
	 * @param {Ship} ship		*
	 * @param {Device} device	*
	 * @return {void}
	 */
	static translateEnergy(energy, type, ship, device) {
		ship.energyPool[type] -= energy
		device.energyIn += energy
		device.energySrc[type] = device.energySrc[type] || 0
		device.energySrc[type] += energy
	}

	/**
	 * Получить список устройств, которые требуют энергии
	 * @param {Counter} ship *
	 * @return {Device[]}	список отсортирован по приоритетам eAllocPrior
	 */
	static getDevices(ship) {
		const {devs} = ship
		if (!devs) {
			return []
		}
		const list = Object.keys(devs).filter(deviceId => {
			const device = devs[deviceId]
			return device.isActive() && !!device.eAllocPrior
		}).map(deviceId => devs[deviceId])
		// Отсортировать по увеличению приоритета
		list.sort((devA, devB) => cmp(devA.eAllocPrior, devB.eAllocPrior))
		return list
	}

	/**
	 * Автоматическое распределение энергии для корабля
	 * @param {{ship:Ship}} params	event parameters
	 * @return {void}
	 */
	static shipAutoEAlloc(params) {
		const {ship} = params
		// Выбрать устройства, для которых указан приоритет распределения энергии
		const list = Energy.getDevices(ship)
		// распределить
		list.forEach(device => device.allocEnergy(ship))
	}

}

module.exports = {Energy}
