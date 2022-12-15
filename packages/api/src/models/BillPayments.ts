/* eslint-disable @typescript-eslint/camelcase */
import Pagination from './Pagination'
import { DateFormat, transformDateRequest, transformDateResponse } from './Date'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import Money, { transformMoneyRequest, transformMoneyParsedResponse } from './Money'
import VisState from './VisState'

enum PaymentType {
	check = 'Check',
	credit = 'Credit',
	cash = 'Cash',
	bankTransfer = 'Bank Transfer',
	creditCard = 'Credit Card',
	debit = 'Debit',
	payPal = 'PayPal',
	twoCheckout = '2Checkout',
	visa = 'VISA',
	mastercard = 'MASTERCARD',
	discover = 'DISCOVER',
	amex = 'AMEX',
	diners = 'DINERS',
	jcb = 'JCB',
	ach = 'ACH',
	other = "Other"
}

export default interface BillPayments {
	id?: number
	amount: Money
	billId: number
	paidDate?: Date
	paymentType?: PaymentType
	note?: string
	visState?: VisState
}

export function transformBillPaymentsResponse(data: string): BillPayments | ErrorResponse {
	const response = JSON.parse(data)
	
	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}
	
	const { bill_payment } = response.response.result
	
	return transformBillPaymentsParsedResponse(bill_payment)
}

export function transformBillPaymentsListResponse(data: string): { billPayments: BillPayments[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { bill_payments, per_page, total, page, pages } = response.response.result
	
	return {
		billPayments: bill_payments.map((payment: BillPayments) => transformBillPaymentsParsedResponse(payment)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

export function transformBillPaymentsParsedResponse(payment: any): BillPayments {
	return {
		id: payment.id,
		amount: payment.amount && transformMoneyParsedResponse(payment.amount),
		billId: payment.billid,
		paidDate: payment.paid_date && transformDateResponse(payment.paid_date, DateFormat['YYYY-MM-DD']),
		paymentType: payment.payment_type,
		note: payment.note,
		visState: payment.vis_state,
	}
}

export function transformBillPaymentsRequest(payment: BillPayments): string {
	return JSON.stringify({
		bill_payment: {
			id: payment.id,
			amount: payment.amount && transformMoneyRequest(payment.amount),
			billid: payment.billId,
			paid_date: payment.paidDate && transformDateRequest(payment.paidDate),
			payment_type: payment.paymentType,
			note: payment.note,
			vis_state: payment.visState,
		},
	})
}
