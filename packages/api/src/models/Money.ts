export default interface Money {
	amount?: string
	code?: string
}

export interface MoneyResponse {
	amount: string
	code: string
}

export function transformMoneyParsedResponse(money: MoneyResponse): Money {
	return {
		amount: money.amount,
		code: money.code,
	}
}

export function transformMoneyParsedRequest(money: Money = {}): any {
	return {
		amount: money.amount,
		code: money.code,
	}
}
