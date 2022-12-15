import Business, { transformBusinessParsedResponse, BusinessResponse } from './Business'

export default interface BusinessMembership {
	id: number
	role: string
	business: Business
}

export interface BusinessMembershipResponse {
	id: number
	role: string
	business: BusinessResponse
}

export function transformBusinessMembershipParsedResponse(membership: BusinessMembershipResponse): BusinessMembership {
	return {
		id: membership.id,
		role: membership.role,
		business: membership.business && transformBusinessParsedResponse(membership.business),
	}
}
