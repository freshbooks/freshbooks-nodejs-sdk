/* eslint-disable @typescript-eslint/camelcase */
export default interface Role {
	id: number
	role: string
	systemId: number
	userId: number
	accountId: string
	createdAt: Date
	links: { [key: string]: string }
}

export interface RoleResponse {
	id: number
	role: string
	systemid: number
	userid: number
	accountid: string
	created_at: string
	links: { [key: string]: string }
}

export function transformRoleResponse(role: RoleResponse): Role {
	return {
		id: role.id,
		role: role.role,
		systemId: role.systemid,
		userId: role.userid,
		accountId: role.accountid.toString(),
		createdAt: new Date(role.created_at),
		links: role.links,
	}
}

/**
 * Parse a JSON string to @Role object
 * @param json JSON string
 * eg: '{
 *         "id": 682608,
 *         "role": "admin",
 *         "systemid": 1953394,
 *         "userid": 1,
 *         "created_at": "2016-01-26T16:00:44Z",
 *         "links": {
 *              "destroy": "/service/auth/api/v1/users/role/682608"
 *         },
 *         "accountid": "zDmNq"
 *       }'
 * @returns Role object
 */
export function transformRoleJSON(json: string): Role {
	const response: RoleResponse = JSON.parse(json)
	return transformRoleResponse(response)
}
