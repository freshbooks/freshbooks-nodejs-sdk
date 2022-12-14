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

export function transformMoneyRequest({ amount, code }: Money = {}): any {
	return {
		amount,
		code,
	}
}
