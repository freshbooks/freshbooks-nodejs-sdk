import Money, { transformMoneyRequest, transformMoneyParsedResponse } from './Money'
import VisState from './VisState'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import Pagination from './Pagination'
import { transformDateRequest, DateFormat, transformDateResponse } from './Date'
import { Nullable } from './helpers'

/* eslint-disable @typescript-eslint/camelcase */

export enum PaymentType {
	Check = 'Check',
	Credit = 'Credit',
	Cash = 'Cash',
	BankTransfer = 'Bank Transfer',
	CreditCard = 'Credit Card',
	Debit = 'Debit',
	PayPal = 'PayPal',
	TwoCheckout = '2Checkout',
	Visa = 'VISA',
	Mastercard = 'MASTERCARD',
	Discover = 'DISCOVER',
	Amex = 'AMEX',
	Diners = 'DINERS',
	Jcb = 'JCB',
	Ach = 'ACH',
	Other = "Other"
}

export default interface Payment {
	orderId?: number
	accountingSystemId?: string
	updated?: Date
	invoiceId: string
	creditId?: Nullable<string>
	amount: Money
	clientId?: string
	visState?: VisState
	logId?: string
	note?: string
	overpaymentId?: Nullable<string>
	gateway?: Nullable<string>
	date: Date
	transactionId?: Nullable<string>
	fromCredit?: boolean
	type?: PaymentType
	id?: string
}

function transformPaymentData({
	orderid: orderId,
	accounting_systemid: accountingSystemId,
	updated,
	invoiceid: invoiceId,
	creditid: creditId,
	amount,
	clientid: clientId,
	vis_state: visState,
	logid: logId,
	note,
	overpaymentid: overpaymentId,
	gateway,
	date,
	transactionid: transactionId,
	from_credit: fromCredit,
	type,
	id,
}: any): Payment {
	return {
		orderId,
		accountingSystemId,
		updated: transformDateResponse(updated, DateFormat['YYYY-MM-DD hh:mm:ss']),
		invoiceId,
		creditId,
		amount: transformMoneyParsedResponse(amount),
		clientId,
		visState,
		logId,
		note,
		overpaymentId,
		gateway,
		date: transformDateResponse(date, DateFormat['YYYY-MM-DD']),
		transactionId,
		fromCredit,
		type,
		id,
	}
}

export function transformPaymentResponse(data: string): Payment | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { payment } = response.response.result

	return transformPaymentData(payment)
}

export function transformPaymentListResponse(data: string): { payments: Payment[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { payments, per_page, total, page, pages } = response.response.result

	return {
		payments: payments.map((payment: any) => transformPaymentData(payment)),
		pages: {
			total,
			size: per_page,
			pages,
			page,	
		},
	}
}

export function transformPaymentRequest({
	orderId: orderid,
	invoiceId: invoiceid,
	amount,
	visState: vis_state,
	note,
	date,
	transactionId: transactionid,
	type,
}: Payment): string {
	const result = JSON.stringify({
		payment: {
			amount: amount && transformMoneyRequest(amount),
			date: transformDateRequest(date),
			invoiceid,
			note,
			orderid,
			transactionid,
			type,
			vis_state,
		},
	})
	return result
}

export function transformPaymentUpdateRequest({
	orderId: orderid,
	amount,
	note,
	date,
	transactionId: transactionid,
	type,
}: Payment): string {
	const result = JSON.stringify({
		payment: {
			amount: amount && transformMoneyRequest(amount),
			date: date && transformDateRequest(date),
			note,
			orderid,
			transactionid,
			type,
		},
	})
	return result
}
