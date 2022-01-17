/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client, { Options } from '../src/APIClient'
import { OtherIncome } from '../src/models'
import { SearchQueryBuilder } from '../src/models/builders/SearchQueryBuilder'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance
const ACCOUNT_ID = 'xZNQ1X'
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

const buildMockResponse = (otherIncomeProperties: any = {}): string => {
	return JSON.stringify({
		amount: {
			amount: '113.00',
			code: 'USD',
		},
		category_name: 'online_sales',
		created_at: '2021-05-11 06:53:22',
		date: '2021-05-11',
		incomeid: 12345,
		note: 'Product sent via ground mail',
		payment_type: 'Visa',
		source: 'Etsy',
		taxes: [
			{
				amount: '3',
				name: 'HST',
			},
		],
		updated_at: '2021-05-11 06:53:22',
		vis_state: 0,
		...otherIncomeProperties,
	})
}

const buildOtherIncome = (otherIncomeProperties: any = {}): OtherIncome => ({
	amount: {
		amount: 113.0,
		code: 'USD',
	},
	categoryName: 'online_sales',
	createdAt: new Date('2021-05-11T10:53:22Z'),
	date: new Date('2021-05-11'.concat(' 00:00:00')),
	incomeId: 12345,
	note: 'Product sent via ground mail',
	paymentType: 'Visa',
	source: 'Etsy',
	taxes: [
		{
			amount: '3',
			name: 'HST',
		},
	],
	updatedAt: new Date('2021-05-11T10:53:22Z'),
	visState: 0,
	...otherIncomeProperties,
})

const buildMockRequest = (otherIncomeProperties: any = {}): any => ({
	other_income: {
		amount: {
			amount: 113.0,
			code: 'USD',
		},
		category_name: 'online_sales',
		date: '2021-05-11',
		note: 'Product sent via ground mail',
		payment_type: 'Visa',
		source: 'Etsy',
		taxes: [
			{
				amount: '3',
				name: 'HST',
			},
		],
		...otherIncomeProperties,
	},
})

describe('@freshbooks/api', () => {
	describe('OtherIncome', () => {
		test('GET /accounting/account/<accountId>/other_incomes/other_incomes/<otherIncomeId>', async () => {
			const client = new Client(APPLICATION_CLIENT_ID, testOptions)
			const OTHER_INCOME_ID = '12345'

			const mockResponse = `
            {"response":
                {
                    "result": {
                        "other_income": ${buildMockResponse()}
                    }
                }
            }`
			mock
				.onGet(`/accounting/account/${ACCOUNT_ID}/other_incomes/other_incomes/${OTHER_INCOME_ID}`)
				.replyOnce(200, mockResponse)

			const expected = buildOtherIncome()
			const { data } = await client.otherIncomes.single(ACCOUNT_ID, OTHER_INCOME_ID)

			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountId>/other_incomes/other_incomes', async () => {
			const client = new Client(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `
                {"response":
                    {
                        "result": {
                            "other_income": [
                                ${buildMockResponse()}
                            ],
                            "page": 1,
                            "pages": 1,
                            "per_page": 15,
                            "total": 1
                        }
                    }
                }`
			mock.onGet(`/accounting/account/${ACCOUNT_ID}/other_incomes/other_incomes`).replyOnce(200, mockResponse)

			const expected = {
				otherIncomes: [buildOtherIncome()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			const { data } = await client.otherIncomes.list(ACCOUNT_ID)

			expect(data).toEqual(expected)
		})
		test('GET /accounting/account/<accountId>/other_incomes/other_incomes?search[incomeid]=12345', async () => {
			const client = new Client(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `
                {"response":
                    {
                        "result": {
                            "other_income": [
								${buildMockResponse()}
                            ],
                            "page": 1,
                            "pages": 1,
                            "per_page": 15,
                            "total": 1
                        }
                    }
                }`
			const builder = new SearchQueryBuilder().equals('incomeid', '12345')
			mock
				.onGet(`/accounting/account/${ACCOUNT_ID}/other_incomes/other_incomes?${builder.build()}`)
				.replyOnce(200, mockResponse)

			const expected = {
				otherIncomes: [buildOtherIncome()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}
			const { data } = await client.otherIncomes.list(ACCOUNT_ID, [builder])

			expect(data).toEqual(expected)
		})
		test('POST /accounting/account/<accountId>/other_incomes/other_incomes', async () => {
			const client = new Client(APPLICATION_CLIENT_ID, testOptions)
			const mockResponse = `
		    {"response":
		        {
		            "result": {
		                "other_income": ${buildMockResponse()}
		            }
		        }
		    }`
			const mockRequest = buildMockRequest()
			mock
				.onPost(`/accounting/account/${ACCOUNT_ID}/other_incomes/other_incomes`, mockRequest)
				.replyOnce(200, mockResponse)

			const otherIncome = buildOtherIncome()
			const { data } = await client.otherIncomes.create(otherIncome, ACCOUNT_ID)

			expect(data).toEqual(otherIncome)
		})
		test('PUT /accounting/account/<accountId>/other_incomes/other_incomes/<otherIncomeId>', async () => {
			const client = new Client(APPLICATION_CLIENT_ID, testOptions)
			const OTHER_INCOME_ID = '12345'

			const mockResponse = `
		    {"response":
		        {
		            "result": {
		                "other_income": ${buildMockResponse()}
		            }
		        }
		    }`
			const mockRequest = buildMockRequest()
			mock
				.onPut(`/accounting/account/${ACCOUNT_ID}/other_incomes/other_incomes/${OTHER_INCOME_ID}`, mockRequest)
				.replyOnce(200, mockResponse)

			const otherIncome = buildOtherIncome()
			const { data } = await client.otherIncomes.update(ACCOUNT_ID, OTHER_INCOME_ID, otherIncome)

			expect(data).toEqual(otherIncome)
		})
		test('DELETE /accounting/account/<accountId>/other_incomes/other_incomes/<otherIncomeId>', async () => {
			const client = new Client(APPLICATION_CLIENT_ID, testOptions)
			const OTHER_INCOME_ID = '12345'

			mock
				.onDelete(`/accounting/account/${ACCOUNT_ID}/other_incomes/other_incomes/${OTHER_INCOME_ID}`, {})
				.replyOnce(200, {})

			const { data } = await client.otherIncomes.delete(ACCOUNT_ID, OTHER_INCOME_ID)

			expect(data).toEqual({})
		})
	})
})
