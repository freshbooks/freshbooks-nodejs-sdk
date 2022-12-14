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

/**
 * Parse a JSON string to @ClientBusiness object
 * @param json JSON string
 * eg: '{
 *          "business_id": 77128
 *      }'
 * @returns ClientBusiness object
 */
export function transformClientBusinessJSON(json: string): ClientBusiness {
	const response: ClientBusinessResponse = JSON.parse(json)
	return transformClientBusinessResponse(response)
}
