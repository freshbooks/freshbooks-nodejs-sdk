/* eslint-disable @typescript-eslint/camelcase */
import Money, { transformMoneyParsedResponse } from './Money'
import { DateFormat, transformDateRequest, transformDateResponse } from './Date'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import Pagination from './Pagination'
import BillPayments, { transformBillPaymentsParsedResponse } from './BillPayments'
import VisState from './VisState'
import BillLines, { transformBillLinesRequest, transformBillLinesParsedResponse } from './BillLines'
import BillVendors, { transformBillVendorsParsedResponse } from './BillVendors'

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
	vendor?: BillVendors
}

export function transformBillsResponse(data: string): Bills | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { bill } = response.response.result
	
	return transformBillsParsedResponse(bill)
}

export function transformBillsListResponse(data: string): { bills: Bills[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { bills, per_page, total, page, pages } = response.response.result

	return {
		bills: bills.map((bill: any) => transformBillsParsedResponse(bill)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},	
	}
}

export function transformBillsParsedResponse(bill: any): Bills {
	return {
		id: bill.id,
		amount: bill.amount && transformMoneyParsedResponse(bill.amount),
		attachment: bill.attachment,
		billNumber: bill.bill_number,
		billPayments:
			bill.bill_payments &&
			bill.bill_payments.map((billPayment: any): BillPayments => transformBillPaymentsParsedResponse(billPayment)),
		createdAt: bill.created_at && transformDateResponse(bill.created_at, DateFormat['YYYY-MM-DD hh:mm:ss'], 'UTC'),
		currencyCode: bill.currency_code,
		dueDate: bill.due_date && transformDateResponse(bill.due_date, DateFormat['YYYY-MM-DD']),
		dueOffsetDays: bill.due_offset_days,
		issueDate: bill.issue_date && transformDateResponse(bill.issue_date, DateFormat['YYYY-MM-DD']),
		language: bill.language,
		lines: bill.lines && bill.lines.map((line: any): BillLines => transformBillLinesParsedResponse(line)),
		outstanding: bill.outstanding && transformMoneyParsedResponse(bill.outstanding),
		overallCategory: bill.overall_category,
		overallDescription: bill.overall_description,
		paid: bill.paid && transformMoneyParsedResponse(bill.paid),
		status: bill.status,
		taxAmount: bill.tax_amount && transformMoneyParsedResponse(bill.tax_amount),
		totalAmount: bill.total_amount && transformMoneyParsedResponse(bill.total_amount),
		updatedAt: bill.updated_at && transformDateResponse(bill.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss'], 'UTC'),
		vendorId: bill.vendorid,
		visState: bill.vis_state,
		vendor: bill.vendor && transformBillVendorsParsedResponse(bill.vendor),
	}
}

export function transformBillsRequest(bill: Bills): string {
	return JSON.stringify({
		bill: {
			id: bill.id,
			attachment: bill.attachment,
			bill_number: bill.billNumber,
			bill_payments:
				bill.billPayments && 
				bill.billPayments.map((billPayment) => transformBillPaymentsParsedResponse(billPayment)),
			currency_code: bill.currencyCode,
			due_date: bill.dueDate && transformDateRequest(bill.dueDate),
			due_offset_days: bill.dueOffsetDays,
			issue_date: bill.issueDate && transformDateRequest(bill.issueDate),
			language: bill.language,
			lines: bill.lines && bill.lines.map((line) => transformBillLinesRequest(line)),
			vendorid: bill.vendorId,
			vis_state: bill.visState,
		},
	})
}
