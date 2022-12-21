/* eslint-disable @typescript-eslint/camelcase */
export default interface ClientBusiness {
	businessId: number
}

export interface ClientBusinessResponse {
	business_id: number
}

export function transformClientBusinessParsedResponse(business: ClientBusinessResponse): ClientBusiness {
	return {
		businessId: business.business_id,
	}
}
