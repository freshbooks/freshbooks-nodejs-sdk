/* eslint-disable @typescript-eslint/camelcase */
import Pagination from './Pagination'
import { DateFormat, transformDateRequest, transformDateResponse } from './Date'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import Money, { transformMoneyRequest, transformMoneyResponse } from './Money'
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

export function transformBillPaymentsData(billPayments: any): BillPayments {
	return {
		id: billPayments.id,
		amount: billPayments.amount && transformMoneyResponse(billPayments.amount),
		billId: billPayments.billid,
		paidDate: billPayments.paid_date && transformDateResponse(billPayments.paid_date, DateFormat['YYYY-MM-DD']),
		paymentType: billPayments.payment_type,
		note: billPayments.note,
		visState: billPayments.vis_state,
	}
}

/**
 * Parses JSON Bill response and converts to @BillPayments model
 * @param data representing JSON response
 * @returns @BillPayments | @Error
 */
export function transformBillPaymentsResponse(data: any): BillPayments | ErrorResponse {
	const response = JSON.parse(data)
	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: { result },
	} = response

	const { bill_payment } = result
	return transformBillPaymentsData(bill_payment)
}

/**
 * Parses JSON list response and converts to internal bills list response
 * @param data representing JSON response
 * @returns bill_payments list response
 */
export function transformBillPaymentsListResponse(
	data: string
): { billPayments: BillPayments[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)
	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: { result },
	} = response

	const { bill_payments, per_page, total, page, pages } = result
	return {
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
		billPayments: bill_payments.map((billPayment: BillPayments) => transformBillPaymentsData(billPayment)),
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
