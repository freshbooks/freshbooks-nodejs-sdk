/* eslint-disable @typescript-eslint/camelcase */
export default interface Group {
	id: number
	groupId: number
	role: string
	identityId: number
	firstName: string
	lastName: string
	email: string
	company: string
	businessId: number
	active: boolean
}

export interface GroupResponse {
	id: number
	group_id: number
	role: string
	identity_id: number
	first_name: string
	last_name: string
	email: string
	company: string
	business_id: number
	active: boolean
}

/**
 * Format an Group response object
 * @param data Group object
 * eg: {
 *      "id": 90610,
 *      "group_id": 23738,
 *      "role": "owner",
 *      "identity_id": 712052,
 *      "first_name": "Bruce",
 *      "last_name": "Wayne",
 *      "email": "b@example.com",
 *      "company": "BillSpring",
 *      "business_id": 77128,
 *      "active": true
 *    }
 * @returns Group object
 */
export function transformGroupResponse({
	id,
	group_id,
	role,
	identity_id,
	first_name: firstName,
	last_name: lastName,
	email,
	company,
	business_id,
	active,
}: GroupResponse): Group {
	return {
		id: id,
		groupId: group_id,
		role,
		identityId: identity_id,
		firstName,
		lastName,
		email,
		company,
		businessId: business_id,
		active,
	}
}

/**
 * Parse a JSON string to @Group object
 * @param json JSON string
 * eg: '{
 *       "id": 90610,
 *       "group_id": 23738,
 *       "role": "owner",
 *       "identity_id": 712052,
 *       "first_name": "Bruce",
 *       "last_name": "Wayne",
 *       "email": "b@example.com",
 *       "company": "BillSpring",
 *       "business_id": 77128,
 *       "active": true
 *     }'
 * @returns Group object
 */
export function transformGroupJSON(json: string): Group {
	const response: GroupResponse = JSON.parse(json)
	return transformGroupResponse(response)
}
