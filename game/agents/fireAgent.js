/**
 * Created by PeterWin on 08.01.2018.
 */
const {Agent} = require('./Agent')

class FireAgent extends Agent {

	constructor() {
		super(FireAgent.Name)
	}

	/**
	 * Создание вариантов стрельбы
	 * @override
	 */
	createAction(params) {
		const {ship} = params
	}
}
FireAgent.Name = 'Fire'

const fireAgent = new FireAgent()

module.exports = {fireAgent}
