/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client from '../src/APIClient'
import { Invoice } from '../src/models'
import { IncludesQueryBuilder } from '../src/models/builders/IncludesQueryBuilder'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance
const ACCOUNT_ID = 'xZNQ1X'

const buildMockResponse = (invoiceProperties: any = {}): string => {
	return JSON.stringify({
		accountid: ACCOUNT_ID,
		accounting_systemid: ACCOUNT_ID,
		address: '',
		amount: {
			amount: '1222.00',
			code: 'USD',
		},
		auto_bill: false,
		autobill_status: null,
		basecampid: 0,
		city: 'Toronto',
		code: 'M5V0P3',
		country: 'Canada',
		create_date: '2019-11-14',
		created_at: '2019-11-14 11:27:45',
		currency_code: 'USD',
		current_organization: 'Hooli',
		customerid: 217572,
		date_paid: null,
		deposit_amount: null,
		deposit_percentage: null,
		deposit_status: 'none',
		description: 'Consulting for apples.',
		discount_description: null,
		discount_total: {
			amount: '0.00',
			code: 'USD',
		},
		discount_value: '0',
		display_status: 'draft',
		dispute_status: null,
		due_date: '2019-11-14',
		due_offset_days: 0,
		estimateid: 0,
		ext_archive: 0,
		fname: 'Gavin',
		fulfillment_date: null,
		generation_date: null,
		gmail: false,
		id: 217506,
		invoice_number: 'SS007',
		invoiceid: 217506,
		language: 'en',
		last_order_status: null,
		lname: 'Belson',
		notes: '',
		organization: 'Hooli',
		outstanding: {
			amount: '1222.00',
			code: 'USD',
		},
		ownerid: 1,
		paid: {
			amount: '0.00',
			code: 'USD',
		},
		parent: 0,
		payment_details: '',
		payment_status: 'unpaid',
		po_number: null,
		province: 'Ontario',
		return_uri: null,
		sentid: 1,
		show_attachments: false,
		status: 1,
		street: '174 Spadina Avenue',
		street2: '',
		template: 'clean-grouped',
		terms: null,
		updated: '2019-11-14 11:27:45',
		v3_status: 'draft',
		vat_name: null,
		vat_number: '',
		vis_state: 0,
		...invoiceProperties,
	})
}

const buildInvoice = (invoiceProperties: any = {}): Invoice => ({
	accountId: ACCOUNT_ID,
	accountingSystemId: ACCOUNT_ID,
	address: '',
	amount: {
		amount: 1222.0,
		code: 'USD',
	},
	autoBill: false,
	autobillStatus: null,
	basecampId: 0,
	city: 'Toronto',
	code: 'M5V0P3',
	country: 'Canada',
	createDate: new Date('2019-11-14'.concat(' 00:00:00')),
	createdAt: new Date('2019-11-14 11:27:45'),
	currencyCode: 'USD',
	currentOrganization: 'Hooli',
	customerId: 217572,
	datePaid: null,
	depositAmount: null,
	depositPercentage: null,
	depositStatus: 'none',
	description: 'Consulting for apples.',
	discountDescription: null,
	discountTotal: {
		amount: 0.0,
		code: 'USD',
	},
	discountValue: '0',
	displayStatus: 'draft',
	disputeStatus: null,
	dueDate: new Date('2019-11-14'.concat(' 00:00:00')),
	dueOffsetDays: 0,
	estimateId: 0,
	extArchive: 0,
	fName: 'Gavin',
	fulfillmentDate: null,
	generationDate: null,
	gmail: false,
	id: 217506,
	invoiceNumber: 'SS007',
	invoiceId: 217506,
	language: 'en',
	lastOrderStatus: null,
	lName: 'Belson',
	notes: '',
	organization: 'Hooli',
	outstanding: {
		amount: 1222,
		code: 'USD',
	},
	ownerId: 1,
	paid: {
		amount: 0.0,
		code: 'USD',
	},
	parent: 0,
	paymentDetails: '',
	paymentStatus: 'unpaid',
	poNumber: null,
	province: 'Ontario',
	returnUri: null,
	sentId: 1,
	showAttachments: false,
	status: 1,
	street: '174 Spadina Avenue',
	street2: '',
	template: 'clean-grouped',
	terms: null,
	updated: new Date('2019-11-14 11:27:45'),
	v3Status: 'draft',
	vatName: null,
	vatNumber: '',
	visState: 0,
	...invoiceProperties,
})

