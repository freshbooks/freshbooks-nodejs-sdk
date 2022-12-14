/* eslint-disable @typescript-eslint/camelcase */
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from '../Error'
import Money, { MoneyResponse, transformMoneyParsedResponse } from '../Money'
import PaymentsCollectedEntry, {
	PaymentsCollectedEntryResponse,
	transformPaymentsCollectedEntryResponeList,
} from './PaymentsCollectedEntry'

export default interface PaymentsCollectedReport {
	currencyCodes: string[]
	clientIds: number[]
	startDate: Date
	endDate: Date
	downloadToken: string
	paymentMethods: string[]
	payments: PaymentsCollectedEntry[]
	totals: Money[]
}

interface PaymentsCollectedReportResponse {
	currency_codes: string[]
	clientids: number[]
	start_date: Date
	end_date: Date
	download_token: string
	payment_methods: string[]
	payments: PaymentsCollectedEntryResponse[]
	summary_only: boolean
	totals: MoneyResponse[]
}

export function transformPaymentsCollectedReportData({
	currency_codes,
	clientids,
	start_date,
	end_date,
	download_token,
	payment_methods,
	payments,
	totals,
}: PaymentsCollectedReportResponse): PaymentsCollectedReport {
	return {
		currencyCodes: currency_codes,
		clientIds: clientids,
		startDate: start_date,
		endDate: end_date,
		downloadToken: download_token,
		paymentMethods: payment_methods,
		payments: payments && transformPaymentsCollectedEntryResponeList(payments),
		totals: totals && totals.map((moneyResponse: MoneyResponse) => transformMoneyParsedResponse(moneyResponse)),
	}
}

/**
 * Parses JSON PaymentsCollectedReport response and converts to @PaymentsCollectedReport model
 * @param data representing JSON response
 * @returns @PaymentsCollectedReport | @Error
 */
export function transformPaymentsCollectedReportResponse(data: string): PaymentsCollectedReport | ErrorResponse {
	const response = JSON.parse(data)
	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}
	const {
		response: { result },
	} = response
	const { payments_collected } = result
	return transformPaymentsCollectedReportData(payments_collected)
}
