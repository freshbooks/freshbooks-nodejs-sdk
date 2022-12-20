/* eslint-disable @typescript-eslint/camelcase */
import Money, { MoneyResponse, transformMoneyParsedResponse } from '../Money'

enum ProfitLossEntryType {
	debit = 'debit',
	credit = 'credit',
	none = 'none',
}

export default interface ProfitLossEntry {
	entryType: ProfitLossEntryType
	total: Money
	data: Money[]
	description: string
	children: ProfitLossEntry[]
}

export interface ProfitLossEntryResponse {
	entry_type: ProfitLossEntryType
	total: MoneyResponse
	data: MoneyResponse[]
	description: string
	children: ProfitLossEntryResponse[]
}

export function transformProfitLossEntryResponse(response: ProfitLossEntryResponse): ProfitLossEntry {
	const childEntries =
		response.children && response.children.length > 0
			? response.children.map((child: ProfitLossEntryResponse) => transformProfitLossEntryResponse(child))
			: []
	const dataEntries =
		response.data && response.data.length > 0
			? response.data.map((dataEntry: MoneyResponse) => transformMoneyParsedResponse(dataEntry))
			: []
	return {
		children: childEntries,
		data: dataEntries,
		description: response.description,
		entryType: response.entry_type,
		total: response.total && transformMoneyParsedResponse(response.total),
	}
}

export function transformProfitLossEntryResponseList(data: ProfitLossEntryResponse[]): ProfitLossEntry[] {
	if (data && data.length > 0) {
		return data.map((child: ProfitLossEntryResponse) => transformProfitLossEntryResponse(child))
	} else {
		return []
	}
}
