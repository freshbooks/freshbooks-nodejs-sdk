/* eslint-disable @typescript-eslint/camelcase */
import Money, { transformMoneyRequest, transformMoneyResponse } from './Money'
import { DateFormat, transformDateRequest, transformDateResponse } from './Date'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import Pagination from './Pagination'
import BillPayments, { transformBillPaymentsData } from './BillPayments'
import VisState from './VisState'
import BillLines, { transformBillLinesRequest, transformBillLinesResponse } from './BillLines'

enum BillStatus {
	unpaid = 'unpaid',
	overdue = 'overdue',
	partial = 'partial',
	paid = 'paid',
}

export default interface Bills {
	id?: number
	amount?: Money
	attachment?: object
	billNumber?: string
	billPayments?: BillPayments[]
	createdAt?: Date
	currencyCode?: string
	dueDate?: Date
	dueOffsetDays?: number
	issueDate?: Date
	language?: string
	lines?: BillLines[]
	outstanding?: Money
	overallCategory?: string
	overallDescription?: string
	paid?: Money
	status?: BillStatus
	taxAmount?: Money
	totalAmount?: Money
	updatedAt?: Date
	vendorId: number
	visState?: VisState
	vendor?: object
}

export function transformBillsData(bill: any): Bills {
	return {
		id: bill.id,
		amount: bill.amount && transformMoneyResponse(bill.amount),
		attachment: bill.attachment,
		billNumber: bill.bill_number,
		billPayments:
			bill.bill_payments &&
			bill.bill_payments.map((billPayment: any): BillPayments => transformBillPaymentsData(billPayment)),
		createdAt: bill.created_at && transformDateResponse(bill.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		currencyCode: bill.currency_code,
		dueDate: bill.due_date && transformDateResponse(bill.due_date, DateFormat['YYYY-MM-DD']),
		dueOffsetDays: bill.due_offset_days,
		issueDate: bill.issue_date && transformDateResponse(bill.issue_date, DateFormat['YYYY-MM-DD']),
		language: bill.language,
		lines: bill.lines && bill.lines.map((line: any): BillLines => transformBillLinesResponse(line)),
		outstanding: bill.outstanding && transformMoneyResponse(bill.outstanding),
		overallCategory: bill.overall_category,
		overallDescription: bill.overall_description,
		paid: bill.paid && transformMoneyResponse(bill.paid),
		status: bill.status,
		taxAmount: bill.tax_amount && transformMoneyResponse(bill.tax_amount),
		totalAmount: bill.total_amount && transformMoneyResponse(bill.total_amount),
		updatedAt: bill.updated_at && transformDateResponse(bill.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		vendorId: bill.vendorid,
		visState: bill.vis_state,
	}
}

/**
 * Parses JSON Bill response and converts to @Bills model
 * @param data representing JSON response
 * @returns @Bills | @Error
 */
export function transformBillsResponse(data: any): Bills | ErrorResponse {
	const response = JSON.parse(data)
	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: { result },
	} = response

	const { bill } = result
	return transformBillsData(bill)
}

/**
 * Parses JSON list response and converts to internal bills list response
 * @param data representing JSON response
 * @returns bills list response
 */
export function transformBillsListResponse(data: string): { bills: Bills[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)
	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: { result },
	} = response

	const { bills, per_page, total, page, pages } = result
	return {
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
		bills: bills.map((bills: Bills) => transformBillsData(bills)),
	}
}

export function transformBillsRequest(bill: Bills): string {
	return JSON.stringify({
		bill: {
			id: bill.id,
			amount: bill.amount && transformMoneyRequest(bill.amount),
			attachment: bill.attachment,
			bill_number: bill.billNumber,
			bill_payments:
				bill.billPayments && bill.billPayments.map((billPayment) => transformBillPaymentsData(billPayment)),
			created_at: bill.createdAt,
			currency_code: bill.currencyCode,
			due_date: bill.dueDate && transformDateRequest(bill.dueDate),
			due_offset_days: bill.dueOffsetDays,
			issue_date: bill.issueDate && transformDateRequest(bill.issueDate),
			language: bill.language,
			lines: bill.lines && bill.lines.map((line) => transformBillLinesRequest(line)),
			outstanding: bill.outstanding && transformMoneyRequest(bill.outstanding),
			overall_category: bill.overallCategory,
			overall_description: bill.overallDescription,
			paid: bill.paid && transformMoneyRequest(bill.paid),
			status: bill.status,
			tax_amount: bill.taxAmount && transformMoneyRequest(bill.taxAmount),
			total_amount: bill.totalAmount && transformMoneyRequest(bill.totalAmount),
			updated_at: bill.updatedAt,
			vendorid: bill.vendorId,
			vis_state: bill.visState,
		},
	})
}
