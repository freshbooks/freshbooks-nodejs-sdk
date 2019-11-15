/* eslint-disable @typescript-eslint/camelcase */
import {
	transformAccountBusinessJSON,
	transformAccountBusinessResponse,
} from '../src/models/AccountBusiness'

describe('@freshbooks/api', () => {
	describe('Account Business', () => {
		test('Verify JSON -> model transform', async () => {
			const json = `{
                "account_business_id": 363103,
                "account_id": "Xr82w"
            }`
			const model = transformAccountBusinessJSON(json)

			expect(model).toEqual(
				expect.objectContaining({
					businessId: '363103',
					accountId: 'Xr82w',
				})
			)
		})
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
				account_business_id: 363103,
				account_id: 'Xr82w',
			}
			const model = transformAccountBusinessResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					businessId: '363103',
					accountId: 'Xr82w',
				})
			)
		})
	})
})
