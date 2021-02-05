/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import { Client } from '../src'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'
import { joinQueries } from '../src/models/builders'
import VisState from '../src/models/VisState'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

const ACCOUNT_ID = 'xZNQ1X'
const CLIENT_ID = '218192'
const testOptions: Options = { clientId: 'test-client-id' }

const buildClientResponse = (clientResponseProperties: any = {}): any => ({
	accounting_systemid: ACCOUNT_ID,
	allow_late_fees: true,
	allow_late_notifications: true,
	bus_phone: '',
	company_industry: null,
	company_size: null,
	currency_code: 'USD',
	direct_link_token: null,
	email: 'jappleseed@gmail.com',
	fax: '',
	fname: 'Johnathan',
	has_retainer: null,
	home_phone: null,
	id: CLIENT_ID,
	language: 'en',
	last_activity: null,
	last_login: null,
	level: 0,
	lname: 'Appleseed',
	mob_phone: '',
	note: null,
	notified: false,
	num_logins: 0,
	organization: 'Apple Seed Co.',
	p_city: '',
	p_code: '',
	p_country: '',
	p_province: '',
	p_street: '1655 Dupont St. W.',
	p_street2: '',
	pref_email: true,
	pref_gmail: false,
	retainer_id: null,
	role: 'client',
	s_city: '',
	s_code: '',
	s_country: '',
	s_province: '',
	s_street: '',
	s_street2: '',
	signup_date: '2019-11-18 16:14:18',
	statement_token: null,
	subdomain: null,
	updated: '2019-11-18 12:04:07',
	userid: CLIENT_ID,
	username: 'johnnyappleseed2',
	vat_name: null,
	vat_number: null,
	vis_state: 0,
	...clientResponseProperties,
})

const buildMockClientJSONResponse = (clientResponseProperties: any = {}): string =>
	JSON.stringify({
		response: {
			result: {
				client: buildClientResponse(clientResponseProperties),
			},
		},
	})

const buildExpectedClientResult = (clientProperties: any = {}): Client => ({
	accountingSystemId: ACCOUNT_ID,
	allowLateFees: true,
	allowLateNotifications: true,
	busPhone: '',
	companyIndustry: null,
	companySize: null,
	currencyCode: 'USD',
	directLinkToken: null,
	email: 'jappleseed@gmail.com',
	fax: '',
	fName: 'Johnathan',
	hasRetainer: null,
	homePhone: null,
	id: CLIENT_ID,
	language: 'en',
	lastActivity: null,
	lastLogin: null,
	level: 0,
	lName: 'Appleseed',
	mobPhone: '',
	note: null,
	notified: false,
	numLogins: 0,
	organization: 'Apple Seed Co.',
	pCity: '',
	pCode: '',
	pCountry: '',
	pProvince: '',
	pStreet: '1655 Dupont St. W.',
	pStreet2: '',
	prefEmail: true,
	prefGmail: false,
	retainerId: null,
	role: 'client',
	sCity: '',
	sCode: '',
	sCountry: '',
	sProvince: '',
	sStreet: '',
	sStreet2: '',
	signupDate: new Date('2019-11-18T16:14:18Z'),
	statementToken: null,
	subdomain: null,
	updated: new Date('2019-11-18T17:04:07Z'),
	userId: CLIENT_ID,
	username: 'johnnyappleseed2',
	vatName: null,
	vatNumber: null,
	visState: VisState.active,
	...clientProperties,
})

