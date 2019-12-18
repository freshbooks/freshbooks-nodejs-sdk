/* eslint-disable @typescript-eslint/camelcase */
import {
	transformBusinessMembershipJSON,
	transformBusinessMembershipResponse,
} from '../src/models/BusinessMembership'

describe('@freshbooks/api', () => {
	describe('Business Membership', () => {
		test('Verify JSON -> model transform', async () => {
			const json = `{
                "id": 168372,
                "role": "owner",
                "business": {
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
                }
            }`
			const model = transformBusinessMembershipJSON(json)

			expect(model).toEqual(
				expect.objectContaining({
					id: '168372',
					role: 'owner',
					business: {
						id: '77128',
						name: 'BillSpring',
						accountId: 'zDmNq',
						address: {
							id: '74595',
							street: '123',
							city: 'Toronto',
							province: 'Ontario',
							country: 'Canada',
							postalCode: 'A1B2C3',
						},
						phoneNumber: null,
						businessClients: [
							{
								id: '22347',
								businessId: '77128',
								accountId: 'Xr82w',
								userId: '74353',
								clientBusiness: {
									businessId: '77128',
								},
								accountBusiness: {
									businessId: '363103',
									accountId: 'Xr82w',
								},
							},
						],
					},
				})
			)
		})
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
				id: 168372,
				role: 'owner',
				business: {
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
				},
			}
			const model = transformBusinessMembershipResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					id: '168372',
					role: 'owner',
					business: {
						id: '77128',
						name: 'BillSpring',
						accountId: 'zDmNq',
						address: {
							id: '74595',
							street: '123',
							city: 'Toronto',
							province: 'Ontario',
							country: 'Canada',
							postalCode: 'A1B2C3',
						},
						phoneNumber: null,
						businessClients: [
							{
								id: '22347',
								businessId: '77128',
								accountId: 'Xr82w',
								userId: '74353',
								clientBusiness: {
									businessId: '77128',
								},
								accountBusiness: {
									businessId: '363103',
									accountId: 'Xr82w',
								},
							},
						],
					},
				})
			)
		})
	})
})
