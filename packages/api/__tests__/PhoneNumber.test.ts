/* eslint-disable @typescript-eslint/camelcase */
import {
	transformPhoneNumberJSON,
	transformPhoneNumberResponse,
} from '../src/models/PhoneNumber'

describe('@freshbooks/api', () => {
	describe('PhoneNumber', () => {
		test('Verify JSON -> model transform', () => {
			const json = `{ 
				"title": "Mobile",
				"phone_number": "555-555-5555"
			}`
			const model = transformPhoneNumberJSON(json)
			const expected = {
				title: 'Mobile',
				number: '555-555-5555',
			}
			expect(model).toEqual(expected)
		})
		test('Verify parsed JSON -> model transform', () => {
			const data = { title: 'Mobile', phone_number: '555-555-5555' }
			const model = transformPhoneNumberResponse(data)
			const expected = {
				title: 'Mobile',
				number: '555-555-5555',
			}
			expect(model).toEqual(expected)
		})
	})
})
