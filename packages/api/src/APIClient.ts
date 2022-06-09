/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry'
import { Logger } from 'winston'
import _logger from './logger'
import APIClientError, { APIClientConfigError } from './models/Error'

import {
	Bills,
	BillPayments,
	Tasks,
	Client,
	Error,
	Expense,
	Invoice,
	OtherIncome,
	Item,
	Pagination,
	Payment,
	Project,
	Service,
	ServiceRate,
	TimeEntry,
	User,
	BillVendors,
	CreditNote,
	Callback,
	PaymentOptions,
} from './models'
import { transformClientResponse, transformClientListResponse, transformClientRequest } from './models/Client'
import { transformListInvoicesResponse, transformInvoiceResponse, transformInvoiceRequest } from './models/Invoices'
import {
	transformListOtherIncomesResponse,
	transformOtherIncomeResponse,
	transformOtherIncomeRequest,
} from './models/OtherIncome'
import { transformListServicesResponse, transformServiceResponse, transformServiceRequest } from './models/Service'
import { transformServiceRateResponse, transformServiceRateRequest } from './models/ServiceRate'
import { transformShareLinkResponse } from './models/ShareLink'
import { transformItemResponse, transformItemListResponse, transformItemRequest } from './models/Item'
import {
	transformPaymentListResponse,
	transformPaymentResponse,
	transformPaymentRequest,
	transformPaymentUpdateRequest,
} from './models/Payment'
import { QueryBuilderType, joinQueries } from './models/builders'

import { transformExpenseResponse, transformExpenseListResponse, transformExpenseRequest } from './models/Expense'
import { transformProjectResponse, transformProjectListResponse, transformProjectRequest } from './models/Project'
import {
	transformTimeEntryResponse,
	transformTimeEntryListResponse,
	transformTimeEntryRequest,
} from './models/TimeEntry'
import { transformUserResponse } from './models/User'
import { transformTasksListResponse, transformTasksRequest, transformTasksResponse } from './models/Tasks'
import {
	transformBillVendorsRequest,
	transformBillVendorsResponse,
	transformListBillVendorsResponse,
} from './models/BillVendors'
import { transformBillsListResponse, transformBillsRequest, transformBillsResponse } from './models/Bills'
import {
	transformBillPaymentsListResponse,
	transformBillPaymentsRequest,
	transformBillPaymentsResponse,
} from './models/BillPayments'
import {
	transformCreditNoteListResponse,
	transformCreditNoteResponse,
	transformCreditNoteRequest,
} from './models/CreditNote'
import {
	transformCallbackListResponse,
	transformCallbackResponse,
	transformCallbackRequest,
	transformCallbackVerifierRequest,
	transformCallbackResendRequest,
} from './models/Callback'
import { transformPaymentOptionsRequest, transformPaymentOptionsResponse } from './models/PaymentOptions'
import { transformProfitLossReportResponse } from './models/report/ProfitLossReport'
import { transformTaxSummaryReportResponse } from './models/report/TaxSummaryReport'
import { transformPaymentsCollectedReportResponse } from './models/report/PaymentsCollectedReport'

// defaults
const API_BASE_URL = 'https://api.freshbooks.com'
const API_TOKEN_ENDPOINT = '/auth/oauth/token'
const AUTH_BASE_URL = 'https://auth.freshbooks.com'
const AUTH_ENDPOINT = '/oauth/authorize'
const API_VERSION = require('../package.json').version

/**
 * Client for FreshBooks API
 */
export default class APIClient {
	/**
	 * Base URL for FreshBooks API
	 */
	public readonly apiUrl: string

	public readonly clientId: string
	public readonly clientSecret?: string
	public readonly redirectUri?: string

	/**
	 * Pre-authorized access token for accessing FreshBooks API
	 */
	public accessToken?: string

	/**
	 * Pre-authorized token for renewing access token
	 */
	public refreshToken?: string

	/**
	 * Expiration date of access token
	 */
	public accessTokenExpiresAt?: Date

	private readonly axios: AxiosInstance
	private readonly logger: Logger

	private readonly authorizationUrl: string

