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

export function transformBusinessMembershipParsedResponse(businessMembership: BusinessMembershipResponse): BusinessMembership {
	return {
		id: businessMembership.id,
		role: businessMembership.role,
		business: businessMembership.business && transformBusinessParsedResponse(businessMembership.business),
	}
}
