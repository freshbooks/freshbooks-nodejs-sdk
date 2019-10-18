import axios, { AxiosInstance } from 'axios'
import { Logger } from 'winston'
import _logger from './logger'

// defaults
const API_URL = 'https://api.freshbooks.com'

/**
 * Client for FreshBooks API
 */
export default class Client {
	/**
	 * Base URL for FreshBooks API
	 */
	public readonly apiUrl: string

	/**
	 * Auth token for accessing FreshBooks API
	 */
	public readonly token?: string

	private axios: AxiosInstance

	private logger: Logger

	constructor(
		token?: string,
		{ apiUrl = API_URL, logger = _logger }: ClientOptions = {}
	) {
		this.token = token
		this.apiUrl = apiUrl
		this.axios = axios.create({
			baseURL: apiUrl,
		})
		this.logger = logger

		// init
		this.logger.debug(`Initialized with apiUrl: ${apiUrl}`)
	}
}

export interface ClientOptions {
	apiUrl?: string
	logger?: Logger
}
