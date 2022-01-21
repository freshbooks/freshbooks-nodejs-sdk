/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import { BillPayments } from '../src/models'
import { joinQueries } from '../src/models/builders'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'

enum PaymentType {
	check = 'Check',
	credit = 'Credit',
	cash = 'Cash',
}

const mock = new MockAdapter(axios)
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)
const ACCOUNT_ID = 'zDmNq'
const BILL_PAYMENT_ID = 122334455
const BILL_ID = 43221133

const buildBillPaymentsResponse = (billPaymentProperties: any = {}): string =>
	JSON.stringify({
		amount: {
			amount: '4000.00',
			code: 'USD',
		},
		billid: BILL_ID,
		id: BILL_PAYMENT_ID,
		note: 'Test Payment via API',
		paid_date: '2021-09-01',
		payment_type: 'Check',
		vis_state: 0,
		...billPaymentProperties,
	})

const buildBillPaymentRequest = (billPaymentProperties: any = {}): any => {
	return {
		bill_payment: {
			billid: BILL_ID,
			amount: {
				amount: 4000,
				code: 'USD',
			},
			payment_type: 'Check',
			paid_date: '2021-09-01',
			note: 'Test Payment via API',
			...billPaymentProperties,
		},
	}
}

const buildBillPayments = (billPaymentProperties: any = {}): BillPayments => ({
	id: BILL_PAYMENT_ID,
	amount: {
		amount: 4000,
		code: 'USD',
	},
	billId: BILL_ID,
	paidDate: new Date('2021-09-01 00:00:00'),
	paymentType: PaymentType.check,
	note: 'Test Payment via API',
	visState: 0,
	...billPaymentProperties,
})

describe('@freshbooks/api', () => {
	describe('BillPayments', () => {
		test('GET /accounting/account/<accountId>/bill_payments/bill_payments/<billPaymentId> single', async () => {
			const response = `
				{
					"response": {
						"result": {
						  "bill_payment": ${buildBillPaymentsResponse()}
						}
					}
				}
			`

			const expected = buildBillPayments()

			mock
				.onGet(`/accounting/account/${ACCOUNT_ID}/bill_payments/bill_payments/${BILL_PAYMENT_ID}`)
				.replyOnce(200, response)
			const { data } = await client.billPayments.single(ACCOUNT_ID, BILL_PAYMENT_ID)
			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountId>/bill_payments/bill_payments list', async () => {
			const response = `
				{
					"response": {
						"result": {
							"bill_payments": [
								${buildBillPaymentsResponse()}
							],
						  	"page": 1,
						  	"pages": 1,
						  	"per_page": 15,
						  	"total": 1
						}
					}
				}
			`

			const expected = {
				billPayments: [buildBillPayments()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}

			const builder = new SearchQueryBuilder().equals('payment_type', 'Check')
			const qs = joinQueries([builder])
			mock.onGet(`/accounting/account/${ACCOUNT_ID}/bill_payments/bill_payments${qs}`).replyOnce(200, response)

			const { data } = await client.billPayments.list(ACCOUNT_ID, [builder])
			expect(data).toEqual(expected)
		})
		test('POST /accounting/account/<accountId>/bill_payments/bill_payments create', async () => {
			const response = `
				{
					"response":{
						"result":{
						  "bill_payment": ${buildBillPaymentsResponse()}
						}
					}
				}
			`

			const billPaymentRequest = buildBillPaymentRequest()

			const modelBillPaymentRequest: BillPayments = {
				billId: BILL_ID,
				amount: {
					amount: 4000,
					code: 'USD',
				},
				paymentType: PaymentType.check,
				paidDate: new Date('2021-09-01 00:00:00'),
				note: 'Test Payment via API',
			}

			mock
				.onPost(`accounting/account/${ACCOUNT_ID}/bill_payments/bill_payments`, billPaymentRequest)
				.replyOnce(200, response)

			const { data } = await client.billPayments.create(modelBillPaymentRequest, ACCOUNT_ID)
			expect(data?.id).not.toBeNull()
		})
		test('PUT /accounting/account/<accountId>/bill_payments/bill_payments/<billPaymentId> update', async () => {
			const response = `
				{
					"response":{
						"result":{
						  "bill_payment": ${buildBillPaymentsResponse({ note: 'Test Payment via API Updated' })}
						}
					}
				}
			`
			const billPaymentRequest = buildBillPaymentRequest({ id: BILL_PAYMENT_ID, note: 'Test Payment via API Updated' })
			const modelBillPaymentRequest: BillPayments = {
				id: BILL_PAYMENT_ID,
				billId: BILL_ID,
				amount: {
					amount: 4000,
					code: 'USD',
				},
				paymentType: PaymentType.check,
				paidDate: new Date('2021-09-01 00:00:00'),
				note: 'Test Payment via API Updated',
			}

			const expected = buildBillPayments({ note: 'Test Payment via API Updated' })

			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/bill_payments/bill_payments/${BILL_PAYMENT_ID}`, billPaymentRequest)
				.replyOnce(200, response)

			const { data } = await client.billPayments.update(modelBillPaymentRequest, ACCOUNT_ID, BILL_PAYMENT_ID)
			expect(data).toEqual(expected)
		})
		test('PUT /accounting/account/<accountId>/bill_payments/bill_payments/<billPaymentId> delete', async () => {
			const response = `
				{
					"response":{
						"result":{
						  "bill_payment": ${buildBillPaymentsResponse({ vis_state: 1 })}
						}
					}
				}
			`

			const expected = buildBillPayments({ visState: 1 })

			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/bill_payments/bill_payments/${BILL_PAYMENT_ID}`, {
					bill_payment: { vis_state: 1 },
				})
				.replyOnce(200, response)

			const { data } = await client.billPayments.delete(ACCOUNT_ID, BILL_PAYMENT_ID)
			expect(data).toEqual(expected)
		})
	})
})
