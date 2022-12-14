import { group } from "console"

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
export function transformGroupResponse(group: GroupResponse): Group {
	return {
		id: group.id,
		groupId: group.group_id,
		role: group.role,
		identityId: group.identity_id,
		firstName: group.first_name,
		lastName: group.last_name,
		email: group.email,
		company: group.company,
		businessId: group.business_id,
		active: group.active,
	}
}
