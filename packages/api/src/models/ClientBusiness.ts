/* eslint-disable @typescript-eslint/camelcase */
export default interface ClientBusiness {
	businessId: number
}

export interface ClientBusinessResponse {
	business_id: number
}

export function transformClientBusinessResponse(clientBusiness: ClientBusinessResponse): ClientBusiness {
	return {
		businessId: clientBusiness.business_id,
	}
}
