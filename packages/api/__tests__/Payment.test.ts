/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient from '../src/APIClient'
import Payment from '../src/models/Payment'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'
import { joinQueries } from '../src/models/builders'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

const ACCOUNT_ID = 'zDmNq'
const PAYMENT_ID = '115804'

const buildMockResponse = (paymentProperties: any = {}): string =>
	JSON.stringify({
		accounting_systemid: 'xZNQ1X',
		amount: {
			amount: '100.00',
			code: 'USD',
		},
		clientid: 212566,
		creditid: null,
		date: '2019-10-22',
		from_credit: false,
		gateway: null,
		id: 115804,
		invoiceid: 197902,
		logid: 115804,
		note: '',
		orderid: null,
		overpaymentid: null,
		transactionid: null,
		type: 'Cash',
		updated: '2019-11-29 12:18:29',
		vis_state: 0,
		...paymentProperties,
	})

const buildMockRequest = (
	paymentProperties: any = {},
	isPOSTRequest = true
): any => {
	const POSTOnlyProperties = {
		invoiceid: 197902,
		vis_state: 0,
	}
	const request = {
		amount: {
			amount: 100,
			code: 'USD',
		},
		date: '2019-10-22',
		note: '',
		orderid: null,
		transactionid: null,
		type: 'Cash',
		...paymentProperties,
	}

	return isPOSTRequest
		? { payment: { ...request, ...POSTOnlyProperties } }
		: { payment: request }
}

const buildPayment = (paymentProperties: any = {}): Payment => ({
	accountingSystemId: 'xZNQ1X',
	amount: {
		amount: 100,
		code: 'USD',
	},
	clientId: 212566,
	creditId: null,
	date: new Date('2019-10-22 00:00:00'),
	fromCredit: false,
	gateway: null,
	id: 115804,
	invoiceId: 197902,
	logId: 115804,
	note: '',
	orderId: null,
	overpaymentId: null,
	transactionId: null,
	type: 'Cash',
	updated: new Date('2019-11-29 12:18:29'),
	visState: 0,
	...paymentProperties,
})

describe('@freshbooks/api', () => {
	describe('Payment', () => {
		test('GET /accounting/account/<accountid>/payments/payments/<paymentid>', async () => {
			const token = 'token'
			const client = new APIClient(token)

			const mockResponse = `{ 
					"response":{
                        "result": {
                            "payment": ${buildMockResponse()}
                        }
					}
				 }`

			mock
				.onGet(
					`/accounting/account/${ACCOUNT_ID}/payments/payments/${PAYMENT_ID}`
				)
				.replyOnce(200, mockResponse)

			const { data } = await client.payments.single(ACCOUNT_ID, PAYMENT_ID)

			const expected = buildPayment()

			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountid>/payments/payments', async () => {
			const token = 'token'
			const client = new APIClient(token)

			const mockResponse = `{ 
					"response":{
                        "result": {
                            "payments": [${buildMockResponse()}],
                            "page": 1,
                            "pages": 1,
                            "per_page": 15,
                            "total": 1
                        }
					}
				 }`

			mock
				.onGet(`/accounting/account/${ACCOUNT_ID}/payments/payments`)
				.replyOnce(200, mockResponse)

			const { data } = await client.payments.list(ACCOUNT_ID)

			const expected = {
				payments: [buildPayment()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}

			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountid>/payments/payments?search[type]=Cash', async () => {
			const token = 'token'
			const client = new APIClient(token)

			const builder = new SearchQueryBuilder().equals('type', 'Cash')

			const mockResponse = `{ 
					"response":{
                        "result": {
                            "payments": [${buildMockResponse()}],
                            "page": 1,
                            "pages": 1,
                            "per_page": 15,
                            "total": 1
                        }
					}
				 }`

			mock
				.onGet(
					`/accounting/account/${ACCOUNT_ID}/payments/payments${joinQueries([
						builder,
					])}`
				)
				.replyOnce(200, mockResponse)

			const { data } = await client.payments.list(ACCOUNT_ID, [builder])

			const expected = {
				payments: [buildPayment()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}

			expect(data).toEqual(expected)
		})

		test('POST /accounting/account/<accountId>/payments/payments', async () => {
			const token = 'token'
			const client = new APIClient(token)

			const mockRequest = buildMockRequest()
			const mockResponse = `{
				"response":{
					"result":{
						"payment": ${buildMockResponse()}
					}
				}
			}
				`

			mock
				.onPost(
					`/accounting/account/${ACCOUNT_ID}/payments/payments`,
					mockRequest
				)
				.replyOnce(200, mockResponse)

			const expected = buildPayment()

			const { data } = await client.payments.create(ACCOUNT_ID, expected)

			expect(data).toEqual(expected)
		})

		test('PUT /accounting/account/<accountId>/payments/payments/<paymentId>', async () => {
			const token = 'token'
			const client = new APIClient(token)

			const mockRequest = buildMockRequest({}, false)
			const mockResponse = `{
				"response":{
					"result":{
						"payment": ${buildMockResponse()}
					}
				}
			}
				`

			mock
				.onPut(
					`/accounting/account/${ACCOUNT_ID}/payments/payments/${PAYMENT_ID}`,
					mockRequest
				)
				.replyOnce(200, mockResponse)

			const expected = buildPayment()

			const { data } = await client.payments.update(
				ACCOUNT_ID,
				PAYMENT_ID,
				expected
			)

			expect(data).toEqual(expected)
		})

		test('PUT /accounting/account/<accountId>/payments/payments/<paymentId> (delete)', async () => {
			const token = 'token'
			const client = new APIClient(token)

			const mockRequest = {
				payment: {
					vis_state: 1,
				},
			}
			const mockResponse = `{
				"response":{
					"result":{
						"payment": ${buildMockResponse({ vis_state: 1 })}
					}
				}
			}
			`

			mock
				.onPut(
					`/accounting/account/${ACCOUNT_ID}/payments/payments/${PAYMENT_ID}`,
					mockRequest
				)
				.replyOnce(200, mockResponse)

			const expected = buildPayment({ visState: 1 })

			const { data } = await client.payments.delete(ACCOUNT_ID, PAYMENT_ID)

			expect(data).toEqual(expected)
		})
	})
})
