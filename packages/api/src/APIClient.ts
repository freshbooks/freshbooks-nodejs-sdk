/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry'
import { Logger } from 'winston'
import _logger from './logger'
import APIClientError from './models/Error'

import {
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

// defaults
const API_URL = 'https://api.freshbooks.com'
const API_VERSION = require('../package.json').version

/**
 * Client for FreshBooks API
 */
export default class APIClient {
	/**
	 * Base URL for FreshBooks API
	 */
	public readonly apiUrl: string

	/**
	 * Auth token for accessing FreshBooks API
	 */
	public readonly token: string

	/**
	 * clientId
	 */
	public readonly clientId: string

	private readonly axios: AxiosInstance

	private readonly logger: Logger

	public static isNetworkRateLimitOrIdempotentRequestError(error: any): boolean {
		if (!error.config) {
			return false
		}

		return error.response.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error)
	}

	/**
	 * FreshBooks API client
	 * @param token Bearer token
	 * @param options Client config options
	 * @param logger Custom logger
	 */
	constructor(token: string, options?: Options, logger = _logger) {
		const defaultRetry = {
			retries: 10,
			retryDelay: axiosRetry.exponentialDelay, // ~100ms, 200ms, 400ms, 800ms
			retryCondition: APIClient.isNetworkRateLimitOrIdempotentRequestError, // 429, 5xx, or network error
		}
		const { apiUrl = API_URL, retryOptions = defaultRetry } = options || {}

		this.token = token
		this.apiUrl = apiUrl
		this.logger = logger

		if (!options?.clientId) {
			throw new APIClientError('missing clientId', 'missing clientId')
		}

		this.clientId = options.clientId

		let userAgent = `FreshBooks nodejs sdk/${API_VERSION} client_id ${this.clientId}`
		if (options?.userAgent) {
			userAgent = options?.userAgent
		}

		// setup axios
		this.axios = axios.create({
			baseURL: apiUrl,
			headers: {
				Authorization: `Bearer ${token}`,
				'Api-Version': 'alpha',
				'Content-Type': 'application/json',
				'User-Agent': userAgent,
			},
		})

		// setup retry logic
		axiosRetry(this.axios, retryOptions)
	}

	private async call<S, T>(
		method: Method,
		url: string,
		config?: AxiosRequestConfig,
		data?: S,
		name?: string
	): Promise<Result<T>> {
		try {
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
		} catch (err) {
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
}

export interface Options {
	apiUrl?: string
	retryOptions?: IAxiosRetryConfig
	clientId: string
	userAgent?: string
}

export interface Result<T> {
	ok: boolean
	data?: T
	error?: Error
}
