/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import ExpenseCategory from '../src/models/ExpenseCategory'

const mock = new MockAdapter(axios)

const ACCOUNT_ID = 'AbCxYz'
const CATEGORY_ID = '12345678'
const PARENT_ID = '09876543'
const APPLICATION_CLIENT_ID = 'test-client-id'
const testOptions: Options = { accessToken: 'token' }

const buildMockResponse = (expenseCategoryProperties: any = {}): string =>
	JSON.stringify({
		category: 'Airfare',
		categoryid: CATEGORY_ID,
		created_at: '2022-08-16 14:11:07',
		id: CATEGORY_ID,
		is_cogs: false,
		is_editable: true,
		parentid: PARENT_ID,
		updated_at: '2022-10-07 11:04:59',
		vis_state: 0,
		...expenseCategoryProperties,
	})

const buildExpenseCategory = (expenseCategoryProperties: any = {}): ExpenseCategory => ({
		category: 'Airfare',
		categoryId: CATEGORY_ID,
		createdAt: new Date('2022-08-16T18:11:07Z'),
		id: CATEGORY_ID,
		isCogs: false,
		isEditable: true,
		parentId: PARENT_ID,
		updatedAt: new Date('2022-10-07T15:04:59Z'),
		visState: 0,
		...expenseCategoryProperties,
	})

describe('@freshbooks/api', () => {
	describe('ExpenseCategory', () => {
		test('GET /accounting/account/<accountid>/expenses/categories/<id>', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `{
					"response":{
                        "result": {
                            "category": ${buildMockResponse()}
                        }
					}
				 }`

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/expenses/categories/${CATEGORY_ID}`).replyOnce(200, mockResponse)

			const { data } = await client.expenseCategories.single(ACCOUNT_ID, CATEGORY_ID)

			const expected = buildExpenseCategory()

			expect(data).toEqual(expect.objectContaining(expected))
		})
		test('GET /accounting/account/<accountid>/expenses/categories', async () => {
			const client = new APIClient(APPLICATION_CLIENT_ID, testOptions)

			const mockResponse = `{
					"response":{
                        "result": {
							"categories": [${buildMockResponse()}],
							"page": 1,
							"pages": 1,
							"per_page": 15,
							"total": 1
                        }
					}
				 }`

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/expenses/categories`).replyOnce(200, mockResponse)

			const { data } = await client.expenseCategories.list(ACCOUNT_ID)

			const expected = {
				categories: [buildExpenseCategory()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}

			expect(data).toEqual(expected)
		})
	})
})
