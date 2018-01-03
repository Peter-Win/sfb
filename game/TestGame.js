/**
 * Created by PeterWin on 30.12.2017.
 * Тестовая игра
 */
const WebSocket = new require('ws')
const {Game} = require('./Game')
const {first} = require('./scenarios/first')
const {CtrlBase} = require('./ctrls/CtrlBase')

/**
 * @param {WebSocket} webSocketServer WebSocket
 * @return {Game} main game object
 */
const createTestGame = (webSocketServer) => {
	const game = new Game()
	game.create(first)
	game.objects.Con.ctrl = new CtrlWS(webSocketServer)
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
