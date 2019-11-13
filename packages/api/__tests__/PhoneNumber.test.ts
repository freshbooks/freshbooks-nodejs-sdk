/* eslint-disable @typescript-eslint/camelcase */
import {
	transformPhoneNumberJSON,
	transformPhoneNumberResponse,
} from '../src/models/PhoneNumber'

describe('@freshbooks/api', () => {
	describe('PhoneNumber', () => {
		test('Verify JSON -> model transform', () => {
			const json = '{ "title": "Mobile", "phone_number": "555-555-5555"}'
			const model = transformPhoneNumberJSON(json)
			expect(model.title).toEqual('Mobile')
			expect(model.number).toEqual('555-555-5555')
		})
		test('Verify parsed JSON -> model transform', () => {
			const data = { title: 'Mobile', phone_number: '555-555-5555' }
			const model = transformPhoneNumberResponse(data)
			expect(model.title).toEqual('Mobile')
			expect(model.number).toEqual('555-555-5555')
		})
	})
})
