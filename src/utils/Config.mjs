import { readFileSync } from 'fs'

const CONFIG_PATH = './config.json'

class Config {
	constructor () {
		this.init()
	}

	init () {
		this.config =
		JSON.parse(readFileSync(
			CONFIG_PATH,
			'utf8'
		))
	}

	getConfig () {
		return this.config
	}
}

const c = new Config()
const config = c.getConfig()

export { config }