/**
 * Проверка класса Game
 * Created by PeterWin on 12.12.2017.
 */
const {expect} = require('chai')
const {Game} = require('./Game')
const {GameState} = require('./GameState')
const {first} = require('./scenarios/first')
const {ShipFCC} = require('./ships/ShipFCC')
const {ShipState} = require('./ships/Counter')
const {movAgent} = require('./agents/movAgent')
const {CtrlBase} = require('./ctrls/CtrlBase')
const {TurnPhase} = require('./TurnChart')
const {ImpPhase} = require('./ImpChart')
const {ActionState} = require('./agents/ActionState')
const {mapSectorWidth, mapSectorHeight, turnLengthShort} = require('./consts')

describe('Game', () => {
	it('create first scenario', () => {
		const game = new Game()
		game.create(first)

		expect(game.width).to.be.equal(mapSectorWidth)
		expect(game.height).to.be.equal(mapSectorHeight)
		expect(game.turnLength).to.be.equal(turnLengthShort)
		expect(game.state).to.be.equal(GameState.Active)

		const ship = game.objects.Con
		expect(ship).to.not.be.empty
		expect(ship).to.be.instanceOf(ShipFCC)
		expect(ship.x).to.be.equal(0)
		expect(ship.y).to.be.equal(10)
		expect(ship.state).to.be.equal(ShipState.Active)
	})

	it('toSimple', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		// с тестовой целью создать акцию
		game.addAction(movAgent.createAction({game, ship}))

		const simple = game.toSimple()
		expect(simple).to.have.property('turnLength', turnLengthShort)
		expect(simple).to.have.property('width', mapSectorWidth)
		expect(simple).to.have.property('height', mapSectorHeight)
		expect(simple).to.have.property('state', GameState.Active)
		expect(simple).to.have.property('curTurn', 0)
		expect(simple).to.have.property('curImp', 0)
		expect(simple).to.have.property('userSpeed', 0)
		expect(simple).to.have.property('turnStepId', TurnPhase.BeginOfTurn)
		expect(simple).to.have.property('actions')

		const ConAction = simple.actions.get('Con')
		expect(ConAction).to.be.ok
		expect(ConAction).to.have.property('name', movAgent.name)
		expect(ConAction).to.have.property('uid', 'Con')

		const {objects} = simple
		expect(objects).to.have.property('Con')
		const {Con} = objects
		expect(Con).to.have.property('state', ShipState.Active)
		expect(Con).to.have.property('x', 0)
		expect(Con).to.have.property('speed', 8)
	})

	it('beginGlbActionIf', () => {
		const game = new Game()
		game.create(first)
		// Генерация акции для всех игровых объектов, которые могут двигаться
		game.beginGlbActionIf(movAgent, (game, ship) => ship.isCanMove(game))
		const {actions} = game
		expect(actions.size).to.be.equal(6)	// cadet cruiser and 5 drones
		const conAction = actions.get('Con')
		expect(conAction).to.be.instanceOf(Object)
		expect(conAction.uid).to.be.equal('Con')
		// Взорвем один дрон. Акций должно стать меньше.
		actions.clear()
		const droneA = game.getShip('droneA')
		droneA.setState(ShipState.Exploded)
		expect(droneA.isNotActive()).to.be.true
		expect(droneA.isCanMove(game)).to.be.false
		game.beginGlbActionIf(movAgent, (game, ship) => ship.isCanMove(game))
		expect(actions.size).to.be.equal(5)	// cadet cruiser and 4 drones
	})

	it('switchProc', () => {
		const game = new Game()
		const turnStepId = () => game.turnChart[game.turnStep]
		const impProcId = () => game.impChart[game.curProc]
		game.create(first)
		game.switchProc()
		expect(game.curTurn).to.be.equal(1)
		expect(turnStepId()).to.be.equal(TurnPhase.BeginOfTurn)
		expect(game.isImpulse()).to.be.false
		game.switchProc()
		expect(turnStepId()).to.be.equal(TurnPhase.AutoEAlloc)
		game.switchProc()
		expect(turnStepId()).to.be.equal(TurnPhase.OnMainEnergyAlloc)
		game.switchProc()
		expect(turnStepId()).to.be.equal(TurnPhase.OnEnergyAlloc)
		game.switchProc()
		expect(turnStepId()).to.be.equal(TurnPhase.SpeedDeterm)
		game.switchProc()
		expect(turnStepId()).to.be.equal(TurnPhase.ImpulseProcBegin)
		expect(game.isImpulse()).to.be.false
		game.switchProc()
		expect(turnStepId()).to.be.equal(TurnPhase.ImpulseProc)
		expect(game.isImpulse()).to.be.true
		expect(game.curImp).to.be.equal(0)
		expect(impProcId()).to.be.equal(ImpPhase.BeginOfImp)
		game.switchProc()
		expect(turnStepId()).to.be.equal(TurnPhase.ImpulseProc)
		expect(game.curImp).to.be.equal(0)
		expect(impProcId()).to.be.equal(ImpPhase.MoveShips)
		while (impProcId() !== ImpPhase.EndOfImp) {
			game.switchProc()
		}
		game.switchProc()
		expect(impProcId()).to.be.equal(ImpPhase.BeginOfImp)
		expect(game.curImp).to.be.equal(1)
	})

	// Тестирование прохождения стандартных шагов
	it('idle', () => {
		const game = new Game()
		game.create(first)
		const ship = game.objects.Con
		ship.ctrl = new CtrlLog()
		ship.y = 1
		// Предполагается два импульса, пока корабль выйдет за пределы карты
		for (let j = 0; j < 300; j++) {
			game.idle()
			if (game.isNotActive()) {
				const {log} = ship.ctrl
				expect(log).to.have.lengthOf(3)
				expect(log[0]).to.be.equal('name=Move; uid=Con; y=1')
				expect(log[1]).to.be.equal('name=Fire; uid=Con; y=0')
				expect(log[2]).to.be.equal('name=Move; uid=Con; y=0')
				return	// success finish
			}
			game.sendActions()
		}
		throw new Error('Dead loop in idle test')
	})
})

class CtrlLog extends CtrlBase {
	constructor() {
		super()
		this.log = []
	}
	onStep(game) {
	}
	onAction(game, action) {
		const ship = game.objects[action.uid]
		this.log.push(`name=${action.name}; uid=${action.uid}; y=${ship.y}`)
		action.state = ActionState.End
		game.receiveActions()
	}
}
