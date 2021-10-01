/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import { Bills } from '../src/models'
import { joinQueries } from '../src/models/builders'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'

const mock = new MockAdapter(axios)
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = {}
const token = 'token'
const client = new APIClient(APPLICATION_CLIENT_ID, token, testOptions)

const ACCOUNT_ID = 'zDmNq'
const BILL_ID = 43221133
const VENDOR_ID = 1234413

const buildBillsResponse = (billProperties: any = {}): string =>
	JSON.stringify({
		amount: {
			amount: '1500.00',
			code: 'CAD',
		},
		attachment: null,
		bill_number: 'BN101',
		bill_payments: [
			{
				id: 123445,
				amount: {
					amount: '1500.00',
					code: 'CAD',
				},
				billid: BILL_ID,
				paid_date: '2021-09-01',
				payment_type: 'Check',
				note: null,
				vis_state: 0,
			},
		],
		created_at: '2021-09-01 15:30:29',
		currency_code: 'CAD',
		due_date: '2021-09-01',
		due_offset_days: 25,
		id: BILL_ID,
		issue_date: '2021-09-01',
		language: 'en',
		lines: [
			{
				category: 'Equipment',
				categoryid: 3696445,
				list_index: 1,
				description: 'Raw material',
				quantity: 10,
				unit_cost: {
					amount: '15.00',
					code: 'CAD',
				},
				amount: {
					amount: '1500.00',
					code: 'CAD',
				},
				total_amount: {
					amount: '1500.00',
					code: 'CAD',
				},
				tax_name1: null,
				tax_name2: null,
				tax_percent1: null,
				tax_percent2: null,
				tax_authorityid1: null,
				tax_authorityid2: null,
				tax_amount1: null,
				tax_amount2: null,
			},
		],
		outstanding: {
			amount: '2500.00',
			code: 'CAD',
		},
		overall_category: 'Equipment',
		overall_description: 'Raw material',
		paid: {
			amount: '0.00',
			code: 'CAD',
		},
		status: 'unpaid',
		tax_amount: {
			amount: '0.00',
			code: 'CAD',
		},
		total_amount: {
			amount: '1500.00',
			code: 'CAD',
		},
		updated_at: '2021-09-01 15:30:29',
		vendorid: VENDOR_ID,
		vis_state: 0,
		vendor: {
			account_number: '45454545',
			city: 'San Francisco',
			country: 'United States',
			currency_code: 'USD',
			is_1099: false,
			language: 'en',
			note: null,
			outstanding_balance: [],
			overdue_balance: [],
			phone: '4158859378',
			postal_code: null,
			primary_contact_email: 'someone@ikea.com',
			primary_contact_first_name: 'Jimmy',
			primary_contact_last_name: 'McNamara',
			province: 'California',
			street: '332 Carlton Ave.',
			street2: null,
			tax_defaults: [],
			created_at: '2021-06-17 12:08:25',
			updated_at: '2021-06-17 12:08:25',
			vendor_name: 'IKEA',
			vendor_id: 1563,
			vis_state: 0,
			website: 'ikea.com',
		},
		...billProperties,
	})

const buildBillsRequest = (billProperties: any = {}): any => {
	return {
		bill: {
			vendorid: VENDOR_ID,
			issue_date: '2021-09-01',
			due_offset_days: 30,
			currency_code: 'CAD',
			language: 'en',
			lines: [
				{
					categoryid: 3696445,
					description: 'Raw material',
					quantity: 10,
					unit_cost: {
						amount: 15,
						code: 'CAD',
					},
				},
			],
			...billProperties,
		},
	}
}

