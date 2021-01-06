/* eslint-disable @typescript-eslint/camelcase */
import Profession, { transformProfessionJSON, transformProfessionResponse } from '../src/models/Profession'

describe('@freshbooks/api', () => {
	describe('Profession', () => {
		test('Verify JSON with null values -> model transform', () => {
			const json = '{"id": 17748, "title": null, "company": "BillSpring", "designation": null, "business_id": null}'
			const model = transformProfessionJSON(json)
			const expected: Profession = {
				id: '17748',
				title: null,
				company: 'BillSpring',
				designation: null,
				businessId: null,
			}

			expect(model).toEqual(expected)
		})
		test('Verify JSON -> model transform', () => {
			const json =
				'{"id": 17748, "title": "Accounting", "company": "BillSpring", "designation": "Carpenter", "business_id": 2122866}'
			const model = transformProfessionJSON(json)
			const expected: Profession = {
				id: '17748',
				title: 'Accounting',
				company: 'BillSpring',
				designation: 'Carpenter',
				businessId: '2122866',
			}

			expect(model).toEqual(expected)
		})
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
