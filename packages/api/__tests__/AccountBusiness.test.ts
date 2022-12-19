/* eslint-disable @typescript-eslint/camelcase */
import { transformAccountBusinessParsedResponse } from '../src/models/AccountBusiness'

describe('@freshbooks/api', () => {
	describe('Account Business', () => {
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
				account_business_id: 363103,
				account_id: 'Xr82w',
			}
			const model = transformAccountBusinessParsedResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					businessId: 363103,
					accountId: 'Xr82w',
				})
			)
		})
	})
})
