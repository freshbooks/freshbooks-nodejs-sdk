/* eslint-disable @typescript-eslint/camelcase */
import { transformBusinessClientResponse } from '../src/models/BusinessClient'

describe('@freshbooks/api', () => {
	describe('Business Client', () => {
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
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
			}
			const model = transformBusinessClientResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					id: 22347,
					businessId: 77128,
					accountId: 'Xr82w',
					userId: 74353,
					clientBusiness: {
						businessId: 77128,
					},
					accountBusiness: {
						businessId: 363103,
						accountId: 'Xr82w',
					},
				})
			)
		})
	})
})
