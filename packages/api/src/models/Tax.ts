export default interface Tax {
	amount?: number
	name?: string
}

export interface TaxResponse {
	amount: string
	name: string
}

export function transformTaxParsedResponse(tax: any): Tax {
	return {
		amount: tax.amount,
		name: tax.name,
	}
}

export function transformTaxRequest({ amount, name }: Tax): any {
	return {
		amount,
		name,
	}
}
