/* eslint-disable @typescript-eslint/camelcase */
export default interface AccountBusiness {
	accountId: string
	businessId: string
}

export interface AccountBusinessResponse {
	account_id: string
	account_business_id: number
}

/**
 * Format a AccountBusiness response object
 * @param data Account business object
 * eg: { "account_business_id": 363103, "account_id": "Xr82w" }
 * @returns Account business object
 */
export function transformAccountBusinessResponse({
	account_id,
	account_business_id,
}: AccountBusinessResponse): AccountBusiness {
	return {
		accountId: account_id,
		businessId: account_business_id.toString(),
	}
}

/**
 * Parse a JSON string to @AccountBusiness object
 * @param json JSON string
 * eg: '{
 *          "account_business_id": 363103,
 *          "account_id": "Xr82w"
 *      }'
 * @returns AccountBusiness object
 */
export function transformAccountBusinessJSON(json: string): AccountBusiness {
	const response: AccountBusinessResponse = JSON.parse(json)
	return transformAccountBusinessResponse(response)
}
