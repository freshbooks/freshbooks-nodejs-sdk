/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import { Logger } from 'winston'
import _logger from './logger'
import { Error, Pagination, Invoice, User, Item } from './models'
import { transformUserResponse } from './models/User'
import {
	transformListInvoicesResponse,
	transformInvoiceResponse,
	transformInvoiceRequest,
} from './models/Invoices'
import {
	transformItemResponse,
	transformItemListResponse,
	transformItemRequest,
} from './models/Item'
import Client, {
	transformClientResponse,
	transformClientListResponse,
	transformClientRequest,
} from './models/Client'
import Payment, {
	transformPaymentListResponse,
	transformPaymentResponse,
	transformPaymentRequest,
	transformPaymentUpdateRequest,
} from './models/Payment'
import { QueryBuilderType, joinQueries } from './models/builders'
import APIClientError from './models/Error'
import Expense, {
	transformExpenseResponse,
	transformExpenseListResponse,
	transformExpenseRequest,
} from './models/Expense'

// defaults
const API_URL = 'https://api.freshbooks.com'

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
		data?: S,
		name?: string
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
		} catch ({
			response: {
				status,
				statusText,
				data: { code, message, errors },
			},
		}) {
			throw new APIClientError(
				name || '',
				message || statusText,
				(code && code.toString()) || (status && status.toString()),
				errors
			)
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
				{},
				'Get Identity'
			),
	}

	public readonly clients = {
		/**
		 * Get own identity user
		 */
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ clients: Client[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/users/clients${joinQueries(
					queryBuilders
				)}`,
				{
					transformResponse: transformClientListResponse,
				},
				{},
				'List Clients'
			),
		single: (accountId: string, clientId: string): Promise<Result<Client>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/users/clients/${clientId}`,
				{
					transformResponse: transformClientResponse,
				},
				{},
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
		update: (
			client: Client,
			accountId: string,
			clientId: string
		): Promise<Result<Client>> =>
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
				`/accounting/account/${accountId}/invoices/invoices${joinQueries(
					queryBuilders
				)}`,
				{
					transformResponse: transformListInvoicesResponse,
				},
				{},
				'List Invoices'
			),
		/**
		 * Get single invoice
		 */
		single: (accountId: string, invoiceId: string): Promise<Result<Invoice>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/invoices/invoices/${invoiceId}`,
				{
					transformResponse: transformInvoiceResponse,
				},
				{},
				'Get Invoice'
			),
		/**
		 * Post invoice
		 */
		create: (
			invoice: Invoice,
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<Invoice>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/invoices/invoices${joinQueries(
					queryBuilders
				)}`,
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
				`/accounting/account/${accountId}/invoices/invoices/${invoiceId}${joinQueries(
					queryBuilders
				)}`,
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

	public readonly expenses = {
		single: (
			accountId: string,
			expenseId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<Expense>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/expenses/expenses/${expenseId}${joinQueries(
					queryBuilders
				)}`,
				{
					transformResponse: transformExpenseResponse,
				},
				{},
				'Get Expense'
			),
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ expenses: Expense[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/expenses/expenses${joinQueries(
					queryBuilders
				)}`,
				{
					transformResponse: transformExpenseListResponse,
				},
				{},
				'List Expenses'
			),

		create: (
			expense: Expense,
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<Expense>> =>
			this.call(
				'POST',
				`/accounting/account/${accountId}/expenses/expenses${joinQueries(
					queryBuilders
				)}`,
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
				`/accounting/account/${accountId}/expenses/expenses/${expenseId}${joinQueries(
					queryBuilders
				)}`,
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
				{},
				'Get Item'
			),

		list: (
			accountId: string
		): Promise<Result<{ items: Item[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/items/items`,
				{
					transformResponse: transformItemListResponse,
				},
				{},
				'List Items'
			),
		update: (
			accountId: string,
			itemId: string,
			data: any
		): Promise<Result<Item>> =>
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
				{},
				'Get Payment'
			),
		list: (
			accountId: string,
			queryBuilders?: QueryBuilderType[]
		): Promise<Result<{ payments: Payment[]; pages: Pagination }>> =>
			this.call(
				'GET',
				`/accounting/account/${accountId}/payments/payments${joinQueries(
					queryBuilders
				)}`,
				{
					transformResponse: transformPaymentListResponse,
				},
				{},
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
		update: (
			accountId: string,
			paymentId: string,
			data: any
		): Promise<Result<Payment>> =>
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
}

export interface Options {
	apiUrl?: string
}

export interface Result<T> {
	ok: boolean
	data?: T
	error?: Error
}
