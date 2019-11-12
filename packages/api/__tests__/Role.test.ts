/* eslint-disable @typescript-eslint/camelcase */
import { transformRoleJSON, transformRoleResponse } from '../src/models/Role'

describe('@freshbooks/api', () => {
	describe('Role', () => {
		test('Verify JSON -> model transform', async () => {
			const json = `{
                "id": 682608, 
                "role": "admin", 
                "systemid": 1953394, 
                "userid": 1, 
                "links": { 
                    "destroy": "/service/auth/api/v1/users/role/682608" 
                }, 
                "accountid": "zDmNq",
                "created_at": "2016-01-26T16:00:44Z"
            }`
			const model = transformRoleJSON(json)

			expect(model).toEqual(
				expect.objectContaining({
					id: '682608',
					role: 'admin',
					systemId: '1953394',
					userId: '1',
					accountId: 'zDmNq',
					createdAt: '2016-01-26T16:00:44Z',
					links: expect.objectContaining({
						destroy: '/service/auth/api/v1/users/role/682608',
					}),
				})
			)
		})
		test('Verify parsed JSON -> model transform', async () => {
			const data = {
				id: 682608,
				role: 'admin',
				systemid: 1953394,
				userid: 1,
				links: {
					destroy: '/service/auth/api/v1/users/role/682608',
				},
				accountid: 'zDmNq',
				created_at: '2016-01-26T16:00:44Z',
			}
			const model = transformRoleResponse(data)

			expect(model).toEqual(
				expect.objectContaining({
					id: '682608',
					role: 'admin',
					systemId: '1953394',
					userId: '1',
					accountId: 'zDmNq',
					createdAt: '2016-01-26T16:00:44Z',
					links: expect.objectContaining({
						destroy: '/service/auth/api/v1/users/role/682608',
					}),
				})
			)
		})
	})
})
