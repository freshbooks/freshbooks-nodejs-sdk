/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client from '../src/APIClient'
import { Invoice } from '../src/models'

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
	createDate: '2019-11-14',
	createdAt: '2019-11-14 11:27:45',
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
	dueDate: '2019-11-14',
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
	updated: '2019-11-14 11:27:45',
	v3Status: 'draft',
	vatName: null,
	vatNumber: '',
	visState: 0,
	...invoiceProperties,
})

const buildMockRequest = (invoiceProperties: any = {}): any => ({
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
	currency_code: 'USD',
	current_organization: 'Hooli',
	customerid: 217572,
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
	v3_status: 'draft',
	vat_name: null,
	vat_number: '',
	vis_state: 0,
	...invoiceProperties,
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
	})
})
