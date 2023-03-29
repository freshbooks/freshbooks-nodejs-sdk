/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import Expense from '../src/models/Expense'
import { joinQueries } from '../src/models/builders'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'
import { transformExpenseCategoryParsedResponse } from '../src/models/ExpenseCategory'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

const ACCOUNT_ID = 'zDmNq'
const EXPENSE_ID = '43221133'
const APPLICATION_CLIENT_ID = 'test-client-id'

const buildMockResponse = (expenseProperties: any = {}): string =>
	JSON.stringify({
		account_name: '',
		accountid: null,
		accounting_systemid: ACCOUNT_ID,
		amount: {
			amount: '2000.00',
			code: 'USD',
		},
		bank_name: '',
		categoryid: 3012676,
		clientid: 0,
		compounded_tax: false,
		date: '2019-10-10',
		expenseid: EXPENSE_ID,
		ext_invoiceid: 0,
		ext_systemid: 0,
		from_bulk_import: false,
		has_receipt: false,
		id: EXPENSE_ID,
		include_receipt: false,
		invoiceid: null,
		is_cogs: false,
		isduplicate: false,
		markup_percent: '0',
		notes: '',
		profileid: null,
		projectid: 0,
		staffid: 1,
		status: 0,
		category: undefined,
		taxAmount1: null,
		taxAmount2: null,
		taxName1: null,
		taxName2: null,
		taxPercent1: 0,
		taxPercent2: 0,
		transactionid: null,
		updated: '2019-12-02 12:36:05',
		vendor: null,
		vis_state: 0,
		...expenseProperties,
	})

const buildExpense = (expenseProperties: any = {}): Expense => ({
	accountId: null,
	accountingSystemId: ACCOUNT_ID,
	accountName: '',
	amount: { amount: '2000.00', code: 'USD' },
	bankName: '',
	categoryId: '3012676',
	clientId: '0',
	compoundedTax: false,
	date: new Date('Thu Oct 10 2019 00:00:00'),
	expenseId: EXPENSE_ID,
	extInvoiceId: '0',
	extSystemId: '0',
	hasReceipt: false,
	id: EXPENSE_ID,
	invoiceId: null,
	isDuplicate: false,
	markupPercent: 0,
	notes: '',
	profileId: null,
	projectId: '0',
	staffId: '1',
	status: 0,
	taxAmount1: null,
	taxAmount2: null,
	taxName1: null,
	taxName2: null,
	taxPercent1: 0,
	taxPercent2: 0,
	transactionId: null,
	updated: new Date('2019-12-02T17:36:05Z'),
	vendor: null,
	visState: 0,
	...expenseProperties,
})

const buildMockRequest = (expenseProperties: any = {}): any => ({
	expense: {
		account_name: '',
		accountid: null,
		amount: { amount: '2000.00', code: 'USD' },
		bank_name: '',
		categoryid: '3012676',
		clientid: '0',
		compounded_tax: false,
		date: '2019-10-10',
		expenseid: EXPENSE_ID,
		ext_invoiceid: '0',
		ext_systemid: '0',
		has_receipt: false,
		id: EXPENSE_ID,
		invoiceid: null,
		isduplicate: false,
		markup_percent: 0,
		notes: '',
		profileid: null,
		projectid: '0',
		staffid: '1',
		status: 0,
		taxAmount1: null,
		taxAmount2: null,
		taxName1: null,
		taxName2: null,
		taxPercent1: 0,
		taxPercent2: 0,
		transactionid: null,
		vendor: null,
		vis_state: 0,
		...expenseProperties,
	},
})

const testOptions: Options = { accessToken: 'token' }