describe('@freshbooks/api', () => {
	describe('Client', () => {
		test('GET /accounting/account/<accountId>/users/clients?...searchQuery', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)
			const response = `
		  {
		    "response": {
		      "result": {
		        "clients": [
		          ${JSON.stringify(buildClientResponse())}
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
				clients: [buildExpectedClientResult()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			const builder = new SearchQueryBuilder().like('address', '1655 Dupont').equals('userid', '217648')
			const qs = joinQueries([builder])
			mock.onGet(`/accounting/account/${ACCOUNT_ID}/users/clients${qs}`).replyOnce(200, response)

			const { data } = await APIclient.clients.list(ACCOUNT_ID, [builder])
			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountId>/users/clients', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)
			const response = `
      {
        "response": {
          "result": {
            "clients": [
              ${JSON.stringify(buildClientResponse())}
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
				clients: [buildExpectedClientResult()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/users/clients`).replyOnce(200, response)

			const { data } = await APIclient.clients.list(ACCOUNT_ID)
			expect(data).toEqual(expected)
		})

		test('GET /accounting/account/<accountId>/users/clients/<clientId>', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)

			const mockResponse = buildMockClientJSONResponse()
			mock.onGet(`/accounting/account/${ACCOUNT_ID}/users/clients/${CLIENT_ID}`).replyOnce(200, mockResponse)

			const expected = buildExpectedClientResult()

			const { data } = await APIclient.clients.single(ACCOUNT_ID, CLIENT_ID)

			expect(expected).toEqual(data)
		})

		test('POST /accounting/account/<accountId>/users/clients', async () => {
			const token = 'token'
			const APIclient = new APIClient(token, testOptions)

			const clientModel = {
				fName: 'Johnny',
				lName: 'Appleseed',
				email: 'jappleseed@gmail.com',
				organization: 'Apple Seed Co.',
			}
			const mockResponse = buildMockClientJSONResponse({
				fname: 'Johnny',
				lname: 'Appleseed',
				email: 'jappleseed@gmail.com',
				organization: 'Apple Seed Co.',
			})

			const mockRequest = {
				client: {
					fname: 'Johnny',
					lname: 'Appleseed',
					email: 'jappleseed@gmail.com',
					organization: 'Apple Seed Co.',
				},
			}

			mock.onPost(`/accounting/account/${ACCOUNT_ID}/users/clients`, mockRequest).replyOnce(200, mockResponse)

			const expected = buildExpectedClientResult(clientModel)

			const { data } = await APIclient.clients.create(clientModel, ACCOUNT_ID)

			expect(data).toEqual(expected)
		})
	})
	test('PUT /accounting/account/<accountId>/users/clients/<clientId> (delete)', async () => {
		const token = 'token'
		const APIclient = new APIClient(token, testOptions)

		const mockResponse = buildMockClientJSONResponse({ vis_state: 1 })

		const mockRequest = {
			client: {
				vis_state: 1,
			},
		}

		const expected = buildExpectedClientResult({ visState: 1 })

		mock.onPut(`/accounting/account/${ACCOUNT_ID}/users/clients/${CLIENT_ID}`, mockRequest).replyOnce(200, mockResponse)

		const { data } = await APIclient.clients.delete(ACCOUNT_ID, CLIENT_ID)
		expect(data).toEqual(expected)
	})

	test('PUT /accounting/account/<accountId>/users/clients/<clientId>', async () => {
		const token = 'token'
		const APIclient = new APIClient(token, testOptions)

		const mockResponse = buildMockClientJSONResponse()

		const mockRequest = {
			client: {
				fname: 'Johnathan',
				lname: 'Appleseed',
				email: 'jappleseed@gmail.com',
				organization: 'Apple Seed Co.',
			},
		}

		mock.onPut(`/accounting/account/${ACCOUNT_ID}/users/clients/${CLIENT_ID}`, mockRequest).replyOnce(200, mockResponse)

		const clientModel = {
			fName: 'Johnathan',
			lName: 'Appleseed',
			email: 'jappleseed@gmail.com',
			organization: 'Apple Seed Co.',
		}

		const expected = buildExpectedClientResult(clientModel)

		const { data } = await APIclient.clients.update(clientModel, ACCOUNT_ID, CLIENT_ID)

		expect(data).toEqual(expected)
	})
})
