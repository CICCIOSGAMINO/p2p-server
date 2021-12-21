import WebSocket, { WebSocketServer } from 'ws'
import { EventEmitter } from 'events'
import { config } from './utils/Config.mjs'

class PeersServer extends EventEmitter {
	constructor() {
		super()
		this.wss = new WebSocketServer({
			port: config.server.port
		}, () => {
			this.emit('running')
		})
		this._init()
	}

	_init() {
		// init the listeners
		this.wss.on('connection', 
			this._handleWsConnection.bind(this))
		this.wss.on('close',
			this._handleWsClose.bind(this))
		this.wss.on('error',
			this._handleError.bind(this))
		// start ping / pong
		this.interval = setInterval(
			this._ping.bind(this),
			Number(config.server.ping))
	}

	_handleStart () {
		this.emit('running')
	}

	_handleWsConnection (ws, req) {
		// check if the connection contain the params needed
		const { query = {} } = URL.parse(req.url)
		console.log(query)


		ws.isAlive = true
		this.emit(
			'connection',
			req.socket.remoteAddress)

		ws.on('message', (data) => {
			this.emit('message', data)
		})

		// ping messages used to verify that the
		// remote endpoint is still responsive
		ws.on('pong', () => {
			ws.isAlive = true
		})
	}

	_ping () {
		this.wss.clients.forEach(ws => {
			if (!ws.isAlive) {
				ws.terminate()
			} else {
				ws.isAlive = false
				ws.ping()
			}
		})
	}

	_handleWsClose () {
		this.emit('close')
	}

	_handleError (err) {
		this.emit('error', err)
	}

	getActiveClients() {
		return this.wss?.clients?.size
	}
}

const p2pServer = new PeersServer()
export { p2pServer, PeersServer }