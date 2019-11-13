/* eslint-disable @typescript-eslint/camelcase */
import { transformGroupJSON, transformGroupResponse } from '../src/models/Group'

describe('@freshbooks/api', () => {
	describe('Group', () => {
		test('Verify JSON -> model transform', () => {
			const json =
				'{"id": 90610, "group_id": 23738, "role": "owner","identity_id": 712052,"first_name": "Bruce","last_name": "Wayne","email": "b@example.com","company": "BillSpring","business_id": 77128,"active": true}'
			const model = transformGroupJSON(json)
			const expected = {
				id: '90610',
				groupId: '23738',
				role: 'owner',
				identityId: '712052',
				firstName: 'Bruce',
				lastName: 'Wayne',
				email: 'b@example.com',
				company: 'BillSpring',
				businessId: '77128',
				active: true,
			}
			expect(model).toEqual(expected)
		})
		test('Verify parsed JSON -> model transform', () => {
			const data = {
				id: 90610,
				group_id: 23738,
				role: 'owner',
				identity_id: 712052,
				first_name: 'Bruce',
				last_name: 'Wayne',
				email: 'b@example.com',
				company: 'BillSpring',
				business_id: 77128,
				active: true,
			}
			const model = transformGroupResponse(data)
			const expected = {
				id: '90610',
				groupId: '23738',
				role: 'owner',
				identityId: '712052',
				firstName: 'Bruce',
				lastName: 'Wayne',
				email: 'b@example.com',
				company: 'BillSpring',
				businessId: '77128',
				active: true,
			}
			expect(model).toEqual(expected)
		})
	})
})
