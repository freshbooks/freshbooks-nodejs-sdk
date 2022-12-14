export default interface Money {
	amount?: number
	code?: string
}

export interface MoneyResponse {
	amount: string
	code: string
}

export function transformMoneyParsedResponse({ amount, code }: MoneyResponse): Money {
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
	return transformMoneyParsedResponse(response)
}

export function transformMoneyRequest({ amount, code }: Money = {}): any {
	return {
		amount,
		code,
	}
}