const buildMockRequest = (invoiceProperties: any = {}): any => ({
	invoice: {
		address: '',
		auto_bill: false,
		basecampid: 0,
		city: 'Toronto',
		code: 'M5V0P3',
		country: 'Canada',
		create_date: '2019-11-14',
		currency_code: 'USD',
		customerid: 217572,
		deposit_amount: null,
		deposit_percentage: null,
		discount_description: null,
		discount_value: '0',
		due_offset_days: 0,
		estimateid: 0,
		ext_archive: 0,
		fname: 'Gavin',
		fulfillment_date: null,
		generation_date: null,
		invoice_number: 'SS007',
		language: 'en',
		last_order_status: null,
		lname: 'Belson',
		notes: '',
		organization: 'Hooli',
		parent: 0,
		payment_details: '',
		po_number: null,
		province: 'Ontario',
		return_uri: null,
		show_attachments: false,
		status: 1,
		street: '174 Spadina Avenue',
		street2: '',
		template: 'clean-grouped',
		terms: null,
		vat_name: null,
		vat_number: '',
		vis_state: 0,
		...invoiceProperties,
	},
})

describe('@freshbooks/api', () => {
	describe('Invoice', () => {
		test('GET /accounting/account/<accountId>/invoices/invoices/<invoiceId>', async () => {
			const token = 'token'
			const client = new Client(token)
			const INVOICE_ID = '217506'

			const mockResponse = `
            {"response": 
                {
                    "result": {
                        "invoice": ${buildMockResponse()}
                    }
                }
            }`
			mock
				.onGet(
					`/accounting/account/${ACCOUNT_ID}/invoices/invoices/${INVOICE_ID}`
				)
				.replyOnce(200, mockResponse)

			const expected = buildInvoice()
			const { data } = await client.invoices.single(ACCOUNT_ID, INVOICE_ID)

			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountId>/invoices/invoices', async () => {
			const token = 'token'
			const client = new Client(token)

			const mockResponse = `
                {"response": 
                    {
                        "result": {
                            "invoices": [
                                ${buildMockResponse()}
                            ],
                            "page": 1,
                            "pages": 1,
                            "per_page": 15,
                            "total": 1
                        }
                    }
                }`
			mock
				.onGet(`/accounting/account/${ACCOUNT_ID}/invoices/invoices`)
				.replyOnce(200, mockResponse)

			const expected = {
				invoices: [buildInvoice()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			const { data } = await client.invoices.list(ACCOUNT_ID)

			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountId>/invoices/invoices?include[]=lines', async () => {
			const token = 'token'
			const client = new Client(token)

			const mockResponse = `
                {"response": 
                    {
                        "result": {
                            "invoices": [
								${buildMockResponse({
									lines: [
										{
											amount: {
												amount: '5000.00',
												code: 'USD',
											},
											basecampid: 0,
											compounded_tax: false,
											date: null,
											description: '',
											expenseid: 0,
											invoiceid: 225500,
											lineid: 1,
											name: 'Paperwork',
											qty: '1',
											retainer_id: null,
											retainer_period_id: null,
											taskno: 1,
											taxAmount1: '0',
											taxAmount2: '0',
											taxName1: '',
											taxName2: '',
											taxNumber1: null,
											taxNumber2: null,
											type: 0,
											unit_cost: {
												amount: '5000.00',
												code: 'USD',
											},
											updated: '2019-11-25 15:43:26',
										},
									],
								})}
                            ],
                            "page": 1,
                            "pages": 1,
                            "per_page": 15,
                            "total": 1
                        }
                    }
                }`
			const builder = new IncludesQueryBuilder().includes('lines')
			mock
				.onGet(
					`/accounting/account/${ACCOUNT_ID}/invoices/invoices?${builder.build()}`
				)
				.replyOnce(200, mockResponse)

			const expected = {
				invoices: [
					buildInvoice({
						lines: [
							{
								amount: {
									amount: '5000.00',
									code: 'USD',
								},
								basecampId: 0,
								compoundedTax: false,
								date: null,
								description: '',
								expenseId: 0,
								invoiceId: 225500,
								lineId: 1,
								name: 'Paperwork',
								qty: '1',
								retainerId: null,
								retainerPeriodId: null,
								taxAmount1: '0',
								taxAmount2: '0',
								taxName1: '',
								taxName2: '',
								taxNumber1: null,
								taxNumber2: null,
								type: 0,
								unitCost: {
									amount: '5000.00',
									code: 'USD',
								},
								updated: new Date('2019-11-25 15:43:26'),
							},
						],
					}),
				],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			const { data } = await client.invoices.list(ACCOUNT_ID, [builder])

			expect(data).toEqual(expected)
		})

		test('GET /accounting/account/<accountId>/invoices/invoices?search[invoice_id]=217506', async () => {
			const token = 'token'
			const client = new Client(token)

			const mockResponse = `
                {"response": 
                    {
                        "result": {
                            "invoices": [
								${buildMockResponse()}
                            ],
                            "page": 1,
                            "pages": 1,
                            "per_page": 15,
                            "total": 1
                        }
                    }
                }`
			const builder = new SearchQueryBuilder().equals('invoice_id', '217506')
			mock
				.onGet(
					`/accounting/account/${ACCOUNT_ID}/invoices/invoices?${builder.build()}`
				)
				.replyOnce(200, mockResponse)

			const expected = {
				invoices: [buildInvoice()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			const { data } = await client.invoices.list(ACCOUNT_ID, [builder])

			expect(data).toEqual(expected)
		})
		test('POST /accounting/account/<accountId>/invoices/invoices', async () => {
			const token = 'token'
			const client = new Client(token)
			const mockResponse = `
            {"response": 
                {
                    "result": {
                        "invoice": ${buildMockResponse()}
                    }
                }
            }`
			const mockRequest = buildMockRequest()
			mock
				.onPost(
					`/accounting/account/${ACCOUNT_ID}/invoices/invoices`,
					mockRequest
				)
				.replyOnce(200, mockResponse)

			const invoice = buildInvoice()
			const { data } = await client.invoices.create(invoice, ACCOUNT_ID)

			expect(data).toEqual(invoice)
		})
		test('PUT /accounting/account/<accountId>/invoices/invoices/<invoiceId>', async () => {
			const token = 'token'
			const client = new Client(token)
			const INVOICE_ID = '217506'

			const mockResponse = `
            {"response": 
                {
                    "result": {
                        "invoice": ${buildMockResponse()}
                    }
                }
            }`
			const mockRequest = buildMockRequest()
			mock
				.onPut(
					`/accounting/account/${ACCOUNT_ID}/invoices/invoices/${INVOICE_ID}`,
					mockRequest
				)
				.replyOnce(200, mockResponse)

			const invoice = buildInvoice()
			const { data } = await client.invoices.update(
				ACCOUNT_ID,
				INVOICE_ID,
				invoice
			)

			expect(data).toEqual(invoice)
		})
		test('PUT /accounting/account/<accountId>/invoices/invoices/<invoiceId> (delete)', async () => {
			const token = 'token'
			const client = new Client(token)
			const INVOICE_ID = '217506'

			const mockResponse = `
            {"response": 
                {
                    "result": {
                        "invoice": ${buildMockResponse({ vis_state: 1 })}
                    }
                }
            }`
			const mockRequest = { invoice: { vis_state: 1 } }
			mock
				.onPut(
					`/accounting/account/${ACCOUNT_ID}/invoices/invoices/${INVOICE_ID}`,
					mockRequest
				)
				.replyOnce(200, mockResponse)

			const { data } = await client.invoices.delete(ACCOUNT_ID, INVOICE_ID)
			const invoice = buildInvoice({ visState: 1 })

			expect(data).toEqual(invoice)
		})
	})
})
