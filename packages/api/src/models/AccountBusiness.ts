export default interface AccountBusiness {
	accountId: string
	businessId: string
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
	const {
		account_id: accountId = '',
		account_business_id: businessId = '',
	} = JSON.parse(json)

	return {
		accountId,
		businessId: businessId.toString(),
	}
}

/**
 * Format a AccountBusiness response object
 * @param data Account business object
 * eg: { account_business_id: 363103, "account_id": "Xr82w" }
 * @returns Account business object
 */
export function transformAccountBusinessResponse(data: any): AccountBusiness {
	const {
		account_id: accountId = '',
		account_business_id: businessId = '',
	} = data
	return {
		accountId,
		businessId: businessId.toString(),
	}
}
