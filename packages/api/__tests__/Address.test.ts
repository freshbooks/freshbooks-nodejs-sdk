/* eslint-disable @typescript-eslint/camelcase */
import { transformAddressParsedResponse } from '../src/models/Address'

describe('@freshbooks/api', () => {
	describe('Address', () => {
		test('Verify parsed JSON -> model transform', () => {
			const data = {
				id: 1,
				street: '10 King Street',
				city: 'Toronto',
				province: 'Ontario',
				country: 'Canada',
				postal_code: 'K3I6R9',
			}
			const model = transformAddressParsedResponse(data)
			const expected = {
				id: 1,
				street: '10 King Street',
				city: 'Toronto',
				province: 'Ontario',
				country: 'Canada',
				postalCode: 'K3I6R9',
			}
			expect(model).toEqual(expected)
		})
	})
})
