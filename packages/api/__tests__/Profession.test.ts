/* eslint-disable @typescript-eslint/camelcase */
import Profession, { transformProfessionResponse } from '../src/models/Profession'

describe('@freshbooks/api', () => {
	describe('Profession', () => {
		test('Verify parsed JSON -> model transform', () => {
			const data = {
				id: 17748,
				title: 'Accounting',
				company: 'BillSpring',
				designation: null,
				business_id: 2122866,
			}
			const model = transformProfessionResponse(data)
			const expected = {
				id: '17748',
				title: 'Accounting',
				company: 'BillSpring',
				designation: null,
				businessId: '2122866',
			}
			expect(model).toEqual(expected)
		})
	})
})
