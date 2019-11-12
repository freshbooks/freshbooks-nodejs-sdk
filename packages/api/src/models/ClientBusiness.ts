export default interface ClientBusiness {
	businessId: string
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
	const { business_id: businessId = '' } = JSON.parse(json)

	return {
		businessId: businessId.toString(),
	}
}

/**
 * Format a ClientBusiness response object
 * @param data Client business object
 * eg: { business_id: 77128 }
 * @returns Client business object
 */
export function transformClientBusinessResponse(data: any): ClientBusiness {
	const { business_id: businessId } = data
	return {
		businessId: businessId.toString(),
	}
}
