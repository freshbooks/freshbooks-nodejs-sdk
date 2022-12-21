export default interface Tax {
	amount?: number
	name?: string
}

export function transformTaxParsedResponse(tax: any): Tax {
	return {
		amount: tax.amount,
		name: tax.name,
	}
}

export function transformTaxParsedRequest(tax: Tax): any {
	return {
		amount: tax.amount,
		name: tax.name,
	}
}
