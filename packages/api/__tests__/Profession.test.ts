/* eslint-disable @typescript-eslint/camelcase */
import {
	transformProfessionJSON,
	transformProfessionResponse,
} from '../src/models/Profession'

describe('@freshbooks/api', () => {
	describe('Group', () => {
		test('Verify JSON -> model transform', () => {
			const json =
				'{"id": 17748, "title": "Accounting", "company": "BillSpring", "designation": null, "business_id": 2122866}'
			const model = transformProfessionJSON(json)
			expect(model.id).toEqual('17748')
			expect(model.title).toEqual('Accounting')
			expect(model.company).toEqual('BillSpring')
			expect(model.designation).toEqual(null)
			expect(model.businessId).toEqual('2122866')
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
			expect(model.id).toEqual('17748')
			expect(model.title).toEqual('Accounting')
			expect(model.company).toEqual('BillSpring')
			expect(model.designation).toEqual(null)
			expect(model.businessId).toEqual('2122866')
		})
	})
})
