/* eslint-disable @typescript-eslint/camelcase */
import Money, { transformMoneyResponse, transformMoneyRequest } from './Money'
import Error from './Error'
import { Nullable, transformIdResponse } from './helpers'
import Pagination from './Pagination'
import VisState from './VisState'
import { transformDateResponse, DateFormat, transformDateRequest } from './Date'
import Category, { transformCategoryResponse } from './Category'

export enum ExpenseStatus {
	internal,
	outstanding,
	invoiced,
	recouped,
}

export default interface Expense {
	categoryId: string
	markupPercent?: number
	projectId?: string
	clientId?: string
	taxPercent1?: Nullable<number>
	taxName2?: Nullable<string>
	taxName1?: Nullable<string>
	isDuplicate?: boolean
	profileId?: Nullable<string>
	taxPercent2?: Nullable<number>
	accountName?: string
	transactionId?: Nullable<string>
	invoiceId?: Nullable<string>
	id?: string
	taxAmount2?: Nullable<Money>
	taxAmount1?: Nullable<Money>
	visState?: VisState
	status?: ExpenseStatus
	bankName?: string
	updated?: Date
	vendor?: Nullable<string>
	extSystemId?: string
	staffId: string
	date: Date
	hasReceipt?: boolean
	accountingSystemId?: string
	backgroundJobId?: Nullable<string>
	notes?: string
	extInvoiceId?: string
	amount: Money
	expenseId?: string
	compoundedTax?: boolean
	accountId?: Nullable<string>
	category?: Category
}

function transformExpenseData({
	categoryid: categoryId,
	markup_percent: markupPercent,
	projectid: projectId,
	clientid: clientId,
	taxPercent1,
	taxName2,
	taxName1,
	isduplicate: isDuplicate,
	profileid: profileId,
	taxPercent2,
	account_name: accountName,
	transactionid: transactionId,
	invoiceid: invoiceId,
	id,
	taxAmount2,
	taxAmount1,
	vis_state: visState,
	status,
	bank_name: bankName,
	updated,
	vendor,
	ext_systemid: extSystemId,
	staffid: staffId,
	date,
	has_receipt: hasReceipt,
	accounting_systemid: accountingSystemId,
	background_jobid: backgroundJobId,
	notes,
	ext_invoiceid: extInvoiceId,
	amount,
	expenseid: expenseId,
	compounded_tax: compoundedTax,
	accountid: accountId,
	category,
}: any): Expense {
	return {
		categoryId: transformIdResponse(categoryId),
		markupPercent: Number(markupPercent),
		projectId: transformIdResponse(projectId),
		clientId: transformIdResponse(clientId),
		taxPercent1: Number(taxPercent1),
		taxName2,
		taxName1,
		isDuplicate,
		profileId: transformIdResponse(profileId),
		taxPercent2: Number(taxPercent2),
		accountName,
		transactionId: transformIdResponse(transactionId),
		invoiceId: transformIdResponse(invoiceId),
		id: transformIdResponse(id),
		taxAmount2: taxAmount2 && transformMoneyResponse(taxAmount2),
		taxAmount1: taxAmount1 && transformMoneyResponse(taxAmount1),
		visState,
		status,
		bankName,
		updated: transformDateResponse(updated, DateFormat['YYYY-MM-DD hh:mm:ss']),
		vendor,
		extSystemId: transformIdResponse(extSystemId),
		staffId: transformIdResponse(staffId),
		date: transformDateResponse(date, DateFormat['YYYY-MM-DD']),
		hasReceipt,
		accountingSystemId: transformIdResponse(accountingSystemId),
		backgroundJobId: transformIdResponse(backgroundJobId),
		notes,
		extInvoiceId: transformIdResponse(extInvoiceId),
		amount: transformMoneyResponse(amount),
		expenseId: transformIdResponse(expenseId),
		compoundedTax,
		accountId: transformIdResponse(accountId),
		category: category && transformCategoryResponse(category),
	}
}

export function transformExpenseResponse(data: string): Expense | Error {
	const {
		response: {
			result: { expense },
		},
		error,
		error_description,
	} = JSON.parse(data)

	if (error) {
		return {
			code: error,
			message: error_description,
		}
	}

	return transformExpenseData(expense)
}

export function transformExpenseListResponse(
	data: string
): { expenses: Expense[]; pages: Pagination } | Error {
	const {
		response: { errors, result },
	} = JSON.parse(data)

	if (errors) {
		return {
			code: errors[0].errno,
			message: errors[0].message,
		}
	}

	const { expenses, per_page, total, page, pages } = result

	return {
		expenses: expenses.map((expense: any) => transformExpenseData(expense)),
		pages: {
			size: per_page,
			total,
			page,
			pages,
		},
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
			taxAmount2:
				expense.taxAmount2 && transformMoneyRequest(expense.taxAmount2),
			taxAmount1:
				expense.taxAmount1 && transformMoneyRequest(expense.taxAmount1),
			vis_state: expense.visState,
			status: expense.status,
			bank_name: expense.bankName,
			vendor: expense.vendor,
			ext_systemid: expense.extSystemId,
			staffid: expense.staffId,
			date: transformDateRequest(expense.date),
			has_receipt: expense.hasReceipt,
			background_jobid: expense.backgroundJobId,
			notes: expense.notes,
			ext_invoiceid: expense.extInvoiceId,
			amount: expense.amount && transformMoneyRequest(expense.amount),
			expenseid: expense.expenseId,
			compounded_tax: expense.compoundedTax,
			accountid: expense.accountId,
		},
	})
}