describe('@freshbooks/api', () => {
	describe('Expense', () => {
		test('GET /accounting/account/<accountid>/expenses/expenses/<id>', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `{
					"response":{
                        "result": {
                            "expense": ${buildMockResponse()}
                        }
					}
				 }`

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/expenses/expenses/${EXPENSE_ID}`).replyOnce(200, mockResponse)

			const { data } = await client.expenses.single(ACCOUNT_ID, EXPENSE_ID)

			const expected = buildExpense()
			expect(expected).toEqual(data)
		})

		test('GET /accounting/account/<accountid>/expenses/expenses', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `{
					"response":{
                        "result": {
                            "expenses": [${buildMockResponse()}],
                            "page": 1,
							"pages": 1,
							"per_page": 15,
							"total": 1
                        }
					}
				 }`

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/expenses/expenses`).replyOnce(200, mockResponse)

			const { data } = await client.expenses.list(ACCOUNT_ID)

			const expected = {
				expenses: [buildExpense()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			expect(expected).toEqual(data)
		})

		test('GET /accounting/account/<accountid>/expenses/expenses?include[]=category', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const category = {
				category: 'Accident Insurance',
				categoryid: 3012676,
				created_at: '2019-06-05 11:42:54',
				id: 3012676,
				is_cogs: false,
				is_editable: false,
				parentid: 3012670,
				updated_at: '2019-06-05 11:42:54',
				vis_state: 0,
			}

			const mockResponse = `{
					"response":{
                        "result": {
                            "expenses": [
                                ${buildMockResponse({ category })}],
                            "page": 1,
							"pages": 1,
							"per_page": 15,
							"total": 1
                        }
					}
				 }`

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/expenses/expenses`).replyOnce(200, mockResponse)

			const { data } = await client.expenses.list(ACCOUNT_ID)

			const expected = {
				expenses: [
					buildExpense({
						category: transformExpenseCategoryParsedResponse(category),
					}),
				],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			expect(expected).toEqual(data)
		})

		test(`GET /accounting/account/<accountid>/expenses/expenses/search[expenseid]=${EXPENSE_ID}`, async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `{
					"response":{
                        "result": {
                            "expenses": [${buildMockResponse()}],
                            "page": 1,
							"pages": 1,
							"per_page": 15,
							"total": 1
                        }
					}
				 }`

			const builder = new SearchQueryBuilder().equals('expenseid', EXPENSE_ID)

			mock
				.onGet(`/accounting/account/${ACCOUNT_ID}/expenses/expenses${joinQueries([builder])}`)
				.replyOnce(200, mockResponse)

			const { data } = await client.expenses.list(ACCOUNT_ID, [builder])

			const expected = {
				expenses: [buildExpense()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			expect(expected).toEqual(data)
		})

		test('POST /accounting/account/<accountid>/expenses/expenses', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `{
					"response":{
                        "result": {
                            "expense": ${buildMockResponse()}
                        }
					}
                 }`

			const mockRequest = buildMockRequest()
			mock.onPost(`/accounting/account/${ACCOUNT_ID}/expenses/expenses`, mockRequest).replyOnce(200, mockResponse)

			const expected = buildExpense()

			const { data } = await client.expenses.create(expected, ACCOUNT_ID)

			expect(data).toEqual(expected)
		})

		test('PUT /accounting/account/<accountid>/expenses/expenses/<expenseid>', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `{
					"response":{
                        "result": {
                            "expense": ${buildMockResponse()}
                        }
					}
                 }`

			const mockRequest = buildMockRequest()
			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/expenses/expenses/${EXPENSE_ID}`, mockRequest)
				.replyOnce(200, mockResponse)

			const expected = buildExpense()

			const { data } = await client.expenses.update(expected, ACCOUNT_ID, EXPENSE_ID)

			expect(data).toEqual(expected)
		})

		test('PUT /accounting/account/<accountid>/expenses/expenses/<expenseid> (delete)', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `
            {"response":
                {
                    "result": {
                        "expense": ${buildMockResponse({ vis_state: 1 })}
                    }
                }
            }`
			const mockRequest = { expense: { vis_state: 1 } }
			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/expenses/expenses/${EXPENSE_ID}`, mockRequest)
				.replyOnce(200, mockResponse)

			const { data } = await client.expenses.delete(ACCOUNT_ID, EXPENSE_ID)
			const expense = buildExpense({ visState: 1 })

			expect(data).toEqual(expense)
		})
	})
})
