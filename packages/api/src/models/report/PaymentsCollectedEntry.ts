/* eslint-disable @typescript-eslint/camelcase */
import Money, { MoneyResponse, transformMoneyResponse } from '../Money'

export default interface PaymentsCollectedEntry {
	amount: Money
	client: string
	clientId: number
	creditNumber?: string
	creditId?: number
	date: Date
	description: string
	fromCredit: boolean
	invoiceNumber?: string
	invoiceId?: number
	method: string
}

export interface PaymentsCollectedEntryResponse {
	amount: MoneyResponse
	client: string
	clientid: number
	credit_number?: string
	creditid?: number
	date: Date
	description: string
	from_credit: boolean
	invoice_number?: string
	invoiceid?: number
	method: string
}

export function transformPaymentsCollectedEntryRespone(
	response: PaymentsCollectedEntryResponse
): PaymentsCollectedEntry {
	return {
		amount: response.amount && transformMoneyResponse(response.amount),
		client: response.client,
		clientId: response.clientid,
		creditNumber: response.credit_number,
		creditId: response.creditid,
		date: response.date,
		description: response.description,
		fromCredit: response.from_credit,
		invoiceNumber: response.invoice_number,
		invoiceId: response.invoiceid,
		method: response.method,
	}
}

export function transformPaymentsCollectedEntryResponeList(
	data: PaymentsCollectedEntryResponse[]
): PaymentsCollectedEntry[] {
	if (data && data.length > 0) {
		return data.map((child: PaymentsCollectedEntryResponse) => transformPaymentsCollectedEntryRespone(child))
	} else {
		return []
	}
}
