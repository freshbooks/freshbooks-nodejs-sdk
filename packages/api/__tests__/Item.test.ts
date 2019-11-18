import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Client from '../src/Client'

const mock = new MockAdapter(axios) // set mock adapter on default axios instance

describe('@freshbooks/api', () => {
	describe('Item', () => {
		test('GET /accounting/account/<accountid>/items/items/<id>', async () => {
			const token = 'token'
			const client = new Client(token)
			const accountId = '7654'
			const id = '675'

			const mockResponse = `{ 
					"response":{
                        "result": {
                            "item": {
                                "id": 201225,
                                "accounting_systemid": "zDmNq",
                                "updated": "2016-07-20 15:36:09",
                                "name": "Monkeys",
                                "qty": "21",
                                "sku": "FB0192374221",
                                "inventory": null,
                                "unit_cost": {
                                    "amount": "1234.00",
                                    "code": "USD"
                                },
                                "tax1": 58730,
                                "vis_state": 0,
                                "tax2": 58729,
                                "description": "monkey descriptor"
                            }
                        }
					}
				 }`

			mock
				.onGet(`/accounting/account/${accountId}/items/items/${id}`)
				.replyOnce(200, mockResponse)

			const { data } = await client.items.single(accountId, id)

			const expected = {
				id: '201225',
				accountingSystemId: 'zDmNq',
				updated: new Date('2016-07-20 15:36:09'),
				name: 'Monkeys',
				qty: 21,
				sku: 'FB0192374221',
				inventory: null,
				unitCost: expect.objectContaining({
					amount: 1234.0,
					code: 'USD',
				}),
				tax1: '58730',
				visState: 0,
				tax2: '58729',
				description: 'monkey descriptor',
			}

			expect(data).toEqual(expect.objectContaining(expected))
		})
	})
})
