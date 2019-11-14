/* eslint-disable @typescript-eslint/camelcase */
import {
	transformAddressJSON,
	transformAddressResponse,
} from '../src/models/Address'

describe('@freshbooks/api', () => {
	describe('Address', () => {
		test('Verify JSON -> model transform', () => {
			const json = `{
					"id": 1,
					"street": "10 King Street",
					"city": "Toronto",
					"province": "Ontario",
					"country": "Canada",
					"postal_code": "K3I6R9"
				}`
			const model = transformAddressJSON(json)
			const expected = {
				id: '1',
				street: '10 King Street',
				city: 'Toronto',
				province: 'Ontario',
				country: 'Canada',
				postalCode: 'K3I6R9',
			}
			expect(model).toEqual(expected)
		})
		test('Verify JSON with null values -> model transform', () => {
			const json = `{
					"id": 3292884,
					"street": null,
					"city": null,
					"province": null,
					"country": null,
					"postal_code": null
				}`
			const model = transformAddressJSON(json)
			const expected = {
				id: '3292884',
			}
			expect(model).toEqual(expected)
		})
		test('Verify parsed JSON -> model transform', () => {
			const data = {
				id: 1,
				street: '10 King Street',
				city: 'Toronto',
				province: 'Ontario',
				country: 'Canada',
				postal_code: 'K3I6R9',
			}
			const model = transformAddressResponse(data)
			const expected = {
				id: '1',
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
