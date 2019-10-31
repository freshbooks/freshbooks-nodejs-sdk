/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import { Logger } from 'winston'
import _logger from './logger'
import { User, Error, Pagination } from './models'
import { Invoice } from './models/Invoices'

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

	constructor(token: string, options?: ClientOptions, logger = _logger) {
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

	private async call<T>(
		method: Method,
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<Result<T>> {
		this.logger.debug(`Request: ${method} ${url}`)
		try {
			const response = await this.axios({
				method,
				url,
				data,
				...config,
			})
			const { result } = response.data.response
			const pagination: { pages: Pagination } | {} = result
				? {
						pages: {
							page: result.page,
							pages: result.pages,
							size: result.per_page,
							total: result.total,
						},
				  }
				: {}

			return {
				ok: true,
				data: response.data,
				...pagination,
			}
		} catch (err) {
			const {
				response: {
					data: { error, error_description },
				},
			} = err
			return {
				ok: false,
				error: {
					code: error,
					message: error_description,
				},
			}
		}
	}

	public readonly users = {
		me: (): Promise<Result<User>> =>
			this.call<User>('GET', '/auth/api/v1/users/me'),
	}

	public readonly invoices = {
		list: (accountId: string): Promise<Result<Invoice[]>> =>
			this.call<Invoice[]>(
				'GET',
				`/accounting/account/${accountId}/invoices/invoices`
			),
	}
}

export interface ClientOptions {
	apiUrl?: string
}

export interface Result<T> {
	ok: boolean
	data?: T
	error?: Error
	pages?: Pagination
}