	public static isNetworkRateLimitOrIdempotentRequestError(error: any): boolean {
		if (!error.config) {
			return false
		}

		return error.response.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error)
	}

	/**
	 * FreshBooks API client
	 * @param clientId The FreshBooks application client id
	 * @param options Client config options
	 * @param logger Custom logger
	 */
	constructor(clientId: string, options: Options = {}, logger = _logger) {
		const defaultRetry = {
			retries: 10,
			retryDelay: axiosRetry.exponentialDelay, // ~100ms, 200ms, 400ms, 800ms
			retryCondition: APIClient.isNetworkRateLimitOrIdempotentRequestError, // 429, 5xx, or network error
		}

		const {
			clientSecret,
			redirectUri,
			accessToken,
			refreshToken,
			apiUrl = process.env.FRESHBOOKS_API_URL || API_BASE_URL,
			retryOptions = defaultRetry,
		} = options

		this.clientId = clientId
		this.clientSecret = clientSecret
		this.redirectUri = redirectUri
		this.accessToken = accessToken
		this.refreshToken = refreshToken
		this.apiUrl = apiUrl
		this.logger = logger

		this.authorizationUrl = (process.env.FRESHBOOKS_AUTH_URL || AUTH_BASE_URL) + AUTH_ENDPOINT

		let userAgent = `FreshBooks nodejs sdk/${API_VERSION} client_id ${this.clientId}`
		if (options?.userAgent) {
			userAgent = options?.userAgent
		}

		// setup axios
		this.axios = axios.create({
			baseURL: apiUrl,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Api-Version': 'alpha',
				'Content-Type': 'application/json',
				'User-Agent': userAgent,
			},
		})

		// setup retry logic
		axiosRetry(this.axios, retryOptions)
	}

	getAuthRequestUrl(scopes?: string[]) {
		if (!this.redirectUri) {
			throw new APIClientConfigError('redirectUri must be configured')
		}

		const params = {
			client_id: this.clientId,
			response_type: 'code',
			redirect_uri: this.redirectUri,
		}

		if (Array.isArray(scopes)) {
			Object.assign(params, { scope: scopes.join(' ') })
		}

		const formattedParams = Object.entries(params)
			.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
			.join('&')
		return `${this.authorizationUrl}?${formattedParams}`
	}

	private async authorizeCall(
		grantType: 'authorization_code' | 'refresh_token',
		codeType: 'code' | 'refresh_token',
		code: string
	) {
		if (!this.redirectUri) {
			throw new APIClientConfigError('redirectUri must be configured')
		}

		if (!this.clientSecret) {
			throw new APIClientConfigError('clientSecret must be configured')
		}

		const res: Result<TokenResponse> = await this.call(
			'POST',
			API_TOKEN_ENDPOINT,
			{},
			{
				client_id: this.clientId,
				client_secret: this.clientSecret,
				grant_type: grantType,
				redirect_uri: this.redirectUri,
				[codeType]: code,
			},
			'Authorize Call'
		)

		if (res.ok) {
			const data = await res.data!
			this.accessToken = data.access_token
			this.refreshToken = data.refresh_token

			/**
			 * Python defines a timestamp as the time in **seconds** since
			 * the epoch while JavaScript uses milliseconds.
			 */
			const createdAt = data.created_at * 1e3
			const expiresIn = data.expires_in * 1e3
			this.accessTokenExpiresAt = new Date(createdAt + expiresIn)

			return {
				accessToken: this.accessToken,
				refreshToken: this.refreshToken,
				accessTokenExpiresAt: this.accessTokenExpiresAt,
			}
		}
	}

	getAccessToken(code: string) {
		return this.authorizeCall('authorization_code', 'code', code)
	}

	refreshAccessToken(refreshToken?: string) {
		refreshToken ||= this.refreshToken
		if (refreshToken) {
			return this.authorizeCall('refresh_token', 'refresh_token', refreshToken)
		}
		throw new APIClientConfigError('refreshToken must be configured or provided')
	}

	private async call<S, T>(
		method: Method,
		url: string,
		config?: AxiosRequestConfig,
		data?: S,
		name?: string
	): Promise<Result<T>> {
		try {
			if (this.axios.defaults.headers) {
				if (method === 'GET') {
					delete this.axios.defaults.headers['Content-Type']
				} else {
					this.axios.defaults.headers['Content-Type'] = 'application/json'
				}

				if (this.accessToken) {
					this.axios.defaults.headers['Authorization'] = `Bearer ${this.accessToken}`
				}
			}
			const response = await this.axios({
				method,
				url,
				data,
				...config,
			})
			return {
				ok: true,
				data: response.data,
			}
		} catch (err: any) {
			if (err.response) {
				const {
					response: { status, statusText, data: errData },
				} = err

				throw new APIClientError(
					name || '',
					(errData && errData.message) || statusText,
					(errData && errData.code && errData.code.toString()) || (status && status.toString()),
					errData && errData.errors
				)
			}
			throw err
		}
	}

	public readonly users = {
		/**
		 * Get own identity user
		 */
		me: (): Promise<Result<User>> =>
			this.call(
				'GET',
				'/auth/api/v1/users/me',
				{
					transformResponse: transformUserResponse,
				},
				null,
				'Get Identity'
			),
	}

	public readonly clients = {
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ clients: Client[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/users/clients${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformClientListResponse,
				},
				null,
				'List Clients'
			),
		single: (accountId: string, clientId: string): Promise<Result<Client>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/users/clients/${clientId}`,
				{
					transformResponse: transformClientResponse,
				},
				null,
				'Get Client'
			),
		create: (client: Client, accountId: string): Promise<Result<Client>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/users/clients`,
				{
					transformResponse: transformClientResponse,
					transformRequest: transformClientRequest,
				},
				client,
				'Create Client'
			),
		update: (client: Client, accountId: string, clientId: string): Promise<Result<Client>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/users/clients/${clientId}`,
				{
					transformResponse: transformClientResponse,
					transformRequest: transformClientRequest,
				},
				client,
				'Update Client'
			),
		delete: (accountId: string, clientId: string): Promise<Result<Client>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/users/clients/${clientId}`,
				{
					transformResponse: transformClientResponse,
					transformRequest: transformClientRequest,
				},
				{
					visState: 1,
				},
				'Delete Client'
			),
	}

	public readonly invoices = {
		/**
		 * Get list of invoices
		 */
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ invoices: Invoice[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/invoices/invoices${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformListInvoicesResponse,
				},
				null,
				'List Invoices'
			),
		/**
		 * Get single invoice
		 */
		single: (accountId: string, invoiceId: string, queryBuilders?: QueryBuilderType[]): Promise<Result<Invoice>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/invoices/invoices/${invoiceId}${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformInvoiceResponse,
				},
				null,
				'Get Invoice'
			),
		/**
		 * Post invoice
		 */
		create: (invoice: Invoice, accountId: string, queryBuilders?: QueryBuilderType[]): Promise<Result<Invoice>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/invoices/invoices${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformInvoiceResponse,
					transformRequest: transformInvoiceRequest,
				},
				invoice,
				'Create Invoice'
			),
		update: (
			accountId: string,
			invoiceId: string,
			data: any,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<Invoice>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/invoices/invoices/${invoiceId}${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformInvoiceResponse,
					transformRequest: transformInvoiceRequest,
				},
				data,
				'Update Invoice'
			),
		delete: (accountId: string, invoiceId: string): Promise<Result<Invoice>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/invoices/invoices/${invoiceId}`,
				{
					transformResponse: transformInvoiceResponse,
				},
				{ invoice: { vis_state: 1 } },
				'Delete Invoice'
			),
		shareLink: (accountId: string, invoiceId: string): Promise<Result<Invoice>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/invoices/invoices/${invoiceId}/share_link?share_method=share_link`,
				{
					transformResponse: transformShareLinkResponse,
				},
				null,
				'Get Invoice Share Link'
			),
	}

	public readonly otherIncomes = {
		/**
		 * Get list of other incomes
		 */
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ otherIncomes: OtherIncome[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/other_incomes/other_incomes${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformListOtherIncomesResponse,
				},
				null,
				'List OtherIncomes'
			),
		/**
		 * Get single other income
		 */
		single: (
			accountId: string,
			otherIncomeId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<OtherIncome>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/other_incomes/other_incomes/${otherIncomeId}${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformOtherIncomeResponse,
				},
				null,
				'Get OtherIncome'
			),
		/**
		 * Post other income
		 */
		create: (otherIncome: OtherIncome, accountId: string): Promise<Result<OtherIncome>> => {
			return this.call(
				'POST',
				`/accounting/account/${accountId}/other_incomes/other_incomes`,
				{
					transformResponse: transformOtherIncomeResponse,
					transformRequest: transformOtherIncomeRequest,
				},
				otherIncome,
				'Create OtherIncome'
			)
		},
		update: (accountId: string, otherIncomeId: string, data: any): Promise<Result<OtherIncome>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/other_incomes/other_incomes/${otherIncomeId}`,
				{
					transformResponse: transformOtherIncomeResponse,
					transformRequest: transformOtherIncomeRequest,
				},
				data,
				'Update OtherIncome'
			),
		delete: (accountId: string, otherIncomeId: string): Promise<Result<OtherIncome>> =>
			this.call(
				'DELETE',
				`/accounting/account/${accountId}/other_incomes/other_incomes/${otherIncomeId}`,
				{},
				null,
				'Delete OtherIncome'
			),
	}

	public readonly expenses = {
		single: (accountId: string, expenseId: string, queryBuilders?: QueryBuilderType[]): Promise<Result<Expense>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/expenses/expenses/${expenseId}${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformExpenseResponse,
				},
				null,
				'Get Expense'
			),
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ expenses: Expense[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/expenses/expenses${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformExpenseListResponse,
				},
				null,
				'List Expenses'
			),

		create: (expense: Expense, accountId: string, queryBuilders?: QueryBuilderType[]): Promise<Result<Expense>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/expenses/expenses${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformExpenseResponse,
					transformRequest: transformExpenseRequest,
				},
				expense,
				'Create Expense'
			),

		update: (
			expense: Expense,
			accountId: string,
			expenseId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<Expense>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/expenses/expenses/${expenseId}${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformExpenseResponse,
					transformRequest: transformExpenseRequest,
				},
				expense,
				'Update Expense'
			),

		delete: (accountId: string, expenseId: string): Promise<Result<Expense>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/expenses/expenses/${expenseId}`,
				{
					transformResponse: transformExpenseResponse,
				},
				{ expense: { vis_state: 1 } },
				'Delete Expense'
			),
	}

	public readonly items = {
		/**
		 * Get single item
		 */
		single: (accountId: string, itemId: string): Promise<Result<Item>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/items/items/${itemId}`,
				{
					transformResponse: transformItemResponse,
				},
				null,
				'Get Item'
			),

		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ items: Item[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/items/items${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformItemListResponse,
				},
				null,
				'List Items'
			),
		update: (accountId: string, itemId: string, data: any): Promise<Result<Item>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/items/items/${itemId}`,
				{
					transformResponse: transformItemResponse,
					transformRequest: transformItemRequest,
				},
				data,
				'Update Item'
			),
		create: (accountId: string, data: any): Promise<Result<Item>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/items/items`,
				{
					transformResponse: transformItemResponse,
					transformRequest: transformItemRequest,
				},
				data,
				'Create Item'
			),
	}

	public readonly paymentOptions = {
		create: (accountId: string, invoiceId: string, data: any): Promise<Result<PaymentOptions>> =>
			this.call(
				'POST',
				`/payments/account/${accountId}/invoice/${invoiceId}/payment_options`,
				{
					transformRequest: transformPaymentOptionsRequest,
					transformResponse: transformPaymentOptionsResponse,
				},
				data,
				'Create Online Payment Option'
			),
		single: (accountId: string, invoiceId: string): Promise<Result<PaymentOptions>> =>
			this.call(
				'GET',
				`/payments/account/${accountId}/invoice/${invoiceId}/payment_options`,
				{
					transformResponse: transformPaymentOptionsResponse,
				},
				null,
				'Get Online Payment Options'
			),
		default: (accountId: string): Promise<Result<PaymentOptions>> =>
			this.call(
				'GET',
				`/payments/account/${accountId}/payment_options?entity_type=invoice`,
				{
					transformResponse: transformPaymentOptionsResponse,
				},
				null,
				'Get Default Online Payment Options'
			),
	}

	public readonly payments = {
		single: (accountId: string, paymentId: string): Promise<Result<Payment>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/payments/payments/${paymentId}`,
				{
					transformResponse: transformPaymentResponse,
				},
				null,
				'Get Payment'
			),
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ payments: Payment[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/payments/payments${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformPaymentListResponse,
				},
				null,
				'List Payments'
			),
		create: (accountId: string, data: any): Promise<Result<Payment>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/payments/payments`,
				{
					transformResponse: transformPaymentResponse,
					transformRequest: transformPaymentRequest,
				},
				data,
				'Create Payment'
			),
		update: (accountId: string, paymentId: string, data: any): Promise<Result<Payment>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/payments/payments/${paymentId}`,
				{
					transformResponse: transformPaymentResponse,
					transformRequest: transformPaymentUpdateRequest,
				},
				data,
				'Update Payment'
			),
		delete: (accountId: string, paymentId: string): Promise<Result<Payment>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/payments/payments/${paymentId}`,
				{
					transformResponse: transformPaymentResponse,
				},
				{
					payment: {
						vis_state: 1,
					},
				},
				'Delete Payment'
			),
	}

	public readonly projects = {
		list: (
			businessId: number,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ projects: Project[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/projects/business/${businessId}/projects${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformProjectListResponse,
				},
				null,
				'List Projects'
			),
		single: (businessId: number, projectId: number): Promise<Result<Project>> =>
			this.call(
				'GET',
				`/projects/business/${businessId}/project/${projectId}`,
				{
					transformResponse: transformProjectResponse,
				},
				null,
				'Get Project'
			),
		create: (project: Project, businessId: number): Promise<Result<Project>> =>
			this.call(
				'POST',
				`/projects/business/${businessId}/project`,
				{
					transformResponse: transformProjectResponse,
					transformRequest: transformProjectRequest,
				},
				project,
				'Create Project'
			),
		update: (project: Project, businessId: number, projectId: number): Promise<Result<Project>> =>
			this.call(
				'PUT',
				`/projects/business/${businessId}/project/${projectId}`,
				{
					transformResponse: transformProjectResponse,
					transformRequest: transformProjectRequest,
				},
				project,
				'Update Project'
			),
		delete: (businessId: number, projectId: number): Promise<Result<Project>> =>
			this.call('DELETE', `/projects/business/${businessId}/project/${projectId}`, {}, null, 'Delete Project'),
	}

	public readonly timeEntries = {
		list: (
			businessId: number,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ timeEntries: TimeEntry[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/timetracking/business/${businessId}/time_entries${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformTimeEntryListResponse,
				},
				null,
				'List Time Entries'
			),
		single: (businessId: number, timeEntryId: number): Promise<Result<TimeEntry>> =>
			this.call(
				'GET',
				`/timetracking/business/${businessId}/time_entries/${timeEntryId}`,
				{
					transformResponse: transformTimeEntryResponse,
				},
				null,
				'Get Time Entry'
			),
		create: (timeEntry: TimeEntry, businessId: number): Promise<Result<TimeEntry>> =>
			this.call(
				'POST',
				`/timetracking/business/${businessId}/time_entries`,
				{
					transformResponse: transformTimeEntryResponse,
					transformRequest: transformTimeEntryRequest,
				},
				timeEntry,
				'Create Time Entry'
			),
		update: (timeEntry: TimeEntry, businessId: number, timeEntryId: number): Promise<Result<TimeEntry>> =>
			this.call(
				'PUT',
				`/timetracking/business/${businessId}/time_entries/${timeEntryId}`,
				{
					transformResponse: transformTimeEntryResponse,
					transformRequest: transformTimeEntryRequest,
				},
				timeEntry,
				'Update Time Entry'
			),
		delete: (businessId: number, timeEntryId: number): Promise<Result<TimeEntry>> =>
			this.call(
				'DELETE',
				`/timetracking/business/${businessId}/time_entries/${timeEntryId}`,
				{},
				null,
				'Delete Time Entry'
			),
	}
	public readonly services = {
		list: (businessId: number): Promise<Result<{ timeEntries: Service[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/comments/business/${businessId}/services`,
				{
					transformResponse: transformListServicesResponse,
				},
				null,
				'List Services'
			),
		single: (businessId: number, serviceId: number): Promise<Result<Service>> =>
			this.call(
				'GET',
				`/comments/business/${businessId}/service/${serviceId}`,
				{
					transformResponse: transformServiceResponse,
				},
				null,
				'Get Service'
			),
		create: (service: Service, businessId: number): Promise<Result<Service>> =>
			this.call(
				'POST',
				`/comments/business/${businessId}/service`,
				{
					transformResponse: transformServiceResponse,
					transformRequest: transformServiceRequest,
				},
				service,
				'Create Service'
			),
		rate: {
			single: (businessId: number, serviceId: number): Promise<Result<ServiceRate>> => {
				return this.call(
					'GET',
					`/comments/business/${businessId}/service/${serviceId}/rate`,
					{
						transformResponse: transformServiceRateResponse,
					},
					null,
					'Get Service Rate'
				)
			},
			create: (service: ServiceRate, businessId: number, serviceId: number): Promise<Result<ServiceRate>> =>
				this.call(
					'POST',
					`/comments/business/${businessId}/service/${serviceId}/rate`,
					{
						transformResponse: transformServiceRateResponse,
						transformRequest: transformServiceRateRequest,
					},
					service,
					'Add Service Rate'
				),
			update: (service: ServiceRate, businessId: number, serviceId: number): Promise<Result<ServiceRate>> =>
				this.call(
					'PUT',
					`/comments/business/${businessId}/service/${serviceId}/rate`,
					{
						transformResponse: transformServiceRateResponse,
						transformRequest: transformServiceRateRequest,
					},
					service,
					'Update Service Rate'
				),
		},
	}
	public readonly tasks = {
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ tasks: Tasks[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/projects/tasks${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformTasksListResponse,
				},
				null,
				'List Tasks'
			),
		single: (accountId: string, taskId: number): Promise<Result<Tasks>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/projects/tasks/${taskId}`,
				{
					transformResponse: transformTasksResponse,
				},
				null,
				'Get Tasks Entry'
			),
		create: (task: Tasks, accountId: string): Promise<Result<Tasks>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/projects/tasks`,
				{
					transformResponse: transformTasksResponse,
					transformRequest: transformTasksRequest,
				},
				task,
				'Create Tasks Entry'
			),
		update: (task: Tasks, accountId: string, taskId: number): Promise<Result<Tasks>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/projects/tasks/${taskId}`,
				{
					transformResponse: transformTasksResponse,
					transformRequest: transformTasksRequest,
				},
				task,
				'Update Tasks Entry'
			),
		delete: (accountId: string, taskId: number): Promise<Result<Tasks>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/projects/tasks/${taskId}`,
				{
					transformResponse: transformTasksResponse,
					transformRequest: transformTasksRequest,
				},
				{
					visState: 1,
				},
				'Delete Client'
			),
	}
	public readonly billVendors = {
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ vendors: BillVendors[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/bill_vendors/bill_vendors${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformListBillVendorsResponse,
				},
				null,
				'List BillVendors'
			),
		single: (accountId: string, vendorId: number): Promise<Result<BillVendors>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/bill_vendors/bill_vendors/${vendorId}`,
				{
					transformResponse: transformBillVendorsResponse,
				},
				null,
				'Get BillVendors Entry'
			),
		create: (vendor: BillVendors, accountId: string): Promise<Result<BillVendors>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/bill_vendors/bill_vendors`,
				{
					transformResponse: transformBillVendorsResponse,
					transformRequest: transformBillVendorsRequest,
				},
				vendor,
				'Create BillVendors Entry'
			),
		update: (vendor: BillVendors, accountId: string, vendorId: number): Promise<Result<BillVendors>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/bill_vendors/bill_vendors/${vendorId}`,
				{
					transformResponse: transformBillVendorsResponse,
					transformRequest: transformBillVendorsRequest,
				},
				vendor,
				'Update BillVendors Entry'
			),
		delete: (accountId: string, vendorId: number): Promise<Result<BillVendors>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/bill_vendors/bill_vendors/${vendorId}`,
				{
					transformResponse: transformBillVendorsResponse,
					transformRequest: transformBillVendorsRequest,
				},
				{
					visState: 1,
				},
				'Delete BillVendors Entry'
			),
	}
	public readonly bills = {
		list: (accountId: string, queryBuilders?: QueryBuilderType[]): Promise<Result<{ bills: Bills[] }>> =>
			this.call(
				'GET',
				`accounting/account/${accountId}/bills/bills${joinQueries(queryBuilders)}`,
				{ transformResponse: transformBillsListResponse },
				null,
				'List Bills'
			),
		single: (accountId: string, billId: number): Promise<Result<{ bill: Bills }>> =>
			this.call(
				'GET',
				`accounting/account/${accountId}/bills/bills/${billId}`,
				{ transformResponse: transformBillsResponse },
				null,
				'Get Bill'
			),
		create: (bill: Bills, accountId: string): Promise<Result<Bills>> =>
			this.call(
				'POST',
				`accounting/account/${accountId}/bills/bills`,
				{
					transformResponse: transformBillsResponse,
					transformRequest: transformBillsRequest,
				},
				bill,
				'Create Bill'
			),
		delete: (accountId: string, billId: number): Promise<Result<Bills>> =>
			this.call(
				'PUT',
				`accounting/account/${accountId}/bills/bills/${billId}`,
				{
					transformResponse: transformBillsResponse,
					transformRequest: transformBillsRequest,
				},
				{ visState: 1 },
				'Delete Bill'
			),
		archive: (accountId: string, billId: number): Promise<Result<Bills>> =>
			this.call(
				'PUT',
				`accounting/account/${accountId}/bills/bills/${billId}`,
				{
					transformResponse: transformBillsResponse,
					transformRequest: transformBillsRequest,
				},
				{ visState: 2 },
				'Archive Bill'
			),
	}
	public readonly billPayments = {
		list: (accountId: string, queryBuilders?: QueryBuilderType[]): Promise<Result<{ billPayments: BillPayments[] }>> =>
			this.call(
				'GET',
				`accounting/account/${accountId}/bill_payments/bill_payments${joinQueries(queryBuilders)}`,
				{ transformResponse: transformBillPaymentsListResponse },
				null,
				'List Bill Payments Payments'
			),
		single: (accountId: string, billPaymentId: number): Promise<Result<{ billPayment: BillPayments }>> =>
			this.call(
				'GET',
				`accounting/account/${accountId}/bill_payments/bill_payments/${billPaymentId}`,
				{ transformResponse: transformBillPaymentsResponse },
				null,
				'Get Bill Payment'
			),
		create: (billPayment: BillPayments, accountId: string): Promise<Result<BillPayments>> =>
			this.call(
				'POST',
				`accounting/account/${accountId}/bill_payments/bill_payments`,
				{
					transformResponse: transformBillPaymentsResponse,
					transformRequest: transformBillPaymentsRequest,
				},
				billPayment,
				'Create Bill Payment'
			),
		update: (billPayment: BillPayments, accountId: string, billPaymentId: number): Promise<Result<BillPayments>> =>
			this.call(
				'PUT',
				`accounting/account/${accountId}/bill_payments/bill_payments/${billPaymentId}`,
				{
					transformResponse: transformBillPaymentsResponse,
					transformRequest: transformBillPaymentsRequest,
				},
				billPayment,
				'Update Bill Payment'
			),
		delete: (accountId: string, billPaymentId: number): Promise<Result<BillPayments>> =>
			this.call(
				'PUT',
				`accounting/account/${accountId}/bill_payments/bill_payments/${billPaymentId}`,
				{
					transformResponse: transformBillPaymentsResponse,
					transformRequest: transformBillPaymentsRequest,
				},
				{ visState: 1 },
				'Delete Bill Payment'
			),
	}
	public readonly creditNotes = {
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ creditNotes: CreditNote[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/credit_notes/credit_notes${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformCreditNoteListResponse,
				},
				null,
				'List Credit Notes'
			),
		single: (accountId: string, creditId: string): Promise<Result<CreditNote>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/credit_notes/credit_notes/${creditId}`,
				{
					transformResponse: transformCreditNoteResponse,
				},
				null,
				'Get Credit Note'
			),
		create: (creditNote: CreditNote, accountId: string): Promise<Result<CreditNote>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/credit_notes/credit_notes`,
				{
					transformResponse: transformCreditNoteResponse,
					transformRequest: transformCreditNoteRequest,
				},
				creditNote,
				'Create Credit Note'
			),
		update: (creditNote: CreditNote, accountId: string, creditId: string): Promise<Result<CreditNote>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/credit_notes/credit_notes/${creditId}`,
				{
					transformResponse: transformCreditNoteResponse,
					transformRequest: transformCreditNoteRequest,
				},
				creditNote,
				'Update Credit Note'
			),
		delete: (accountId: string, creditId: string): Promise<Result<CreditNote>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/credit_notes/credit_notes/${creditId}`,
				{
					transformResponse: transformCreditNoteResponse,
					transformRequest: transformCreditNoteRequest,
				},
				{
					visState: 1,
				},
				'Delete Credit Note'
			),
	}
	public readonly callbacks = {
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ callbacks: Callback[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/events/account/${accountId}/events/callbacks${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformCallbackListResponse,
				},
				null,
				'List Callback'
			),
		single: (accountId: string, callbackId: string): Promise<Result<Callback>> =>
			this.call(
				'GET',
				`/events/account/${accountId}/events/callbacks/${callbackId}`,
				{
					transformResponse: transformCallbackResponse,
				},
				null,
				'Get Callback'
			),
		create: (callback: Callback, accountId: string): Promise<Result<Callback>> =>
			this.call(
				'POST',
				`/events/account/${accountId}/events/callbacks`,
				{
					transformResponse: transformCallbackResponse,
					transformRequest: transformCallbackRequest,
				},
				callback,
				'Create Callback'
			),
		update: (callback: Callback, accountId: string, callbackId: string): Promise<Result<Callback>> =>
			this.call(
				'PUT',
				`/events/account/${accountId}/events/callbacks/${callbackId}`,
				{
					transformResponse: transformCallbackResponse,
					transformRequest: transformCallbackRequest,
				},
				callback,
				'Update Callback'
			),
		delete: (accountId: string, callbackId: string): Promise<Result<Callback>> =>
			this.call('DELETE', `/events/account/${accountId}/events/callbacks/${callbackId}`, {}, null, 'Delete Callback'),
		verify: (accountId: string, callbackId: string, verifier: string): Promise<Result<Callback>> =>
			this.call(
				'PUT',
				`/events/account/${accountId}/events/callbacks/${callbackId}`,
				{
					transformResponse: transformCallbackResponse,
					transformRequest: transformCallbackVerifierRequest,
				},
				verifier,
				'Verify Callback'
			),
		resendVerification: (accountId: string, callbackId: string): Promise<Result<Callback>> =>
			this.call(
				'PUT',
				`/events/account/${accountId}/events/callbacks/${callbackId}`,
				{
					transformResponse: transformCallbackResponse,
					transformRequest: transformCallbackResendRequest,
				},
				null,
				'Verify Callback'
			),
	}

	public readonly reports = {
		profitLoss: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ callbacks: Callback[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/reports/accounting/profitloss_entity${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformProfitLossReportResponse,
				},
				null,
				'Profit and Loss Report'
			),
		taxSummary: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ callbacks: Callback[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/reports/accounting/taxsummary${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformTaxSummaryReportResponse,
				},
				null,
				'Tax Summary Report'
			),
		paymentsCollected: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ callbacks: Callback[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/reports/accounting/payments_collected${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformPaymentsCollectedReportResponse,
				},
				null,
				'Payments Collected Report'
			),
	}
}

interface TokenResponse {
	access_token: string
	token_type: string
	expires_in: number
	refresh_token: string
	scope: string
	created_at: number
}

export interface Options {
	clientSecret?: string
	redirectUri?: string
	accessToken?: string
	refreshToken?: string
	apiUrl?: string
	retryOptions?: IAxiosRetryConfig
	userAgent?: string
}

export interface Result<T> {
	ok: boolean
	data?: T
	error?: Error
}
