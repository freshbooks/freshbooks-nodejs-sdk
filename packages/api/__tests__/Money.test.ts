/* eslint-disable @typescript-eslint/camelcase */
import { transformMoneyParsedResponse } from '../src/models/Money'

describe('@freshbooks/api', () => {
	describe('Money', () => {
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
				amount: '1234.00',
				code: 'USD',
			}
			const model = transformMoneyParsedResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					amount: '1234.00',
					code: 'USD',
				})
			)
		})
	})
})
