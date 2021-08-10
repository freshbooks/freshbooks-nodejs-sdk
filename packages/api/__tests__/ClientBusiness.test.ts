/* eslint-disable @typescript-eslint/camelcase */
import { transformClientBusinessJSON, transformClientBusinessResponse } from '../src/models/ClientBusiness'

describe('@freshbooks/api', () => {
	describe('Client Business', () => {
		test('Verify JSON -> model transform', async () => {
			const json = `{
                "business_id": 77128
            }`
			const model = transformClientBusinessJSON(json)

			expect(model).toEqual(
				expect.objectContaining({
					businessId: 77128,
				})
			)
		})
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
