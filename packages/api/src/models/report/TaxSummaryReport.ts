/* eslint-disable @typescript-eslint/camelcase */
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from '../Error'
import Money, { MoneyResponse, transformMoneyParsedResponse } from '../Money'
import TaxSummaryEntry, { TaxSummaryEntryResponse, transformTaxSummaryEntryResponeList } from './TaxSummaryEntry'

export default interface TaxSummaryReport {
	currencyCode: string
	cashBased: boolean
	startDate: Date
	endDate: Date
	downloadToken: string
	taxes: TaxSummaryEntry[]
	totalInvoiced: Money
}

interface TaxSummaryReportResponse {
	cash_based: boolean
	start_date: Date
	currency_code: string
	end_date: Date
	download_token: string
	taxes: TaxSummaryEntryResponse[]
	total_invoiced: MoneyResponse
}

export function transformTaxSummaryReportData({
	cash_based,
	currency_code,
	download_token,
	start_date,
	end_date,
	taxes,
	total_invoiced,
}: TaxSummaryReportResponse): TaxSummaryReport {
	return {
		currencyCode: currency_code,
		cashBased: cash_based,
		startDate: start_date,
		endDate: end_date,
		downloadToken: download_token,
		totalInvoiced: total_invoiced && transformMoneyParsedResponse(total_invoiced),
		taxes: transformTaxSummaryEntryResponeList(taxes),
	}
}

/**
 * Parses JSON TaxSummaryReport response and converts to @TaxSummaryReport model
 * @param data representing JSON response
 * @returns @TaxSummaryReport | @Error
 */
export function transformTaxSummaryReportResponse(
	data: string,
	headers: Array<string>,
	status: string
): TaxSummaryReport | ErrorResponse {
	const response = JSON.parse(data)
	if (isAccountingErrorResponse(status, response)) {
		return transformErrorResponse(response)
	}
	const {
		response: { result },
	} = response
	const { taxsummary } = result
	return transformTaxSummaryReportData(taxsummary)
}
