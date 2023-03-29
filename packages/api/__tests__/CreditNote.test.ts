/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client, { Options } from '../src/APIClient'
import { CreditNote } from '../src/models'
import { transformDateResponse, DateFormat } from '../src/models/Date'
import { IncludesQueryBuilder } from '../src/models/builders/IncludesQueryBuilder'
import Line from '../src/models/Line'

const mock = new MockAdapter(axios)
const ACCOUNT_ID = 'xZNQ1X'
const CLIENT_ID = 'test-client-id'
const CREDIT_ID = '31313'
const SENT_ID = 1
const testOptions: Options = { accessToken: 'token' }

const buildMockResponse = (creditNoteProperties: any = {}): string => {
	return JSON.stringify({
		accounting_systemid: ACCOUNT_ID,
		amount: {
			amount: '300.00',
			code: 'USD',
		},
		city: 'Toronto',
		clientid: CLIENT_ID,
		code: '',
		country: 'Canada',
		create_date: '2021-10-01',
		credit_number: '00001122',
		credit_type: 'goodwill',
		creditid: CREDIT_ID,
		current_organization: 'Zoom PBS',
		currency_code: 'USD',
		description: 'Prepayment',
		display_status: 'created',
		dispute_status: null,
		ext_archive: 0,
		fname: 'Bruce',
		id: CREDIT_ID,
		language: 'en',
		last_order_status: null,
		lname: 'Wayne',
		notes: '',
		organization: 'Wayne Industries',
		paid: {
			amount: '100.00',
			code: 'USD',
		},
		payment_status: 'paid',
		payment_type: null,
		province: 'Ontario',
		sentid: SENT_ID,
		status: 'created',
		street: '',
		street2: '',
		template: 'clean-grouped',
		terms: null,
		vat_name: null,
		vat_number: '',
		vis_state: 0,
		...creditNoteProperties,
	})
}

const buildCreditLine = (): Array<any> => {
	return [
		{
			amount: {
				amount: '400.00',
				code: 'USD',
			},
			compounded_tax: false,
			creditid: 4,
			description: '',
			name: 'Design',
			qty: '2',
			taskno: 1,
			taxAmount1: '0',
			taxAmount2: '0',
			taxName1: null,
			taxName2: null,
			unit_cost: {
				amount: '200.00',
				code: 'USD',
			},
		},
		{
			amount: {
				amount: '180.00',
				code: 'USD',
			},
			compounded_tax: false,
			creditid: 4,
			description: '',
			name: 'General',
			qty: '2',
			taskno: 2,
			taxAmount1: '0',
			taxAmount2: '0',
			taxName1: null,
			taxName2: null,
			unit_cost: {
				amount: '90.00',
				code: 'USD',
			},
		},
	]
}

const buildCreditNote = (creditNoteProperties: any = {}): CreditNote => ({
	id: CREDIT_ID,
	accountingSystemId: ACCOUNT_ID,
	creditId: CREDIT_ID,
	clientId: CLIENT_ID,
	sentId: SENT_ID,
	amount: {
		amount: '300.00',
		code: 'USD',
	},
	code: '',
	city: 'Toronto',
	country: 'Canada',
	creditNumber: '00001122',
	createDate: new Date('2021-10-01'.concat(' 00:00:00')),
	creditType: 'goodwill',
	currencyCode: 'USD',
	currentOrganization: 'Zoom PBS',
	description: 'Prepayment',
	displayStatus: 'created',
	disputeStatus: null,
	extArchive: 0,
	fName: 'Bruce',
	language: 'en',
	lastOrderStatus: null,
	lName: 'Wayne',
	notes: '',
	organization: 'Wayne Industries',
	paid: {
		amount: '100.00',
		code: 'USD',
	},
	paymentStatus: 'paid',
	paymentType: null,
	province: 'Ontario',
	status: 'created',
	street: '',
	street2: '',
	template: 'clean-grouped',
	terms: null,
	vatName: null,
	vatNumber: '',
	visState: 0,
	...creditNoteProperties,
})

const buildMockRequest = (creditNoteProperties: any = {}): any => ({
	credit_notes: {
		city: '',
		clientid: '2',
		code: '',
		create_date: '2021-10-04',
		credit_number: '0000005',
		credit_type: 'goodwill',
		currency_code: 'USD',
		fname: 'Bruce',
		lname: 'Wayne',
		language: 'en',
		lines: [
			{
				compounded_tax: false,
				description: '',
				name: 'Design',
				qty: 3,
				taxAmount1: null,
				taxAmount2: null,
				taxName1: null,
				taxName2: null,
				unit_cost: {
					amount: '80.00',
					code: 'USD',
				},
			},
		],
		notes: '',
		organization: 'Wayne Industries',
		payment_type: null,
		province: '',
		street: '',
		terms: null,
		vat_name: null,
		vat_number: '',
	},
})

