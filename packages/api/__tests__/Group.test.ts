/* eslint-disable @typescript-eslint/camelcase */
import { transformGroupJSON, transformGroupResponse } from '../src/models/Group'

describe('@freshbooks/api', () => {
	describe('Group', () => {
		test('Verify JSON -> model transform', () => {
			const json =
				'{"id": 90610, "group_id": 23738, "role": "owner","identity_id": 712052,"first_name": "Bruce","last_name": "Wayne","email": "b@example.com","company": "BillSpring","business_id": 77128,"active": true}'
			const model = transformGroupJSON(json)
			expect(model.id).toEqual('90610')
			expect(model.groupId).toEqual('23738')
			expect(model.role).toEqual('owner')
			expect(model.identityId).toEqual('712052')
			expect(model.firstName).toEqual('Bruce')
			expect(model.lastName).toEqual('Wayne')
			expect(model.email).toEqual('b@example.com')
			expect(model.company).toEqual('BillSpring')
			expect(model.businessId).toEqual('77128')
			expect(model.active).toEqual(true)
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
			expect(model.id).toEqual('90610')
			expect(model.groupId).toEqual('23738')
			expect(model.role).toEqual('owner')
			expect(model.identityId).toEqual('712052')
			expect(model.firstName).toEqual('Bruce')
			expect(model.lastName).toEqual('Wayne')
			expect(model.email).toEqual('b@example.com')
			expect(model.company).toEqual('BillSpring')
			expect(model.businessId).toEqual('77128')
			expect(model.active).toEqual(true)
		})
	})
})
