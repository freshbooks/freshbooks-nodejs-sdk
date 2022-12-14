/* eslint-disable @typescript-eslint/camelcase */
import Money, { transformMoneyRequest, transformMoneyParsedResponse } from './Money'
import VisState from './VisState'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import Pagination from './Pagination'
import { transformDateRequest, DateFormat, transformDateResponse } from './Date'
import { Nullable } from './helpers'

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

export function transformPaymentResponse(data: string): Payment | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { payment } = response.response.result

	return transformPaymentParsedResponse(payment)
}

export function transformPaymentListResponse(data: string): { payments: Payment[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { payments, per_page, total, page, pages } = response.response.result

	return {
		payments: payments.map((payment: any) => transformPaymentParsedResponse(payment)),
		pages: {
			total,
			size: per_page,
			pages,
			page,	
		},
	}
}

function transformPaymentParsedResponse(payment: any): Payment {
	return {
		orderId: payment.orderid,
		accountingSystemId: payment.accounting_systemid,
		updated: transformDateResponse(payment.updated, DateFormat['YYYY-MM-DD hh:mm:ss']),
		invoiceId: payment.invoiceid,
		creditId: payment.creditid,
		amount: transformMoneyParsedResponse(payment.amount),
		clientId: payment.clientid,
		visState: payment.vis_state,
		logId: payment.logid,
		note: payment.note,
		overpaymentId: payment.overpaymentid,
		gateway: payment.gateway,
		date: transformDateResponse(payment.date, DateFormat['YYYY-MM-DD']),
		transactionId: payment.transactionid,
		fromCredit: payment.from_credit,
		type: payment.type,
		id: payment.id,
	}
}

export function transformPaymentRequest(payment: Payment): string {
	return JSON.stringify({
		payment: {
			amount: payment.amount && transformMoneyRequest(payment.amount),
			date: transformDateRequest(payment.date),
			invoiceid: payment.invoiceId,
			note: payment.note,
			orderid: payment.orderId,
			transactionid: payment.transactionId,
			type: payment.type,
			vis_state: payment.visState,
		},
	})
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
