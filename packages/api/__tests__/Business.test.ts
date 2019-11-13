/* eslint-disable @typescript-eslint/camelcase */
import {
	transformBusinessJSON,
	transformBusinessResponse,
} from '../src/models/Business'

describe('@freshbooks/api', () => {
	describe('Business', () => {
		test('Verify JSON -> model transform', async () => {
			const json = `{
                "id": 77128,
                "name": "BillSpring",
                "account_id": "zDmNq",
                "address": {
                    "id": 74595,
                    "street": "123",
                    "city": "Toronto",
                    "province": "Ontario",
                    "country": "Canada",
                    "postal_code": "A1B2C3"
                },
                "phone_number": null,
                "business_clients": [
                    {
                        "id": 22347,
                        "business_id": 77128,
                        "account_id": "Xr82w",
                        "userid": 74353,
                        "client_business": {
                            "business_id": 77128
                        },
                        "account_business": {
                            "account_business_id": 363103,
                            "account_id": "Xr82w"
                        }
                    }
                ]
            }`
			const model = transformBusinessJSON(json)

			expect(model).toEqual(
				expect.objectContaining({
					id: '77128',
					name: 'BillSpring',
					account_id: 'zDmNq',
					address: {
						id: '74595',
						street: '123',
						city: 'Toronto',
						province: 'Ontario',
						country: 'Canada',
						postal_code: 'A1B2C3',
					},
					phone_number: null,
					business_clients: [
						{
							id: '22347',
							business_id: '77128',
							account_id: 'Xr82w',
							userid: '74353',
							client_business: {
								business_id: '77128',
							},
							account_business: {
								account_business_id: '363103',
								account_id: 'Xr82w',
							},
						},
					],
				})
			)
		})
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
				id: 77128,
				name: 'BillSpring',
				account_id: 'zDmNq',
				address: {
					id: 74595,
					street: '123',
					city: 'Toronto',
					province: 'Ontario',
					country: 'Canada',
					postal_code: 'A1B2C3',
				},
				phone_number: null,
				business_clients: [
					{
						id: 22347,
						business_id: 77128,
						account_id: 'Xr82w',
						userid: 74353,
						client_business: {
							business_id: 77128,
						},
						account_business: {
							account_business_id: 363103,
							account_id: 'Xr82w',
						},
					},
				],
			}
			const model = transformBusinessResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					id: '77128',
					name: 'BillSpring',
					account_id: 'zDmNq',
					address: {
						id: '74595',
						street: '123',
						city: 'Toronto',
						province: 'Ontario',
						country: 'Canada',
						postal_code: 'A1B2C3',
					},
					phone_number: null,
					business_clients: [
						{
							id: '22347',
							business_id: '77128',
							account_id: 'Xr82w',
							userid: '74353',
							client_business: {
								business_id: '77128',
							},
							account_business: {
								account_business_id: '363103',
								account_id: 'Xr82w',
							},
						},
					],
				})
			)
		})
	})
})
