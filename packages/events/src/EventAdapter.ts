import { EventEmitter } from 'events'
import { Logger } from 'winston'
import _logger from './logger'

export default class EventAdapter extends EventEmitter {
	/**
	 * Signing secret to authenticate requests from FreshBooks webhook
	 */
	public readonly secret: string

	private logger: Logger

	constructor(secret: string, { logger = _logger }: EventAdapterOptions = {}) {
		super()
		this.secret = secret
		this.logger = logger
	}
}

export interface EventAdapterOptions {
	logger?: Logger
}
