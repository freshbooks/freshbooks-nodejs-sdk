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
		billPayments: bill_payments.map((billPayment: BillPayments) => transformBillPaymentsParsedResponse(billPayment)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

export function transformBillPaymentsParsedResponse(billPayment: any): BillPayments {
	return {
		id: billPayment.id,
		amount: billPayment.amount && transformMoneyParsedResponse(billPayment.amount),
		billId: billPayment.billid,
		paidDate: billPayment.paid_date && transformDateResponse(billPayment.paid_date, DateFormat['YYYY-MM-DD']),
		paymentType: billPayment.payment_type,
		note: billPayment.note,
		visState: billPayment.vis_state,
	}
}

export function transformBillPaymentsRequest(billPayment: BillPayments): string {
	return JSON.stringify({
		bill_payment: {
			id: billPayment.id,
			amount: billPayment.amount && transformMoneyRequest(billPayment.amount),
			billid: billPayment.billId,
			paid_date: billPayment.paidDate && transformDateRequest(billPayment.paidDate),
			payment_type: billPayment.paymentType,
			note: billPayment.note,
			vis_state: billPayment.visState,
		},
	})
}
