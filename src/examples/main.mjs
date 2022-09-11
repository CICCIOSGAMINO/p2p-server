import { createReadStream } from 'node:fs'
import { p2pServer } from '../peers-server.mjs'
import Koa from 'koa'
import Router from '@koa/router'
import logger from 'koa-logger'
import serve from 'koa-static'

// --------------------------------- Koa App ----------------------------------
const port = 3000
const app = new Koa()
const router = new Router()

// handling 500 and 400 erros, here the active routes
app.use(async(ctx, next) => {
	try {
		await next()
		if (ctx.status === 404) {
			ctx.throw(404)
		}
	} catch (err) {
		const { statusCode, message } = err
		ctx.status = statusCode
		ctx.body = `${statusCode} >> ${message}`
	}
})

app.use(logger())
app.use(serve('./public'))

// serve the default route
router.get('/', async (ctx, next) => {
	ctx.type = 'html'
	// ctx.body = `<h1>Hello KOA!!</h1>`
	ctx.body = createReadStream('./public/index.html')
})

// ws socket service api
router.get('/ws', async (ctx, next) => {
	let str = `@R-URL >> ${ctx.request.url} \n`	+
		`@R-ORIGIN >> ${ctx.request.origin} \n`	+
		`@R-QUERYSTRING >> ${ctx.request.querystring}	\n`

	// need to retrieve the id, token and key
	// http://localhost:3000/ws?id=cicio_1&token=tkkk&key=kkeyyy
	const { id, token, key } = ctx.request.query
	if (!id || !token || !key) {
		ctx.body = `@INVALID-REQUEST >> id:${id} token:${token} key:${key}`
	} else {
		ctx.body = str
	}
	// ctx.status = 200
	// ctx.body = `@WS >> ${ctx.websocket}`
})

// error test url
router.get('/error', async (ctx, next) => {
	ctx.throw(500, 'Internal server Error!')
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, () => {
	console.log(`@APP >> Running on ${port} port.`)
})



// -------------------------------- WS-Server ---------------------------------
p2pServer.on('running', () => {
	console.log('@P2P >> Running ...')
})

p2pServer.on('connection', (addr) => {
	console.log(`@P2P >> ${addr} Connected`)
})

/*
p2pServerRunning.on('close', () => {
	console.log('@P2P >> Close')
})
*/

p2pServer.on('message', (data) => {
	console.log(`@P2P >> ${data.toString('utf-8')}`)
})

p2pServer.on('error', (err) => {
	console.log(`@P2P >> ${err}`)
})

setInterval(() => {
	console.log(`@P2P >> ${p2pServer.getActiveClients()} Actives`)
}, 10000)