/* eslint-disable @typescript-eslint/camelcase */
export default interface ClientBusiness {
	businessId: string
}

export interface ClientBusinessResponse {
	business_id: number
}

/**
 * Format a ClientBusiness response object
 * @param data Client business object
 * eg: { "business_id": 77128 }
 * @returns Client business object
 */
export function transformClientBusinessResponse({ business_id }: ClientBusinessResponse): ClientBusiness {
	return {
		businessId: business_id.toString(),
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
