/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import { Logger } from 'winston'
import _logger from './logger'
import { Error, Pagination, Invoice, User, Item } from './models'
import { transformUserResponse } from './models/User'
import { transformListInvoicesResponse } from './models/Invoices'
import { transformItemResponse } from './models/Item'

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
	public readonly token: string

	private axios: AxiosInstance

	private logger: Logger

	/**
	 * FreshBooks API client
	 * @param token Bearer token
	 * @param options Client config options
	 * @param logger Custom logger
	 */
	constructor(token: string, options?: Options, logger = _logger) {
		const { apiUrl = API_URL } = options || {}

		this.token = token
		this.apiUrl = apiUrl

		// setup axios
		this.axios = axios.create({
			baseURL: apiUrl,
			headers: {
				Authorization: `Bearer ${token}`,
				'Api-Version': 'alpha',
				'Content-Type': 'application/json',
			},
		})

		this.logger = logger

		// init
		this.logger.debug(`Initialized with apiUrl: ${apiUrl}`)
	}

	private async call<S, T>(
		method: Method,
		url: string,
		config?: AxiosRequestConfig,
		data?: S
	): Promise<Result<T>> {
		this.logger.debug(`Request: ${method} ${url}`)
		this.logger.debug(`Request2: ${config}`)
		this.logger.debug(`Request3: ${data}`)
		try {
			const response = await this.axios({
				method,
				url,
				data,
				...config,
			})
			this.logger.debug(`Response: ${method} ${url} ${data}`)

			return {
				ok: true,
				data: response.data,
			}
		} catch (err) {
			this.logger.debug(`Error: ${err}`)
			return {
				ok: false,
				error: err.response.data,
			}
		}
	}

	public readonly users = {
		/**
		 * Get own identity user
		 */
		me: (): Promise<Result<User>> =>
			this.call('GET', '/auth/api/v1/users/me', {
				transformResponse: transformUserResponse,
			}),
	}

	public readonly invoices = {
		/**
		 * Get list of invoices
		 */
		list: (
			accountId: string
		): Promise<Result<{ invoices: Invoice[]; pages: Pagination }>> =>
			this.call('GET', `/accounting/account/${accountId}/invoices/invoices`, {
				transformResponse: transformListInvoicesResponse,
			}),
	}

	public readonly items = {
		/**
		 * Get single item
		 */
		single: (accountId: string, id: string): Promise<Result<Item>> =>
			this.call('GET', `/accounting/account/${accountId}/items/items/${id}`, {
				transformResponse: transformItemResponse,
			}),
	}
}

export interface Options {
	apiUrl?: string
}

export interface Result<T> {
	ok: boolean
	data?: T
	error?: Error
}
