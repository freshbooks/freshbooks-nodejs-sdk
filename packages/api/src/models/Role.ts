export default interface Role {
	id: string
	role: string
	systemId: string
	userId: string
	accountId: string
	createdAt: Date
	links: Map<string, string>
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
	const {
		id,
		role,
		systemid: systemId = '',
		userid: userId = '',
		accountid: accountId = '',
		created_at: createdAt = new Date(),
		links,
	} = JSON.parse(json)

	return {
		id: id.toString(),
		role,
		systemId: systemId.toString(),
		userId: userId.toString(),
		accountId: accountId.toString(),
		createdAt,
		links,
	}
}

/**
 * Format a Role response object
 * @param data Role object
 * eg: { "id": 682608, "role": "admin", "systemid": 1953394, "userid": 1, "created_at": "2016-01-26T16:00:44Z", "links": { "destroy": "/service/auth/api/v1/users/role/682608" }, "accountid": "zDmNq"}
 * @returns Role object
 */
export function transformRoleResponse(data: any): Role {
	const {
		id,
		role,
		systemid: systemId = '',
		userid: userId = '',
		accountid: accountId = '',
		created_at: createdAt,
		links,
	} = data
	return {
		id: id.toString(),
		role,
		systemId: systemId.toString(),
		userId: userId.toString(),
		accountId: accountId.toString(),
		createdAt,
		links,
	}
}
