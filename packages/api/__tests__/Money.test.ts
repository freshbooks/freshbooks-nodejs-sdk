/* eslint-disable @typescript-eslint/camelcase */
import { transformMoneyJSON, transformMoneyParsedResponse } from '../src/models/Money'

describe('@freshbooks/api', () => {
	describe('Money', () => {
		test('Verify JSON -> model transform', async () => {
			const json = `{
                "amount": "1234.00",
                "code": "USD"
            }`
			const model = transformMoneyJSON(json)

			expect(model).toEqual(
				expect.objectContaining({
					amount: 1234.0,
					code: 'USD',
				})
			)
		})
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
				amount: '1234.00',
				code: 'USD',
			}
			const model = transformMoneyParsedResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					amount: 1234.0,
					code: 'USD',
				})
			)
		})
	})
})
