/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client, { Options } from '../src/APIClient'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'
import { transformPaymentsCollectedReportData } from '../src/models/report/PaymentsCollectedReport'

const mock = new MockAdapter(axios)
const ACCOUNT_ID = 'xZNQ1X'
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }
const PAYMENTS_COLLECTED_REPORT_RESPONSE = JSON.stringify({
	clientids: [12345, 54321],
	currency_codes: ['CAD', 'EUR'],
	download_token: 'long.downloadtoken',
	end_date: '2022-09-30',
	payment_methods: ['Cash', 'Check', 'Credit'],
	payments: [
		{
			amount: {
				amount: '53.13',
				code: 'EUR',
			},
			client: 'French Press',
			clientid: 54321,
			credit_number: null,
			creditid: null,
			date: '2021-11-09',
			description: 'AK',
			from_credit: false,
			invoice_number: 'AF100529',
			invoiceid: 91210,
			method: 'Check',
		},
		{
			amount: {
				amount: '100.00',
				code: 'CAD',
			},
			client: 'test',
			clientid: 12345,
			credit_number: '0000003',
			creditid: 976,
			date: '2021-10-29',
			description: '',
			from_credit: false,
			invoice_number: null,
			invoiceid: null,
			method: 'Credit',
		},
		{
			amount: {
				amount: '400.00',
				code: 'CAD',
			},
			client: 'test',
			clientid: 12345,
			credit_number: '0000001',
			creditid: 974,
			date: '2021-10-29',
			description: 'Overpayment: invoice #AF100520',
			from_credit: false,
			invoice_number: null,
			invoiceid: null,
			method: 'Cash',
		},
	],
	start_date: '2021-10-01',
	summary_only: false,
	totals: [
		{
			amount: '500.00',
			code: 'CAD',
		},
		{
			amount: '53.13',
			code: 'EUR',
		},
	],
})
const EXPECTED = {
	clientIds: [12345, 54321],
	currencyCodes: ['CAD', 'EUR'],
	downloadToken: 'long.downloadtoken',
	endDate: '2022-09-30',
	paymentMethods: ['Cash', 'Check', 'Credit'],
	payments: [
		{
			amount: {
				amount: 53.13,
				code: 'EUR',
			},
			client: 'French Press',
			clientId: 54321,
			creditNumber: null,
			creditId: null,
			date: '2021-11-09',
			description: 'AK',
			fromCredit: false,
			invoiceNumber: 'AF100529',
			invoiceId: 91210,
			method: 'Check',
		},
		{
			amount: {
				amount: 100.0,
				code: 'CAD',
			},
			client: 'test',
			clientId: 12345,
			creditNumber: '0000003',
			creditId: 976,
			date: '2021-10-29',
			description: '',
			fromCredit: false,
			invoiceNumber: null,
			invoiceId: null,
			method: 'Credit',
		},
		{
			amount: {
				amount: 400.0,
				code: 'CAD',
			},
			client: 'test',
			clientId: 12345,
			creditNumber: '0000001',
			creditId: 974,
			date: '2021-10-29',
			description: 'Overpayment: invoice #AF100520',
			fromCredit: false,
			invoiceNumber: null,
			invoiceId: null,
			method: 'Cash',
		},
	],
	startDate: '2021-10-01',
	totals: [
		{
			amount: 500.0,
			code: 'CAD',
		},
		{
			amount: 53.13,
			code: 'EUR',
		},
	],
}

describe('@freshbooks/api', () => {
	describe('PaymentsCollectedReport', () => {
		describe('transformPaymentsCollectedReportData', () => {
			test('Verify JSON -> model transform', () => {
				const response = JSON.parse(PAYMENTS_COLLECTED_REPORT_RESPONSE)
				const model = transformPaymentsCollectedReportData(response)
				expect(model).toEqual(EXPECTED)
			})
			test('Verify JSON -> model transform - empty payments collected list', () => {
				const empty_test_data = {
					clientids: [],
					currency_codes: [],
					download_token: 'long.downloadtoken',
					end_date: '2017-09-30',
					payment_methods: [],
					payments: [],
					start_date: '2016-10-01',
					summary_only: false,
					totals: [],
				}
				const expected_empty_response = {
					clientIds: [],
					currencyCodes: [],
					downloadToken: 'long.downloadtoken',
					endDate: '2017-09-30',
					paymentMethods: [],
					payments: [],
					startDate: '2016-10-01',
					totals: [],
				}
				const response = JSON.parse(JSON.stringify(empty_test_data))
				const model = transformPaymentsCollectedReportData(response)
				expect(model).toEqual(expected_empty_response)
			})
		})

		describe('GET Call', () => {
			test('GET /accounting/account/${accountId}/reports/accounting/payments_collected', async () => {
				const client = new Client(APPLICATION_CLIENT_ID, testOptions)
				const mockResponse = `
				{"response":
					{
						"result": {
							"payments_collected": ${PAYMENTS_COLLECTED_REPORT_RESPONSE}
						}
					}
				}`
				mock
					.onGet(`/accounting/account/${ACCOUNT_ID}/reports/accounting/payments_collected`)
					.replyOnce(200, mockResponse)
				const { data } = await client.reports.paymentsCollected(ACCOUNT_ID)
				expect(data).toEqual(EXPECTED)
			})

			test('GET /accounting/account/${accountId}/reports/accounting/payments_collected with params', async () => {
				const client = new Client(APPLICATION_CLIENT_ID, testOptions)
				const mockResponse = `
				{"response":
					{
						"result": {
							"payments_collected": ${PAYMENTS_COLLECTED_REPORT_RESPONSE}
						}
					}
				}`
				const builder = new SearchQueryBuilder().equals('currency_code', 'CAD')
				mock
					.onGet(
						`/accounting/account/${ACCOUNT_ID}/reports/accounting/payments_collected?${builder.build(
							'AccountingReportsResource'
						)}`
					)
					.replyOnce(200, mockResponse)
				const { data } = await client.reports.paymentsCollected(ACCOUNT_ID, [builder])
				expect(data).toEqual(EXPECTED)
			})

			test('Test unhandled errors', async () => {
				const unhandledError = new Error('Unhandled Error!')
				const client = new Client(APPLICATION_CLIENT_ID, testOptions)

				client.reports.paymentsCollected = jest.fn(() => {
					throw unhandledError
				})

				try {
					await client.reports.paymentsCollected(ACCOUNT_ID)
				} catch (error) {
					expect(error).toBe(unhandledError)
				}
			})
		})
	})
})
