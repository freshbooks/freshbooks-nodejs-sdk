/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import APIClient, { Options } from '../src/APIClient'
import Item from '../src/models/Item'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

const ACCOUNT_ID = 'zDmNq'
const ITEM_ID = '201225'
const testOptions: Options = { clientId: 'test-client-id' }

const buildMockResponse = (itemProperties: any = {}): string =>
	JSON.stringify({
		id: 201225,
		accounting_systemid: ACCOUNT_ID,
		updated: '2016-07-20 15:36:09',
		name: 'Monkeys',
		qty: '21',
		sku: 'FB0192374221',
		inventory: null,
		unit_cost: {
			amount: '1234.00',
			code: 'USD',
		},
		tax1: 58730,
		vis_state: 0,
		tax2: 58729,
		description: 'monkey descriptor',
		...itemProperties,
	})

const buildMockRequest = (itemProperties: any = {}): any => {
	return {
		item: {
			name: 'Monkeys',
			description: 'monkey descriptor',
			qty: 21,
			sku: 'FB0192374221',
			inventory: null,
			unit_cost: {
				amount: 1234.0,
				code: 'USD',
			},
			tax1: '58730',
			tax2: '58729',
			vis_state: 0,
			...itemProperties,
		},
	}
}

const buildItem = (itemProperties: any = {}): Item => ({
	id: '201225',
	accountingSystemId: ACCOUNT_ID,
	updated: new Date('2016-07-20 15:36:09'),
	name: 'Monkeys',
	qty: 21,
	sku: 'FB0192374221',
	inventory: null,
	unitCost: {
		amount: 1234.0,
		code: 'USD',
	},
	tax1: '58730',
	visState: 0,
	tax2: '58729',
	description: 'monkey descriptor',
	...itemProperties,
})

describe('@freshbooks/api', () => {
	describe('Item', () => {
		test('GET /accounting/account/<accountid>/items/items/<id>', async () => {
			const token = 'token'
			const client = new APIClient(token, testOptions)

			const mockResponse = `{ 
					"response":{
                        "result": {
                            "item": ${buildMockResponse()}
                        }
					}
				 }`

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/items/items/${ITEM_ID}`).replyOnce(200, mockResponse)

			const { data } = await client.items.single(ACCOUNT_ID, ITEM_ID)

			const expected = buildItem()

			expect(data).toEqual(expect.objectContaining(expected))
		})
		test('GET /accounting/account/<accountid>/items/items', async () => {
			const token = 'token'
			const client = new APIClient(token, testOptions)

			const mockResponse = `{ 
					"response":{
                        "result": {
							"items": [${buildMockResponse()}],
							"page": 1,
							"pages": 1,
							"per_page": 15,
							"total": 1
                        }
					}
				 }`

			mock.onGet(`/accounting/account/${ACCOUNT_ID}/items/items`).replyOnce(200, mockResponse)

			const { data } = await client.items.list(ACCOUNT_ID)

			const expected = {
				items: [buildItem()],
				pages: {
					page: 1,
					pages: 1,
					size: 15,
					total: 1,
				},
			}

			expect(data).toEqual(expected)
		})
		test('PUT /accounting/account/<accountid>/items/items/<id>', async () => {
			const token = 'token'
			const client = new APIClient(token, testOptions)

			const mockResponse = `{ 
					"response":{
                        "result": {
                            "item": ${buildMockResponse({ qty: 10 })}
                        }
					}
				 }`

			const mockRequest = buildMockRequest({
				qty: 10,
			})
			mock.onPut(`/accounting/account/${ACCOUNT_ID}/items/items/${ITEM_ID}`, mockRequest).replyOnce(200, mockResponse)

			const itemData = buildItem({ qty: 10 })

			const { data } = await client.items.update(ACCOUNT_ID, ITEM_ID, itemData)

			expect(data).toEqual(itemData)
		})

		test('PUT /accounting/account/<accountid>/items/items/<id> (delete)', async () => {
			const token = 'token'
			const client = new APIClient(token, testOptions)

			const mockResponse = `{
					"response":{
		                "result": {
		                    "item": ${buildMockResponse({ vis_state: 1 })}
		                }
					}
				 }`

			const mockRequest = buildMockRequest({ vis_state: 1 })
			mock.onPut(`/accounting/account/${ACCOUNT_ID}/items/items/${ITEM_ID}`, mockRequest).replyOnce(200, mockResponse)

			const itemData = buildItem({ visState: 1 })

			const { data } = await client.items.update(ACCOUNT_ID, ITEM_ID, itemData)

			expect(data).toEqual(itemData)
		})

		test('POST /accounting/account/<accountid>/items/items', async () => {
			const token = 'token'
			const client = new APIClient(token, testOptions)

			const mockResponse = `{
					"response":{
		                "result": {
		                    "item": ${buildMockResponse()}
		                }
					}
				 }`

			const mockRequest = buildMockRequest()
			mock.onPost(`/accounting/account/${ACCOUNT_ID}/items/items`, mockRequest).replyOnce(200, mockResponse)

			const itemData = buildItem()

			const { data } = await client.items.create(ACCOUNT_ID, itemData)

			expect(data).toEqual(itemData)
		})
	})
})
