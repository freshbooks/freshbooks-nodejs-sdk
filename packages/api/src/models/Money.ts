export default interface Money {
	amount?: number
	code?: string
}

export interface MoneyResponse {
	amount: string
	code: string
}

export function transformMoneyParsedResponse(money: MoneyResponse): Money {
	return {
		amount: Number(money.amount),
		code: money.code,
	}
}

export function transformMoneyRequest(money: Money = {}): any {
	return {
		amount: money.amount,
		code: money.code,
	}
}