describe('@freshbooks/api', () => {
	describe('CreditNote', () => {
		test('GET /accounting/account/<accountId>/credit_notes/cerdit_notes/<creditId>', async () => {
			const client = new Client(CLIENT_ID, testOptions)

			const mockResponse = `
                {"response":
                    {
                        "result": {
                            "credit_notes": ${buildMockResponse()}
                        }
                    }
                }`

			mock
				.onGet(`/accounting/account/${ACCOUNT_ID}/credit_notes/credit_notes/${CREDIT_ID}`)
				.replyOnce(200, mockResponse)

			const expected = buildCreditNote()
			const { data } = await client.creditNotes.single(ACCOUNT_ID, CREDIT_ID)

			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountId>/credit_notes/credit_notes', async () => {
			const client = new Client(CLIENT_ID, testOptions)

			const mockResponse = `
                {"response":
                    {
                        "result": {
                            "credit_notes": [
                                ${buildMockResponse()}
                            ],
                            "page": 1,
                            "pages": 1,
                            "per_page": 15,
                            "total": 1
                        }
                    }
                }`

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/credit_notes/credit_notes`).replyOnce(200, mockResponse)

			const expected = {
				creditNotes: [buildCreditNote()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			const { data } = await client.creditNotes.list(ACCOUNT_ID)

			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountId>/credit_notes/credit_notes?include[]=lines', async () => {
			const client = new Client(CLIENT_ID, testOptions)

			const mockResponse = `
                {"response":
                    {
                        "result": {
                            "credit_notes": [
                                ${buildMockResponse({
																	lines: buildCreditLine(),
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
				.onGet(`/accounting/account/${ACCOUNT_ID}/credit_notes/credit_notes?${builder.build()}`)
				.replyOnce(200, mockResponse)

			const expected = {
				creditNotes: [
					buildCreditNote({
						lines: [
							{
								amount: {
									amount: '400.00',
									code: 'USD',
								},
								compoundedTax: false,
								creditId: 4,
								description: '',
								name: 'Design',
								qty: '2',
								taxAmount1: '0',
								taxAmount2: '0',
								taxName1: null,
								taxName2: null,
								unitCost: {
									amount: '200.00',
									code: 'USD',
								},
							},
							{
								amount: {
									amount: '180.00',
									code: 'USD',
								},
								compoundedTax: false,
								creditId: 4,
								description: '',
								name: 'General',
								qty: '2',
								taxAmount1: '0',
								taxAmount2: '0',
								taxName1: null,
								taxName2: null,
								unitCost: {
									amount: '90.00',
									code: 'USD',
								},
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
			const { data } = await client.creditNotes.list(ACCOUNT_ID, [builder])

			expect(data).toEqual(expected)
		})
		test('POST /accounting/account/<accountId>/credit_notes/credit_notes', async () => {
			const client = new Client(CLIENT_ID, testOptions)
			const mockResponse = `
            {"response":
                {
                    "result": {
                        "credit_notes": {
                            "city": "",
                            "clientid": "2",
                            "code": "",
                            "create_date": "2021-10-04",
                            "credit_number": "0000005",
                            "credit_type": "goodwill",
                            "currency_code": "USD",
                            "fname": "Bruce",
                            "lname": "Wayne",
                            "language": "en",
                            "lines": [
                                {
                                    "compounded_tax": false,
                                    "description": "",
                                    "name": "Design",
                                    "qty": 3,
                                    "taxAmount1": null,
                                    "taxAmount2": null,
                                    "taxName1": null,
                                    "taxName2": null,
                                    "unit_cost": {
                                        "amount": "80.00",
                                        "code": "USD"
                                    }
                                }
                            ],
                            "notes": "",
                            "organization": "Wayne Industries",
                            "payment_type": null,
                            "province": "",
                            "street": "",
                            "terms": null,
                            "vat_name": null,
                            "vat_number": ""
                        }
                    }
                }
            }
            `
			const mockRequest = buildMockRequest()
			mock
				.onPost(`/accounting/account/${ACCOUNT_ID}/credit_notes/credit_notes`, mockRequest)
				.replyOnce(200, mockResponse)
			const credit_note = {
				clientId: mockRequest.credit_notes.clientid,
				code: '',
				city: '',
				createDate: transformDateResponse(mockRequest.credit_notes.create_date, DateFormat['YYYY-MM-DD']),
				creditNumber: '0000005',
				creditType: 'goodwill',
				currencyCode: 'USD',
				fName: 'Bruce',
				lName: 'Wayne',
				language: 'en',
				lines: [
					{
						compoundedTax: false,
						description: '',
						name: 'Design',
						qty: 3,
						taxAmount1: null,
						taxAmount2: null,
						taxName1: null,
						taxName2: null,
						unitCost: {
							amount: '80.00',
							code: 'USD',
						},
					} as Line,
				],
				notes: '',
				organization: 'Wayne Industries',
				paymentType: null,
				province: '',
				street: '',
				terms: null,
				vatName: null,
				vatNumber: '',
			} as CreditNote
			const { data } = await client.creditNotes.create(credit_note, ACCOUNT_ID)
			expect(data).toEqual(credit_note)
		})
		test('PUT /accounting/account/<accountId>/credit_notes/credit_notes/<creditId>', async () => {
			const client = new Client(CLIENT_ID, testOptions)
			const mockResponse = `
            {"response":
                {
                    "result": {
                        "credit_notes": {
                            "city": "",
                            "clientid": "2",
                            "code": "",
                            "create_date": "2021-10-04",
                            "credit_number": "0000005",
                            "credit_type": "goodwill",
                            "currency_code": "USD",
                            "fname": "Bruce",
                            "lname": "Wayne",
                            "language": "en",
                            "lines": [
                                {
                                    "compounded_tax": false,
                                    "description": "",
                                    "name": "Design",
                                    "qty": 3,
                                    "taxAmount1": null,
                                    "taxAmount2": null,
                                    "taxName1": null,
                                    "taxName2": null,
                                    "unit_cost": {
                                        "amount": "80.00",
                                        "code": "USD"
                                    }
                                }
                            ],
                            "notes": "",
                            "organization": "Wayne Industries",
                            "payment_type": null,
                            "province": "",
                            "street": "",
                            "terms": null,
                            "vat_name": null,
                            "vat_number": ""
                        }
                    }
                }
            }
            `
			const mockRequest = buildMockRequest()
			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/credit_notes/credit_notes/${CREDIT_ID}`, mockRequest)
				.replyOnce(200, mockResponse)
			const credit_note = {
				clientId: mockRequest.credit_notes.clientid,
				code: '',
				city: '',
				createDate: transformDateResponse(mockRequest.credit_notes.create_date, DateFormat['YYYY-MM-DD']),
				creditNumber: '0000005',
				creditType: 'goodwill',
				currencyCode: 'USD',
				fName: 'Bruce',
				lName: 'Wayne',
				language: 'en',
				lines: [
					{
						compoundedTax: false,
						description: '',
						name: 'Design',
						qty: 3,
						taxAmount1: null,
						taxAmount2: null,
						taxName1: null,
						taxName2: null,
						unitCost: {
							amount: '80.00',
							code: 'USD',
						},
					} as Line,
				],
				notes: '',
				organization: 'Wayne Industries',
				paymentType: null,
				province: '',
				street: '',
				terms: null,
				vatName: null,
				vatNumber: '',
			} as CreditNote
			const { data } = await client.creditNotes.update(credit_note, ACCOUNT_ID, CREDIT_ID)
			expect(data).toEqual(credit_note)
		})
		test('PUT /accounting/account/<accountId>/credit_notes/credit_notes/<creditId> (delete)', async () => {
			const client = new Client(CLIENT_ID, testOptions)
			const mockResponse = `
            {"response":
                {
                    "result": {
                        "credit_notes": {
                            "city": "",
                            "clientid": "2",
                            "code": "",
                            "create_date": "2021-10-04",
                            "credit_number": "0000005",
                            "credit_type": "goodwill",
                            "currency_code": "USD",
                            "fname": "Bruce",
                            "lname": "Wayne",
                            "language": "en",
                            "lines": [
                                {
                                    "compounded_tax": false,
                                    "description": "",
                                    "name": "Design",
                                    "qty": 3,
                                    "taxAmount1": null,
                                    "taxAmount2": null,
                                    "taxName1": null,
                                    "taxName2": null,
                                    "unit_cost": {
                                        "amount": "80.00",
                                        "code": "USD"
                                    }
                                }
                            ],
                            "notes": "",
                            "organization": "Wayne Industries",
                            "payment_type": null,
                            "province": "",
                            "street": "",
                            "terms": null,
                            "vat_name": null,
                            "vat_number": "",
                            "vis_state": 1
                        }
                    }
                }
            }
            `
			const mockRequest = { credit_notes: { vis_state: 1 } }
			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/credit_notes/credit_notes/${CREDIT_ID}`, mockRequest)
				.replyOnce(200, mockResponse)
			const credit_note = {
				clientId: '2',
				code: '',
				city: '',
				createDate: transformDateResponse('2021-10-04', DateFormat['YYYY-MM-DD']),
				creditNumber: '0000005',
				creditType: 'goodwill',
				currencyCode: 'USD',
				fName: 'Bruce',
				lName: 'Wayne',
				language: 'en',
				lines: [
					{
						compoundedTax: false,
						description: '',
						name: 'Design',
						qty: 3,
						taxAmount1: null,
						taxAmount2: null,
						taxName1: null,
						taxName2: null,
						unitCost: {
							amount: '80.00',
							code: 'USD',
						},
					} as Line,
				],
				notes: '',
				organization: 'Wayne Industries',
				paymentType: null,
				province: '',
				street: '',
				terms: null,
				vatName: null,
				vatNumber: '',
				visState: 1,
			} as CreditNote
			const { data } = await client.creditNotes.delete(ACCOUNT_ID, CREDIT_ID)
			expect(data).toEqual(credit_note)
		})
	})
})
