/**
 * Created by PeterWin on 09.12.2017.
 */

class Device {
	constructor() {
		this.fsm = {}
		this.state = 'Begin'
		this.type = ''
		this.hp = 1
		this.energyWanted = 1.0e6
	}

	/**
	 * Создание нового экземпляра устройства с указанными характеристиками
	 * @param {function} Type	Класс устройства (наследник Device)
	 * @param {Object=} params	Дополнительные характеристики
	 * @return {Device}	Экземпляр устройства
	 */
	static create(Type, params) {
		const device = new Type()
		if (params) {
			Object.keys(params).forEach(key => device[key] = params[key])
		}
		return device
	}
}

module.exports = {Device}
