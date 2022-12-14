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

export function transformGroupParsedResponse(group: GroupResponse): Group {
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
