/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry'
import { Logger } from 'winston'
import _logger from './logger'
import { QueryBuilderType, joinQueries } from './models/builders'
import APIClientError, { APIClientConfigError } from './models/Error'
import {
	Bills,
	BillPayments,
	BillVendors,
	Callback,
	Client,
	CreditNote,
	Error,
	Expense,
	ExpenseCategory,
	Invoice,
	Item,
	JournalEntry,
	JournalEntryAccount,
	JournalEntryDetail,
	OtherIncome,
	Pagination,
	Payment,
	PaymentOptions,
	Project,
	Service,
	ServiceRate,
	Tasks,
	TimeEntry,
	User,
} from './models'
import { transformBillsRequest, transformBillsResponse, transformBillsListResponse } from './models/Bills'
import {
	transformBillPaymentsRequest,
	transformBillPaymentsResponse,
	transformBillPaymentsListResponse,
} from './models/BillPayments'
import {
	transformBillVendorsRequest,
	transformBillVendorsResponse,
	transformBillVendorsListResponse,
} from './models/BillVendors'
import {
	transformCallbackRequest,
	transformCallbackResponse,
	transformCallbackListResponse,
	transformCallbackResendRequest,
	transformCallbackVerifierRequest,
} from './models/Callback'
import { transformClientRequest, transformClientResponse, transformClientListResponse } from './models/Client'
import {
	transformCreditNoteRequest,
	transformCreditNoteListResponse,
	transformCreditNoteResponse,
} from './models/CreditNote'
import { transformExpenseRequest, transformExpenseResponse, transformExpenseListResponse } from './models/Expense'
import { transformExpenseCategoryResponse, transformExpenseCategoryListResponse } from './models/ExpenseCategory'
import { transformInvoiceRequest, transformInvoiceResponse, transformInvoiceListResponse } from './models/Invoices'
import { transformItemRequest, transformItemResponse, transformItemListResponse } from './models/Item'
import { transformJournalEntryRequest, transformJournalEntryResponse } from './models/JournalEntry'
import { transformJournalEntryAccountListResponse } from './models/JournalEntryAccount'
import { transformJournalEntryDetailListResponse } from './models/JournalEntryDetail'
import {
	transformOtherIncomeRequest,
	transformOtherIncomeResponse,
	transformOtherIncomeListResponse,
} from './models/OtherIncome'
import {
	transformPaymentRequest,
	transformPaymentResponse,
	transformPaymentListResponse,
	transformPaymentUpdateRequest,
} from './models/Payment'
import { transformPaymentOptionsRequest, transformPaymentOptionsResponse } from './models/PaymentOptions'
import { transformProjectRequest, transformProjectResponse, transformProjectListResponse } from './models/Project'
import { transformPaymentsCollectedReportResponse } from './models/report/PaymentsCollectedReport'
import { transformProfitLossReportResponse } from './models/report/ProfitLossReport'
import { transformTaxSummaryReportResponse } from './models/report/TaxSummaryReport'
import { transformServiceRequest, transformServiceResponse, transformServiceListResponse } from './models/Service'
import { transformServiceRateRequest, transformServiceRateResponse } from './models/ServiceRate'
import { transformShareLinkResponse } from './models/ShareLink'
import { transformTasksRequest, transformTasksResponse, transformTasksListResponse } from './models/Tasks'
import {
	transformTimeEntryRequest,
	transformTimeEntryResponse,
	transformTimeEntryListResponse,
} from './models/TimeEntry'
import { transformUserResponse } from './models/User'

