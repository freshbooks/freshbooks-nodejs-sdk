/* eslint-disable @typescript-eslint/camelcase */
import { transformTasksRateJSON, transformTasksRateResponse } from '../src/models/TasksRate'

describe('@freshbooks/api', () => {
	describe('TasksRate', () => {
		test('Verify JSON -> model transform', async () => {
			const json = `{
                "amount": "1234.00",
                "code": "USD"
            }`
			const model = transformTasksRateJSON(json)

			expect(model).toEqual(
				expect.objectContaining({
					amount: '1234.00',
					code: 'USD',
				})
			)
		})
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
				amount: '1234.00',
				code: 'USD',
			}
			const model = transformTasksRateResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					amount: '1234.00',
					code: 'USD',
				})
			)
		})
	})
})