const buildBills = (billProperties: any = {}): Bills => ({
	amount: {
		amount: 1500,
		code: 'CAD',
	},
	attachment: null,
	billNumber: 'BN101',
	billPayments: [
		{
			id: 123445,
			amount: {
				amount: 1500,
				code: 'CAD',
			},
			billId: BILL_ID,
			paidDate: new Date('2021-09-01 00:00:00'),
			paymentType: 'Check',
			note: null,
			visState: 0,
		},
	],
	createdAt: new Date('2021-09-01T15:30:29Z'),
	currencyCode: 'CAD',
	dueDate: new Date('2021-09-01 00:00:00'),
	dueOffsetDays: 25,
	id: BILL_ID,
	issueDate: new Date('2021-09-01 00:00:00'),
	language: 'en',
	lines: [
		{
			category: 'Equipment',
			categoryId: 3696445,
			listIndex: 1,
			description: 'Raw material',
			quantity: 10,
			unitCost: {
				amount: 15,
				code: 'CAD',
			},
			amount: {
				amount: 1500,
				code: 'CAD',
			},
			totalAmount: {
				amount: 1500,
				code: 'CAD',
			},
			taxName1: null,
			taxName2: null,
			taxPercent1: null,
			taxPercent2: null,
			taxAuthorityId1: null,
			taxAuthorityId2: null,
			taxAmount1: null,
			taxAmount2: null,
		},
	],
	outstanding: {
		amount: 2500,
		code: 'CAD',
	},
	overallCategory: 'Equipment',
	overallDescription: 'Raw material',
	paid: {
		amount: 0,
		code: 'CAD',
	},
	status: 'unpaid',
	taxAmount: {
		amount: 0,
		code: 'CAD',
	},
	totalAmount: {
		amount: 1500,
		code: 'CAD',
	},
	updatedAt: new Date('2021-09-01T15:30:29Z'),
	vendorId: VENDOR_ID,
	visState: 0,
	vendor: {
		accountNumber: '45454545',
		city: 'San Francisco',
		country: 'United States',
		currencyCode: 'USD',
		is1099: false,
		language: 'en',
		note: null,
		outstandingBalance: [],
		overdueBalance: [],
		phone: '4158859378',
		postalCode: null,
		primaryContactEmail: 'someone@ikea.com',
		primaryContactFirstName: 'Jimmy',
		primaryContactLastName: 'McNamara',
		province: 'California',
		street: '332 Carlton Ave.',
		street2: null,
		taxDefaults: [],
		createdAt: new Date('2021-06-17T16:08:25.000Z'),
		updatedAt: new Date('2021-06-17T16:08:25.000Z'),
		vendorName: 'IKEA',
		vendorId: 1563,
		visState: 0,
		website: 'ikea.com',
	},
	...billProperties,
})

describe('@freshbooks/api', () => {
	describe('Bills', () => {
		test('GET /accounting/account/<accountId>/bills/bills/<billId> single', async () => {
			const response = `
				{
					"response":{
						"result":{
						  "bill": ${buildBillsResponse()}
						}
					}
				}
			`
			const expected = buildBills()
			mock.onGet(`/accounting/account/${ACCOUNT_ID}/bills/bills/${BILL_ID}`).replyOnce(200, response)

			const { data } = await client.bills.single(ACCOUNT_ID, BILL_ID)
			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountId>/bills/bills list', async () => {
			const response = `
				{
					"response": {
						"result": {
							"bills": [
								${buildBillsResponse()}
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
				bills: [buildBills()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			const builder = new SearchQueryBuilder().equals('currency_code', 'CAD').in('ids', [43221133])
			const qs = joinQueries([builder])
			mock.onGet(`/accounting/account/${ACCOUNT_ID}/bills/bills${qs}`).replyOnce(200, response)

			const { data } = await client.bills.list(ACCOUNT_ID, [builder])
			expect(data).toEqual(expected)
		})
		test('POST /accounting/account/<accountId>/bills/bills create', async () => {
			const response = `
				{
					"response":{
						"result":{
						  "bill": ${buildBillsResponse()}
						}
					}
				}
			`

			const billsRequest = buildBillsRequest()

			const modelBillRequest: Bills = {
				vendorId: VENDOR_ID,
				issueDate: new Date('2021-09-01 00:00:00'),
				dueOffsetDays: 30,
				currencyCode: 'CAD',
				language: 'en',
				lines: [
					{
						categoryId: 3696445,
						description: 'Raw material',
						quantity: 10,
						unitCost: {
							amount: 15,
							code: 'CAD',
						},
					},
				],
			}

			mock.onPost(`accounting/account/${ACCOUNT_ID}/bills/bills`, billsRequest).replyOnce(200, response)

			const { data } = await client.bills.create(modelBillRequest, ACCOUNT_ID)
			expect(data?.id).not.toBeNull()
		})
		test('PUT /accounting/account/<accountId>/bills/bills/<billId> delete', async () => {
			const response = `
				{
					"response":{
						"result":{
						  "bill": ${buildBillsResponse({ vis_state: 1 })}
						}
					}
				}
			`
			const expected = buildBills({ visState: 1 })
			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/bills/bills/${BILL_ID}`, { bill: { vis_state: 1 } })
				.replyOnce(200, response)

			const { data } = await client.bills.delete(ACCOUNT_ID, BILL_ID)
			expect(data).toEqual(expected)
		})
		test('PUT /accounting/account/<accountId>/bills/bills/<billId> archive', async () => {
			const response = `
				{
					"response":{
						"result":{
						  "bill": ${buildBillsResponse({ vis_state: 2 })}
						}
					}
				}
			`
			const expected = buildBills({ visState: 2 })
			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/bills/bills/${BILL_ID}`, { bill: { vis_state: 2 } })
				.replyOnce(200, response)

			const { data } = await client.bills.archive(ACCOUNT_ID, BILL_ID)
			expect(data).toEqual(expected)
		})
	})
})
