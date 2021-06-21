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

/**
 * Format a Role response object
 * @param data Role object
 * eg: { "id": 682608, "role": "admin", "systemid": 1953394, "userid": 1, "created_at": "2016-01-26T16:00:44Z", "links": { "destroy": "/service/auth/api/v1/users/role/682608" }, "accountid": "zDmNq"}
 * @returns Role object
 */
export function transformRoleResponse({
	id,
	role,
	systemid,
	userid,
	accountid,
	created_at,
	links,
}: RoleResponse): Role {
	return {
		id: id,
		role,
		systemId: systemid,
		userId: userid,
		accountId: accountid.toString(),
		createdAt: new Date(created_at),
		links,
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
