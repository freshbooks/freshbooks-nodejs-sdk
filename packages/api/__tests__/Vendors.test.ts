import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import { Vendors } from '../src/models'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'
import { joinQueries } from '../src/models/builders'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance
const testOptions: Options = { clientId: 'test-client-id' }

const ACCOUNT_ID = 'zDmNq'
const VENDOR_ID = 1563

const buildMockVendorsResponse = (vendorResponseProperties: any = {}): string => {
	return JSON.stringify({
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
		...vendorResponseProperties,
	})
}

const buildVendors = (vendorProperties: any = {}): Vendors => ({
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
	...vendorProperties,
})

const buildMockRequest = (vendorProperties: any = {}): any => ({
	bill_vendor: {
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
		vendor_name: 'IKEA',
		vendor_id: 1563,
		vis_state: 0,
		website: 'ikea.com',
		...vendorProperties,
	},
})

describe('@freshbooks/api', () => {
	describe('Vendors', () => {
		test('GET /accounting/account/<account_id>/projects/vendors list', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)

			const mockResponse = `
                {"response":
                    {
                        "result": {
                            "bill_vendors": [
                                ${buildMockVendorsResponse()}
                            ],
                            "page": 1,
                            "pages": 1,
                            "per_page": 15,
                            "total": 1
                        }
                    }
                }`
			mock.onGet(`/accounting/account/${ACCOUNT_ID}/projects/vendors`).replyOnce(200, mockResponse)

			const expected = {
				bill_vendors: [buildVendors()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			const { data } = await APIclient.vendors.list(ACCOUNT_ID)

			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<account_id>/projects/vendors/<vendor_id>', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)

			const mockResponse = `
            {"response":
                {
                    "result": {
                        "bill_vendor": ${buildMockVendorsResponse()}
                    }
                }
            }`

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/projects/vendors/${VENDOR_ID}`).replyOnce(200, mockResponse)
			const vendor = buildVendors()
			const { data } = await APIclient.vendors.single(ACCOUNT_ID, VENDOR_ID)
			expect(data).toEqual(vendor)
		})

		test('POST /accounting/account/<accountId>/projects/vendors create', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)
			const mockResponse = `
            {"response":
                {
                    "result": {
                        "bill_vendor": ${buildMockVendorsResponse()}
                    }
                }
            }`

			const mockRequest = buildMockRequest()
			mock.onPost(`/accounting/account/${ACCOUNT_ID}/projects/vendors`, mockRequest).replyOnce(200, mockResponse)

			const vendor = buildVendors()
			const { data } = await APIclient.vendors.create(vendor, ACCOUNT_ID)
			expect(data).toEqual(vendor)
		})
		test('PUT /accounting/account/<accountId>/projects/vendors/<vendorId> update', async () => {
			const token = 'token'
			const client = new APIClient(token, testOptions)

			const mockResponse = `
            {"response":
                {
                    "result": {
                        "bill_vendor": ${buildMockVendorsResponse()}
                    }
                }
            }`
			const mockRequest = buildMockRequest()

			// Monkey patch
			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/projects/vendors/${VENDOR_ID}`, mockRequest)
				.replyOnce(200, mockResponse)

			const vendor = buildVendors()
			const { data } = await client.vendors.update(vendor, ACCOUNT_ID, VENDOR_ID)

			expect(data).toEqual(vendor)
		})
		test('PUT /accounting/account/<accountId>/projects/vendors/<vendorId> delete', async () => {
			const token = 'token'
			const client = new APIClient(token, testOptions)

			const mockResponse = `
            {"response":
                {
                    "result": {
                        "bill_vendor": ${buildMockVendorsResponse({ vis_state: 1 })}
                    }
                }
            }`
			const mockRequest = { bill_vendor: { vis_state: 1 } }
			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/projects/vendors/${VENDOR_ID}`, mockRequest)
				.replyOnce(200, mockResponse)

			const vendor = buildVendors({ visState: 1 })
			const { data } = await client.vendors.delete(ACCOUNT_ID, VENDOR_ID)

			expect(data).toEqual(vendor)
		})
	})
})
