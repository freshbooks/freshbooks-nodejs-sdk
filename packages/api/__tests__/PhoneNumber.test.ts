/* eslint-disable @typescript-eslint/camelcase */
import { transformPhoneNumberParsedResponse } from '../src/models/PhoneNumber'

describe('@freshbooks/api', () => {
	describe('PhoneNumber', () => {
		test('Verify parsed JSON -> model transform', () => {
			const data = { title: 'Mobile', phone_number: '555-555-5555' }
			const model = transformPhoneNumberParsedResponse(data)
			const expected = {
				title: 'Mobile',
				number: '555-555-5555',
			}
			expect(model).toEqual(expected)
		})
	})
})
