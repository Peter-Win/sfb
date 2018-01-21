/**
 * Created by PeterWin on 08.12.2017.
 */

const {expect} = require('chai')
const {Events} = require('./Events')
const {Game} = require('./Game')
const {first} = require('./scenarios/first')
const {PhaserCapacitor} = require('./devices/PhaserCapacitor')

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
	it('toGame', () => {
		const game = new Game()
		game.create(first)
		const {Con} = game.objects
		Con.fsm = {
			Active: {
				TestEvent: params => {
					params.ship.testValue = 123
				},
			},
		}
		const phCap = Con.devs[PhaserCapacitor.id]
		phCap.fsm = {
			Begin: {
				TestEvent: params => {
					params.dev.testValue = 'hello'
				},
			},
		}
		Events.toGame('TestEvent', game)
		expect(Con.testValue).to.be.equal(123)
		expect(phCap.testValue).to.be.equal('hello')
	})
})
