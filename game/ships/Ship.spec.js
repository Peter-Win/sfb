/**
 * Created by PeterWin on 14.01.2018.
 */
const {expect} = require('chai')
const {Ship} = require('./Ship')
const {Game} = require('../Game')
const {first} = require('../scenarios/first')
const {ImpPhase} = require('../ImpChart')
const {CtrlSimple} = require('../ctrls/CtrlSimple')
const {Sector} = require('../Sector')
const {DeviceIds} = require('../devices/DeviceIds')

describe('Ship', () => {
	it('buildEnemiesList', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		expect(ship).to.be.an.instanceof(Ship)
		const enemies = ship.buildEnemiesList(game)
		expect(enemies).to.have.lengthOf(5)	// 5 drones
		expect(enemies[0]).to.have.property('uid', 'droneA')
		expect(enemies[1]).to.have.property('uid', 'droneB')
		expect(enemies[2]).to.have.property('uid', 'droneC')
		expect(enemies[3]).to.have.property('uid', 'droneD')
		expect(enemies[4]).to.have.property('uid', 'droneE')
	})
	it('buildFireTargets', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		ship.devs[DeviceIds.PhCap].energy = 3
		const traces = ship.buildFireTargets(game)
		// console.log(JSON.stringify(traces))
		expect(traces.length).to.not.be.equal(0)
		// Вариантов может быть много. Но первый всегда будет такой: PH1 -> droneA
		const trace0 = traces[0]
		expect(trace0.devId).to.be.equal('PH1')
		expect(trace0.targetId).to.be.equal('droneA')
		expect(trace0.arcMap).to.be.equal(Sector.arc.FA)
		expect(trace0.pos).to.be.eql({x: 0, y: 10})
		expect(trace0.targetPos).to.be.eql({x: 0, y: 0})
	})
})
