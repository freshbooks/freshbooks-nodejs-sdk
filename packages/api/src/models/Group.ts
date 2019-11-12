/* eslint-disable @typescript-eslint/camelcase */
export default interface Group {
	id: string
	groupId: string
	role: string
	identityId: string
	firstName: string
	lastName: string
	email: string
	company: string
	businessId: string
	active: boolean
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
	const {
		id,
		group_id: groupId = '',
		role,
		identity_id: identityId = '',
		first_name: firstName,
		last_name: lastName,
		email,
		company,
		business_id: businessId = '',
		active,
	} = JSON.parse(json)
	return {
		id: id.toString(),
		groupId: groupId.toString(),
		role,
		identityId: identityId.toString(),
		firstName,
		lastName,
		email,
		company,
		businessId: businessId.toString(),
		active,
	}
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
export function transformGroupResponse(data: any): Group {
	const {
		id,
		group_id: groupId = '',
		role,
		identity_id: identityId = '',
		first_name: firstName,
		last_name: lastName,
		email,
		company,
		business_id: businessId = '',
		active,
	} = data
	return {
		id: id.toString(),
		groupId: groupId.toString(),
		role,
		identityId: identityId.toString(),
		firstName,
		lastName,
		email,
		company,
		businessId: businessId.toString(),
		active,
	}
}