// defaults
const API_BASE_URL = 'https://api.freshbooks.com'
const API_TOKEN_ENDPOINT = '/auth/oauth/token'
const API_VERSION = require('../package.json').version
const AUTH_BASE_URL = 'https://auth.freshbooks.com'
const AUTH_ENDPOINT = '/oauth/authorize'

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

	private async call<S, T>(method: Method, url: string, config?: any, data?: S, name?: string): Promise<Result<T>> {
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
				transformRequest: config?.transformRequest,
				transformResponse: config?.transformResponse,
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
					(errData.errors && errData.errors[0].message) || errData.message || statusText,
					status && status.toString(),
					errData && errData.errors
				)
			}
			throw err
		}
	}

	public readonly bills = {
		create: (bill: Bills, accountId: string): Promise<Result<Bills>> =>
			this.call(
				'POST',
				`accounting/account/${accountId}/bills/bills`,
				{
					transformRequest: transformBillsRequest,
					transformResponse: transformBillsResponse,
				},
				bill,
				'Create Bill'
			),
		single: (accountId: string, billId: number): Promise<Result<{ bill: Bills }>> =>
			this.call(
				'GET',
				`accounting/account/${accountId}/bills/bills/${billId}`,
				{ transformResponse: transformBillsResponse },
				null,
				'Get Bill'
			),
		list: (accountId: string, queryBuilders?: QueryBuilderType[]): Promise<Result<{ bills: Bills[] }>> =>
			this.call(
				'GET',
				`accounting/account/${accountId}/bills/bills${joinQueries(queryBuilders)}`,
				{ transformResponse: transformBillsListResponse },
				null,
				'List Bills'
			),
		delete: (accountId: string, billId: number): Promise<Result<Bills>> =>
			this.call(
				'PUT',
				`accounting/account/${accountId}/bills/bills/${billId}`,
				{
					transformRequest: transformBillsRequest,
					transformResponse: transformBillsResponse,
				},
				{ visState: 1 },
				'Delete Bill'
			),
		archive: (accountId: string, billId: number): Promise<Result<Bills>> =>
			this.call(
				'PUT',
				`accounting/account/${accountId}/bills/bills/${billId}`,
				{
					transformRequest: transformBillsRequest,
					transformResponse: transformBillsResponse,
				},
				{ visState: 2 },
				'Archive Bill'
			),
	}

	public readonly billPayments = {
		create: (billPayment: BillPayments, accountId: string): Promise<Result<BillPayments>> =>
			this.call(
				'POST',
				`accounting/account/${accountId}/bill_payments/bill_payments`,
				{
					transformRequest: transformBillPaymentsRequest,
					transformResponse: transformBillPaymentsResponse,
				},
				billPayment,
				'Create Bill Payment'
			),
		single: (accountId: string, billPaymentId: number): Promise<Result<{ billPayment: BillPayments }>> =>
			this.call(
				'GET',
				`accounting/account/${accountId}/bill_payments/bill_payments/${billPaymentId}`,
				{ transformResponse: transformBillPaymentsResponse },
				null,
				'Get Bill Payment'
			),
		list: (accountId: string, queryBuilders?: QueryBuilderType[]): Promise<Result<{ billPayments: BillPayments[] }>> =>
			this.call(
				'GET',
				`accounting/account/${accountId}/bill_payments/bill_payments${joinQueries(queryBuilders)}`,
				{ transformResponse: transformBillPaymentsListResponse },
				null,
				'List Bill Payments Payments'
			),
		update: (billPayment: BillPayments, accountId: string, billPaymentId: number): Promise<Result<BillPayments>> =>
			this.call(
				'PUT',
				`accounting/account/${accountId}/bill_payments/bill_payments/${billPaymentId}`,
				{
					transformRequest: transformBillPaymentsRequest,
					transformResponse: transformBillPaymentsResponse,
				},
				billPayment,
				'Update Bill Payment'
			),
		delete: (accountId: string, billPaymentId: number): Promise<Result<BillPayments>> =>
			this.call(
				'PUT',
				`accounting/account/${accountId}/bill_payments/bill_payments/${billPaymentId}`,
				{
					transformRequest: transformBillPaymentsRequest,
					transformResponse: transformBillPaymentsResponse,
				},
				{ visState: 1 },
				'Delete Bill Payment'
			),
	}

	public readonly billVendors = {
		create: (vendor: BillVendors, accountId: string): Promise<Result<BillVendors>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/bill_vendors/bill_vendors`,
				{
					transformRequest: transformBillVendorsRequest,
					transformResponse: transformBillVendorsResponse,
				},
				vendor,
				'Create BillVendors Entry'
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
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ vendors: BillVendors[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/bill_vendors/bill_vendors${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformBillVendorsListResponse,
				},
				null,
				'List BillVendors'
			),
		update: (vendor: BillVendors, accountId: string, vendorId: number): Promise<Result<BillVendors>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/bill_vendors/bill_vendors/${vendorId}`,
				{
					transformRequest: transformBillVendorsRequest,
					transformResponse: transformBillVendorsResponse,
				},
				vendor,
				'Update BillVendors Entry'
			),
		delete: (accountId: string, vendorId: number): Promise<Result<BillVendors>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/bill_vendors/bill_vendors/${vendorId}`,
				{
					transformRequest: transformBillVendorsRequest,
					transformResponse: transformBillVendorsResponse,
				},
				{
					visState: 1,
				},
				'Delete BillVendors Entry'
			),
	}

	public readonly callbacks = {
		create: (callback: Callback, accountId: string): Promise<Result<Callback>> =>
			this.call(
				'POST',
				`/events/account/${accountId}/events/callbacks`,
				{
					transformRequest: transformCallbackRequest,
					transformResponse: transformCallbackResponse,
				},
				callback,
				'Create Callback'
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
		update: (callback: Callback, accountId: string, callbackId: string): Promise<Result<Callback>> =>
			this.call(
				'PUT',
				`/events/account/${accountId}/events/callbacks/${callbackId}`,
				{
					transformRequest: transformCallbackRequest,
					transformResponse: transformCallbackResponse,
				},
				callback,
				'Update Callback'
			),
		delete: (accountId: string, callbackId: string): Promise<Result<Callback>> =>
			this.call('DELETE', `/events/account/${accountId}/events/callbacks/${callbackId}`, {}, null, 'Delete Callback'),
		resendVerification: (accountId: string, callbackId: string): Promise<Result<Callback>> =>
			this.call(
				'PUT',
				`/events/account/${accountId}/events/callbacks/${callbackId}`,
				{
					transformRequest: transformCallbackResendRequest,
					transformResponse: transformCallbackResponse,
				},
				null,
				'Verify Callback'
			),
		verify: (accountId: string, callbackId: string, verifier: string): Promise<Result<Callback>> =>
			this.call(
				'PUT',
				`/events/account/${accountId}/events/callbacks/${callbackId}`,
				{
					transformRequest: transformCallbackVerifierRequest,
					transformResponse: transformCallbackResponse,
				},
				verifier,
				'Verify Callback'
			),
	}

	public readonly clients = {
		create: (client: Client, accountId: string): Promise<Result<Client>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/users/clients`,
				{
					transformRequest: transformClientRequest,
					transformResponse: transformClientResponse,
				},
				client,
				'Create Client'
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
		update: (client: Client, accountId: string, clientId: string): Promise<Result<Client>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/users/clients/${clientId}`,
				{
					transformRequest: transformClientRequest,
					transformResponse: transformClientResponse,
				},
				client,
				'Update Client'
			),
		delete: (accountId: string, clientId: string): Promise<Result<Client>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/users/clients/${clientId}`,
				{
					transformRequest: transformClientRequest,
					transformResponse: transformClientResponse,
				},
				{
					visState: 1,
				},
				'Delete Client'
			),
	}

	public readonly creditNotes = {
		create: (creditNote: CreditNote, accountId: string): Promise<Result<CreditNote>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/credit_notes/credit_notes`,
				{
					transformRequest: transformCreditNoteRequest,
					transformResponse: transformCreditNoteResponse,
				},
				creditNote,
				'Create Credit Note'
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
		update: (creditNote: CreditNote, accountId: string, creditId: string): Promise<Result<CreditNote>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/credit_notes/credit_notes/${creditId}`,
				{
					transformRequest: transformCreditNoteRequest,
					transformResponse: transformCreditNoteResponse,
				},
				creditNote,
				'Update Credit Note'
			),
		delete: (accountId: string, creditId: string): Promise<Result<CreditNote>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/credit_notes/credit_notes/${creditId}`,
				{
					transformRequest: transformCreditNoteRequest,
					transformResponse: transformCreditNoteResponse,
				},
				{
					visState: 1,
				},
				'Delete Credit Note'
			),
	}

	public readonly expenses = {
		create: (expense: Expense, accountId: string, queryBuilders?: QueryBuilderType[]): Promise<Result<Expense>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/expenses/expenses${joinQueries(queryBuilders)}`,
				{
					transformRequest: transformExpenseRequest,
					transformResponse: transformExpenseResponse,
				},
				expense,
				'Create Expense'
			),
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
					transformRequest: transformExpenseRequest,
					transformResponse: transformExpenseResponse,
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

	public readonly expenseCategories = {
		single: (
			accountId: string,
			expenseCategoryId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<ExpenseCategory>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/expenses/categories/${expenseCategoryId}${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformExpenseCategoryResponse,
				},
				null,
				'Get Expense Category'
			),
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ categories: ExpenseCategory[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/expenses/categories${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformExpenseCategoryListResponse,
				},
				null,
				'List Expense Categories'
			),
	}

	public readonly invoices = {
		create: (invoice: Invoice, accountId: string, queryBuilders?: QueryBuilderType[]): Promise<Result<Invoice>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/invoices/invoices${joinQueries(queryBuilders)}`,
				{
					transformRequest: transformInvoiceRequest,
					transformResponse: transformInvoiceResponse,
				},
				invoice,
				'Create Invoice'
			),
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
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ invoices: Invoice[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/invoices/invoices${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformInvoiceListResponse,
				},
				null,
				'List Invoices'
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
					transformRequest: transformInvoiceRequest,
					transformResponse: transformInvoiceResponse,
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

	public readonly items = {
		create: (accountId: string, data: any): Promise<Result<Item>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/items/items`,
				{
					transformRequest: transformItemRequest,
					transformResponse: transformItemResponse,
				},
				data,
				'Create Item'
			),
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
					transformRequest: transformItemRequest,
					transformResponse: transformItemResponse,
				},
				data,
				'Update Item'
			),
	}

	public readonly journalEntries = {
		create: (
			journalEntry: JournalEntry,
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<JournalEntry>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/journal_entries/journal_entries${joinQueries(queryBuilders)}`,
				{
					transformRequest: transformJournalEntryRequest,
					transformResponse: transformJournalEntryResponse,
				},
				journalEntry,
				'Create Journal Entry'
			),
	}

	public readonly journalEntryAccounts = {
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ journalEntryAccounts: JournalEntryAccount[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/journal_entry_accounts/journal_entry_accounts${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformJournalEntryAccountListResponse,
				},
				null,
				'List Journal Entry Accounts'
			),
	}

	public readonly journalEntryDetails = {
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ journalEntryAccounts: JournalEntryDetail[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/journal_entries/journal_entry_details${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformJournalEntryDetailListResponse,
				},
				null,
				'List Journal Entry Details'
			),
	}

	public readonly otherIncomes = {
		create: (otherIncome: OtherIncome, accountId: string): Promise<Result<OtherIncome>> => {
			return this.call(
				'POST',
				`/accounting/account/${accountId}/other_incomes/other_incomes`,
				{
					transformRequest: transformOtherIncomeRequest,
					transformResponse: transformOtherIncomeResponse,
				},
				otherIncome,
				'Create OtherIncome'
			)
		},
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
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ otherIncomes: OtherIncome[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/other_incomes/other_incomes${joinQueries(queryBuilders)}`,
				{
					transformResponse: transformOtherIncomeListResponse,
				},
				null,
				'List OtherIncomes'
			),
		update: (accountId: string, otherIncomeId: string, data: any): Promise<Result<OtherIncome>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/other_incomes/other_incomes/${otherIncomeId}`,
				{
					transformRequest: transformOtherIncomeRequest,
					transformResponse: transformOtherIncomeResponse,
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

	public readonly payments = {
		create: (accountId: string, data: any): Promise<Result<Payment>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/payments/payments`,
				{
					transformRequest: transformPaymentRequest,
					transformResponse: transformPaymentResponse,
				},
				data,
				'Create Payment'
			),
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
		update: (accountId: string, paymentId: string, data: any): Promise<Result<Payment>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/payments/payments/${paymentId}`,
				{
					transformRequest: transformPaymentUpdateRequest,
					transformResponse: transformPaymentResponse,
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

	public readonly projects = {
		create: (project: Project, businessId: number): Promise<Result<Project>> =>
			this.call(
				'POST',
				`/projects/business/${businessId}/project`,
				{
					transformRequest: transformProjectRequest,
					transformResponse: transformProjectResponse,
				},
				project,
				'Create Project'
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
		list: (
			businessId: number,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ projects: Project[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/projects/business/${businessId}/projects${joinQueries(queryBuilders, 'ProjectResource')}`,
				{
					transformResponse: transformProjectListResponse,
				},
				null,
				'List Projects'
			),
		update: (project: Project, businessId: number, projectId: number): Promise<Result<Project>> =>
			this.call(
				'PUT',
				`/projects/business/${businessId}/project/${projectId}`,
				{
					transformRequest: transformProjectRequest,
					transformResponse: transformProjectResponse,
				},
				project,
				'Update Project'
			),
		delete: (businessId: number, projectId: number): Promise<Result<Project>> =>
			this.call('DELETE', `/projects/business/${businessId}/project/${projectId}`, {}, null, 'Delete Project'),
	}

	public readonly reports = {
		paymentsCollected: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ callbacks: Callback[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/reports/accounting/payments_collected${joinQueries(
					queryBuilders,
					'AccountingReportsResource'
				)}`,
				{
					transformResponse: transformPaymentsCollectedReportResponse,
				},
				null,
				'Payments Collected Report'
			),
		profitLoss: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ callbacks: Callback[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/reports/accounting/profitloss_entity${joinQueries(
					queryBuilders,
					'AccountingReportsResource'
				)}`,
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
				`/accounting/account/${accountId}/reports/accounting/taxsummary${joinQueries(
					queryBuilders,
					'AccountingReportsResource'
				)}`,
				{
					transformResponse: transformTaxSummaryReportResponse,
				},
				null,
				'Tax Summary Report'
			),
	}

	public readonly services = {
		create: (service: Service, businessId: number): Promise<Result<Service>> =>
			this.call(
				'POST',
				`/comments/business/${businessId}/service`,
				{
					transformRequest: transformServiceRequest,
					transformResponse: transformServiceResponse,
				},
				service,
				'Create Service'
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
		list: (businessId: number): Promise<Result<{ timeEntries: Service[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/comments/business/${businessId}/services`,
				{
					transformResponse: transformServiceListResponse,
				},
				null,
				'List Services'
			),
		rate: {
			create: (service: ServiceRate, businessId: number, serviceId: number): Promise<Result<ServiceRate>> =>
				this.call(
					'POST',
					`/comments/business/${businessId}/service/${serviceId}/rate`,
					{
						transformRequest: transformServiceRateRequest,
						transformResponse: transformServiceRateResponse,
					},
					service,
					'Add Service Rate'
				),
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
			update: (service: ServiceRate, businessId: number, serviceId: number): Promise<Result<ServiceRate>> =>
				this.call(
					'PUT',
					`/comments/business/${businessId}/service/${serviceId}/rate`,
					{
						transformRequest: transformServiceRateRequest,
						transformResponse: transformServiceRateResponse,
					},
					service,
					'Update Service Rate'
				),
		},
	}

	public readonly tasks = {
		create: (task: Tasks, accountId: string): Promise<Result<Tasks>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/projects/tasks`,
				{
					transformRequest: transformTasksRequest,
					transformResponse: transformTasksResponse,
				},
				task,
				'Create Tasks Entry'
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
		update: (task: Tasks, accountId: string, taskId: number): Promise<Result<Tasks>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/projects/tasks/${taskId}`,
				{
					transformRequest: transformTasksRequest,
					transformResponse: transformTasksResponse,
				},
				task,
				'Update Tasks Entry'
			),
		delete: (accountId: string, taskId: number): Promise<Result<Tasks>> =>
			this.call(
				'PUT',
				`/accounting/account/${accountId}/projects/tasks/${taskId}`,
				{
					transformRequest: transformTasksRequest,
					transformResponse: transformTasksResponse,
				},
				{
					visState: 1,
				},
				'Delete Client'
			),
	}

	public readonly timeEntries = {
		create: (timeEntry: TimeEntry, businessId: number): Promise<Result<TimeEntry>> =>
			this.call(
				'POST',
				`/timetracking/business/${businessId}/time_entries`,
				{
					transformRequest: transformTimeEntryRequest,
					transformResponse: transformTimeEntryResponse,
				},
				timeEntry,
				'Create Time Entry'
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
		list: (
			businessId: number,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ timeEntries: TimeEntry[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/timetracking/business/${businessId}/time_entries${joinQueries(queryBuilders, 'ProjectResource')}`,
				{
					transformResponse: transformTimeEntryListResponse,
				},
				null,
				'List Time Entries'
			),
		update: (timeEntry: TimeEntry, businessId: number, timeEntryId: number): Promise<Result<TimeEntry>> =>
			this.call(
				'PUT',
				`/timetracking/business/${businessId}/time_entries/${timeEntryId}`,
				{
					transformRequest: transformTimeEntryRequest,
					transformResponse: transformTimeEntryResponse,
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

	public readonly users = {
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
}
