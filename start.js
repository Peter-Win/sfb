/**
 * Created by PeterWin on 02.12.2017.
 */
const path = require('path')
const http = require('http')
const url = require('url')
const express = require('express')
const WebSocket = new require('ws')
const {createTestGame} = require('./game/TestGame')
const {ActionState} = require('./game/agents/ActionState')
const {execAction} = require('./game/agents/AgentsMap')

const app = express()
const htmlHeaders = {
	charset: 'utf-8',
}

const server = http.createServer(app)
const webSocketServer = new WebSocket.Server({server})

const game = createTestGame(webSocketServer)

app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname, '/pages/main.html'))
})
app.get('/game', (request, response) => {
	response.sendFile(path.join(__dirname, '/pages/simpleTest.html'))
})
app.get('/img/:name', (request, response) => {
	response.sendFile(path.join(__dirname, `/img/${request.params.name}`))
})

/**
 * Отправка сообщения всем актуальным клиентам
 * @param {Object} msg	Объект сообщения. Должен быть пригоден для сериализации
 * @param {string} msg.type Тип сообщения
 * @returns {void}
 */
const broadcast = msg => {
	try {
		msgText = JSON.stringify(msg)
		webSocketServer.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(msgText)
			}
		})
	} catch (e) {
		console.error(e)
	}
}

webSocketServer.on('connection', ws => {
	broadcast({type: 'all', text: 'There is new client'})
	ws.on('message', message => {
		try {
			const obj = JSON.parse(message)
			switch (obj.type) {
				case 'all':
					broadcast(obj)
					break
				case 'askGame':
					ws.send(JSON.stringify({type: 'game', game: game.toSimple()}))
					game.actions.forEach((action, uid) => {
						// в случае реконнекта нужно бужет подхватить акции, которые уже Wait
						if (action.state !== ActionState.End) {
							ws.send(JSON.stringify({type: 'action', action}))
							action.state = ActionState.Wait
						}
					})
					break
				case 'actionResult':
					game.onActionIncome(obj.action)
					break
				default:
					throw new Error('Invalid message type: ' + obj.type)
			}
		} catch (err) {
			console.error(err)
		}
	})
})

server.listen(3000, () => {
	console.log('Look your browser at localhost:3000')
})
