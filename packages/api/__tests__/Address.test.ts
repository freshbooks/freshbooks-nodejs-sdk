/* eslint-disable @typescript-eslint/camelcase */
import {
	transformAddressJSON,
	transformAddressResponse,
} from '../src/models/Address'

describe('@freshbooks/api', () => {
	describe('Address', () => {
		test('Verify JSON -> model transform', () => {
			const json =
				'{ "id": 1, "street": "10 King Street", "city": "Toronto", "province": "Ontario", "postal_code": "K3I6R9"}'
			const model = transformAddressJSON(json)
			expect(model.id).toEqual('1')
			expect(model.street).toEqual('10 King Street')
			expect(model.city).toEqual('Toronto')
			expect(model.province).toEqual('Ontario')
			expect(model.postalCode).toEqual('K3I6R9')
		})
		test('Verify parsed JSON -> model transform', () => {
			const data = {
				id: 1,
				street: '10 King Street',
				city: 'Toronto',
				province: 'Ontario',
				postal_code: 'K3I6R9',
			}
			const model = transformAddressResponse(data)
			expect(model.id).toEqual('1')
			expect(model.street).toEqual('10 King Street')
			expect(model.city).toEqual('Toronto')
			expect(model.province).toEqual('Ontario')
			expect(model.postalCode).toEqual('K3I6R9')
		})
	})
})
