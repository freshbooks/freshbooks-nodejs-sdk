import Business from './Business'

export default interface BusinessMembership {
	id: string
	role: string
	business: Business
}

/**
 * Parse a JSON string to @BusinessMembership object
 * @param json JSON string
 */
export function transformBusinessMembershipJSON(
	json: string
): BusinessMembership {
	const { id, role, business } = JSON.parse(json)

	return {
		id,
		role,
		business,
	}
}

/**
 * Format a BusinessMembership response object
 * @param data BusinessMembership object
 * eg: { id: '1', "role": "owner" }
 * @returns BusinessMembership object
 */
export function transformBusinessMembershipResponse(
	data: any
): BusinessMembership {
	const { id, role, business } = data
	return {
		id,
		role,
		business,
	}
}
