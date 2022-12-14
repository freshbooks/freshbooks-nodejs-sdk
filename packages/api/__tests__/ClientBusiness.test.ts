/* eslint-disable @typescript-eslint/camelcase */
import { transformClientBusinessResponse } from '../src/models/ClientBusiness'

describe('@freshbooks/api', () => {
	describe('Client Business', () => {
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
				business_id: 77128,
			}
			const model = transformClientBusinessResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					businessId: 77128,
				})
			)
		})
	})
})
