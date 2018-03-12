/**
 * Created by PeterWin on 30.12.2017.
 * Тестовая игра
 */
const WebSocket = new require('ws')
const {Game} = require('./Game')
const {first, firstMod} = require('./scenarios/first')
const {second, secondMod} = require('./scenarios/second')
const {scenario03} = require('./scenarios/scenario03')
const {scenario04} = require('./scenarios/scenario04')
const {CtrlBase} = require('./ctrls/CtrlBase')

// const scenario = firstMod({race: 'Klingon'})
// const scenario = secondMod({race: 'Klingon'})
// const scenario = scenario03({race: 'Federation'})
const scenario = scenario04()

/**
 * @param {WebSocket} webSocketServer WebSocket
 * @return {Game} main game object
 */
const createTestGame = (webSocketServer) => {
	const game = new Game()
	game.create(scenario)
	Object.keys(game.objects).forEach(key => {
		const unit = game.objects[key]
		if (unit.side === 0) {
			unit.ctrl = new CtrlWS(webSocketServer)
		}
	})
	game.idle()
	return game
}

class CtrlWS extends CtrlBase {
	/**
	 * @param {WebSocket} webSocketServer web socket server
	 */
	constructor(webSocketServer) {
		super()
		this.webSocketServer = webSocketServer
	}

	onStep(game) {
		this.sendToAll({type: 'game', game: game.toSimple()})
	}
	onAction(game, action) {
		this.sendToAll({type: 'action', action})
	}
	onInfo(game, info) {
		this.sendToAll({type: 'info', info})
	}

	sendToAll(msg) {
		try {
			const msgText = JSON.stringify(msg)
			this.webSocketServer.clients.forEach(client => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(msgText)
				}
			})
		} catch (e) {
			console.error(e)
		}
	}
}

module.exports = {createTestGame}
