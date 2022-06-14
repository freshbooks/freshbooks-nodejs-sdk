/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client, { Options } from '../src/APIClient'
import { transformTaxSummaryReportData } from '../src/models/report/TaxSummaryReport'

const mock = new MockAdapter(axios)
const ACCOUNT_ID = 'xZNQ1X'
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }
const TAX_REPORT_RESPONSE = JSON.stringify({
	cash_based: false,
	currency_code: 'CAD',
	download_token: 'long.downloadtoken',
	end_date: '2022-09-30',
	start_date: '2021-10-01',
	taxes: [
		{
			net_tax: {
				amount: '3.13',
				code: 'CAD',
			},
			net_taxable_amount: {
				amount: '50.00',
				code: 'CAD',
			},
			tax_collected: {
				amount: '3.13',
				code: 'CAD',
			},
			tax_name: 'GST',
			tax_paid: {
				amount: '0.00',
				code: 'CAD',
			},
			taxable_amount_collected: {
				amount: '50.00',
				code: 'CAD',
			},
			taxable_amount_paid: {
				amount: '0.00',
				code: 'CAD',
			},
		},
		{
			net_tax: {
				amount: '163.37',
				code: 'CAD',
			},
			net_taxable_amount: {
				amount: '1256.63',
				code: 'CAD',
			},
			tax_collected: {
				amount: '172.57',
				code: 'CAD',
			},
			tax_name: 'HST',
			tax_paid: {
				amount: '9.20',
				code: 'CAD',
			},
			taxable_amount_collected: {
				amount: '1327.43',
				code: 'CAD',
			},
			taxable_amount_paid: {
				amount: '70.80',
				code: 'CAD',
			},
		},
	],
	total_invoiced: {
		amount: '1503.13',
		code: 'CAD',
	},
})

const EXPECTED = {
	cashBased: false,
	currencyCode: 'CAD',
	downloadToken: 'long.downloadtoken',
	endDate: '2022-09-30',
	startDate: '2021-10-01',
	taxes: [
		{
			netTax: {
				amount: 3.13,
				code: 'CAD',
			},
			netTaxableAmount: {
				amount: 50.0,
				code: 'CAD',
			},
			taxCollected: {
				amount: 3.13,
				code: 'CAD',
			},
			taxName: 'GST',
			taxPaid: {
				amount: 0.0,
				code: 'CAD',
			},
			taxableAmountCollected: {
				amount: 50.0,
				code: 'CAD',
			},
			taxableAmountPaid: {
				amount: 0.0,
				code: 'CAD',
			},
		},
		{
			netTax: {
				amount: 163.37,
				code: 'CAD',
			},
			netTaxableAmount: {
				amount: 1256.63,
				code: 'CAD',
			},
			taxCollected: {
				amount: 172.57,
				code: 'CAD',
			},
			taxName: 'HST',
			taxPaid: {
				amount: 9.2,
				code: 'CAD',
			},
			taxableAmountCollected: {
				amount: 1327.43,
				code: 'CAD',
			},
			taxableAmountPaid: {
				amount: 70.8,
				code: 'CAD',
			},
		},
	],
	totalInvoiced: {
		amount: 1503.13,
		code: 'CAD',
	},
}
describe('@freshbooks/api', () => {
	describe('TaxSummaryReport', () => {
		describe('transformTaxSummaryReportData', () => {
			test('Verify JSON -> model transform', () => {
				const response = JSON.parse(TAX_REPORT_RESPONSE)
				const model = transformTaxSummaryReportData(response)
				expect(model).toEqual(EXPECTED)
			})
		})
		describe('transformTaxSummaryReportData', () => {
			test('Verify JSON -> model transform - empty tax list', () => {
				const response = JSON.parse(
					JSON.stringify({
						cash_based: false,
						currency_code: 'USD',
						download_token: 'long.downloadtoken',
						end_date: '2022-09-30',
						start_date: '2021-10-01',
						taxes: [],
						total_invoiced: {
							amount: '0.00',
							code: 'USD',
						},
					})
				)
				const model = transformTaxSummaryReportData(response)
				expect(model.taxes).toEqual([])
			})
		})
		describe('GET Call', () => {
			test('GET /accounting/account/${accountId}/reports/accounting/taxsummary', async () => {
				const client = new Client(APPLICATION_CLIENT_ID, testOptions)
				const mockResponse = `
				{"response":
					{
						"result": {
							"taxsummary": ${TAX_REPORT_RESPONSE}
						}
					}
				}`
				mock.onGet(`/accounting/account/${ACCOUNT_ID}/reports/accounting/taxsummary`).replyOnce(200, mockResponse)
				const { data } = await client.reports.taxSummary(ACCOUNT_ID)
				expect(data).toEqual(EXPECTED)
			})
			test('Test not found errors', async () => {
				const mockResponse = JSON.stringify({
					error_type: 'not_found',
					message: 'The requested resource was not found.',
				})
				mock.onGet(`/accounting/account/${ACCOUNT_ID}/reports/accounting/taxsummary`).replyOnce(401, mockResponse)

				const client = new Client(APPLICATION_CLIENT_ID, testOptions)
				try {
					await client.reports.taxSummary(ACCOUNT_ID)
				} catch (error: any) {
					expect(error.code).toEqual('not_found')
					expect(error.message).toEqual('The requested resource was not found.')
				}
			})

			test('Test unhandled errors', async () => {
				const unhandledError = new Error('Unhandled Error!')
				const client = new Client(APPLICATION_CLIENT_ID, testOptions)

				client.reports.taxSummary = jest.fn(() => {
					throw unhandledError
				})

				try {
					await client.reports.taxSummary(ACCOUNT_ID)
				} catch (error) {
					expect(error).toBe(unhandledError)
				}
			})
		})
	})
})
