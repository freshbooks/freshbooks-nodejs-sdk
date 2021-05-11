export default interface Tax {
	amount?: number
	name?: string
}

export interface TaxResponse {
	amount: string
	name: string
}

/**
 * Format a Tax response object
 * @param tax Account business object
 * eg: { "amount": "1234.00", "tax": "HST" }
 * @returns Tax object
 */
export function transformTaxResponse(tax: any): Tax {
	return {
		amount: tax.amount,
		name: tax.name,
	}
}

/**
 * Parse a JSON string to @Tax object
 * @param json JSON string
 * eg: '{
 *          "amount": "1234.00",
 *          "code": "HST"
 *      }'
 * @returns Tax object
 */
export function transformtaxJSON(json: string): Tax {
	const response: TaxResponse = JSON.parse(json)
	return transformTaxResponse(response)
}

export function transformTaxRequest({ amount, name }: Tax): any {
	return {
		amount,
		name,
	}
}
