/* eslint-disable @typescript-eslint/camelcase */
import Money, { transformMoneyParsedResponse, transformMoneyRequest } from './Money'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import { Nullable, transformIdResponse } from './helpers'
import Pagination from './Pagination'
import VisState from './VisState'
import { transformDateResponse, DateFormat, transformDateRequest } from './Date'
import ExpenseCategory, { transformExpenseCategoryParsedResponse } from './ExpenseCategory'

export enum ExpenseStatus {
	internal,
	outstanding,
	invoiced,
	recouped,
}

export default interface Expense {
	categoryId: number
	markupPercent?: number
	projectId?: number
	clientId?: number
	taxPercent1?: Nullable<string>
	taxName2?: Nullable<string>
	taxName1?: Nullable<string>
	isDuplicate?: boolean
	profileId?: Nullable<number>
	taxPercent2?: Nullable<string>
	accountName?: string
	transactionId?: Nullable<number>
	invoiceId?: Nullable<number>
	id?: number
	taxAmount2?: Nullable<Money>
	taxAmount1?: Nullable<Money>
	visState?: VisState
	status?: ExpenseStatus
	bankName?: string
	updated?: Date
	vendor?: Nullable<string>
	extSystemId?: number
	staffId: number
	date: Date
	hasReceipt?: boolean
	accountingSystemId?: string
	notes?: string
	extInvoiceId?: number
	amount: Money
	expenseId?: number
	compoundedTax?: boolean
	accountId?: Nullable<number>
	category?: ExpenseCategory
}

export function transformExpenseResponse(data: string): Expense | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { expense } = response.response.result

	return transformExpenseParsedResponse(expense)
}

export function transformExpenseListResponse(data: string): { expenses: Expense[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { expenses, per_page, total, page, pages } = response.response.result

	return {
		expenses: expenses.map((expense: any) => transformExpenseParsedResponse(expense)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

function transformExpenseParsedResponse(expense: any): Expense {
	return {
		categoryId: transformIdResponse(expense.categoryid),
		markupPercent: Number(expense.markup_percent),
		projectId: transformIdResponse(expense.projectid),
		clientId: transformIdResponse(expense.clientid),
		taxPercent1: expense.taxPercent1,
		taxName2: expense.taxName2,
		taxName1: expense.taxName1,
		isDuplicate: expense.isduplicate,
		profileId: transformIdResponse(expense.profileid),
		taxPercent2: expense.taxPercent2,
		accountName: expense.account_name,
		transactionId: transformIdResponse(expense.transactionid),
		invoiceId: transformIdResponse(expense.invoiceid),
		id: transformIdResponse(expense.id),
		taxAmount2: expense.taxAmount2 && transformMoneyParsedResponse(expense.taxAmount2),
		taxAmount1: expense.taxAmount1 && transformMoneyParsedResponse(expense.taxAmount1),
		visState: expense.vis_state,
		status: expense.status,
		bankName: expense.bank_name,
		updated: transformDateResponse(expense.updated, DateFormat['YYYY-MM-DD hh:mm:ss']),
		vendor: expense.vendor,
		extSystemId: transformIdResponse(expense.ext_systemid),
		staffId: transformIdResponse(expense.staffid),
		date: transformDateResponse(expense.date, DateFormat['YYYY-MM-DD']),
		hasReceipt: expense.has_receipt,
		accountingSystemId: transformIdResponse(expense.accounting_systemid),
		notes: expense.notes,
		extInvoiceId: transformIdResponse(expense.ext_invoiceid),
		amount: transformMoneyParsedResponse(expense.amount),
		expenseId: transformIdResponse(expense.expenseid),
		compoundedTax: expense.compounded_tax,
		accountId: transformIdResponse(expense.accountid),
		category: expense.category && transformExpenseCategoryParsedResponse(expense.category),
	}
}

export function transformExpenseRequest(expense: Expense): string {
	return JSON.stringify({
		expense: {
			categoryid: expense.categoryId,
			markup_percent: expense.markupPercent,
			projectid: expense.projectId,
			clientid: expense.clientId,
			taxPercent1: expense.taxPercent1,
			taxName2: expense.taxName2,
			taxName1: expense.taxName1,
			isduplicate: expense.isDuplicate,
			profileid: expense.profileId,
			taxPercent2: expense.taxPercent2,
			account_name: expense.accountName,
			transactionid: expense.transactionId,
			invoiceid: expense.invoiceId,
			id: expense.id,
			taxAmount2: expense.taxAmount2 && transformMoneyRequest(expense.taxAmount2),
			taxAmount1: expense.taxAmount1 && transformMoneyRequest(expense.taxAmount1),
			vis_state: expense.visState,
			status: expense.status,
			bank_name: expense.bankName,
			vendor: expense.vendor,
			ext_systemid: expense.extSystemId,
			staffid: expense.staffId,
			date: transformDateRequest(expense.date),
			has_receipt: expense.hasReceipt,
			notes: expense.notes,
			ext_invoiceid: expense.extInvoiceId,
			amount: expense.amount && transformMoneyRequest(expense.amount),
			expenseid: expense.expenseId,
			compounded_tax: expense.compoundedTax,
			accountid: expense.accountId,
		},
	})
}
