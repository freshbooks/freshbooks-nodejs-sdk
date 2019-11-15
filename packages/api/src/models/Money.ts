export default interface Money {
	amount: number
	code: string
}

export interface MoneyResponse {
	amount: string
	code: string
}

/**
 * Format a Money response object
 * @param data Account business object
 * eg: { "amount": "1234.00", "code": "USD" }
 * @returns Money object
 */
export function transformMoneyResponse({ amount, code }: MoneyResponse): Money {
	return {
		amount: Number(amount),
		code,
	}
}

/**
 * Parse a JSON string to @Money object
 * @param json JSON string
 * eg: '{
 *          "amount": "1234.00",
 *          "code": "USD"
 *      }'
 * @returns Money object
 */
export function transformMoneyJSON(json: string): Money {
	const response: MoneyResponse = JSON.parse(json)
	return transformMoneyResponse(response)
}
