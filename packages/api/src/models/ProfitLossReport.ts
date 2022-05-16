/* eslint-disable @typescript-eslint/camelcase */
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import ProfitLossEntry, {
	ProfitLossEntryResponse,
	transformProfitLossEntryResponse,
	transformProfitLossEntryResponseList,
} from './ProfitLossEntry'

export default interface ProfitLossReport {
	companyName: string
	currencyCode: string
	cashBased: boolean
	resolution?: string
	startDate: Date
	endDate: Date
	downloadToken: string
	labels: Date[]
	netProfit: ProfitLossEntry
	totalIncome: ProfitLossEntry
	totalExpenses: ProfitLossEntry
	grossMargin: ProfitLossEntry
	income: ProfitLossEntry[]
	expenses: ProfitLossEntry[]
}

interface ProfitLossReportResponse {
	net_profit: ProfitLossEntryResponse
	total_income: ProfitLossEntryResponse
	total_expenses: ProfitLossEntryResponse
	end_date: Date
	income: ProfitLossEntryResponse[]
	expenses: ProfitLossEntryResponse[]
	gross_margin: ProfitLossEntryResponse
	labels: Date[]
	download_token: string
	company_name: string
	cash_based: boolean
	resolution?: string
	start_date: Date
	currency_code: string
}

export function transformProfitLossReportData({
	cash_based,
	company_name,
	currency_code,
	labels,
	download_token,
	end_date,
	expenses,
	gross_margin,
	income,
	net_profit,
	resolution,
	start_date,
	total_expenses,
	total_income,
}: ProfitLossReportResponse): ProfitLossReport {
	return {
		companyName: company_name,
		currencyCode: currency_code,
		cashBased: cash_based,
		startDate: start_date,
		endDate: end_date,
		resolution: resolution,
		labels: labels,
		downloadToken: download_token,
		expenses: expenses && transformProfitLossEntryResponseList(expenses),
		grossMargin: gross_margin && transformProfitLossEntryResponse(gross_margin),
		income: income && transformProfitLossEntryResponseList(income),
		netProfit: net_profit && transformProfitLossEntryResponse(net_profit),
		totalExpenses: total_expenses && transformProfitLossEntryResponse(total_expenses),
		totalIncome: total_income && transformProfitLossEntryResponse(total_income),
	}
}

/**
 * Parses JSON ProfitLossReport response and converts to @ProfitLossReport model
 * @param data representing JSON response
 * @returns @ProfitLossReport | @Error
 */
export function transformProfitLossReportResponse(data: string): ProfitLossReport | ErrorResponse {
	const response = JSON.parse(data)
	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}
	const {
		response: { result },
	} = response
	const { profitloss } = result
	return transformProfitLossReportData(profitloss)
}
