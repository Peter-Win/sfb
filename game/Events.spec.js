/**
 * Created by PeterWin on 08.12.2017.
 */

const {expect} = require('chai')
const {Events} = require('./Events')

describe('Events', () => {
	it('onFsm', () => {
		const demoFsm = {
			Begin: {
				First: params => params.begin = 22,
			},
			All: {
				Last: params => params.all = 33,
			},
		}
		const params1 = {evid: 'First'}
		Events.onFsm(demoFsm, 'Begin', params1)
		expect(params1).to.have.property('begin', 22)

		const params2 = {evid: 'Last'}
		Events.onFsm(demoFsm, 'End', params2)
		expect(params2).to.have.property('all', 33)
	})
})
