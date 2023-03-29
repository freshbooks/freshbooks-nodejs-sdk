/* eslint-disable @typescript-eslint/camelcase */
import { transformDateResponse, DateFormat } from './Date'
import { ErrorResponse, isAccountingErrorResponse, transformAccountingErrorResponse } from './Error'
import Pagination from './Pagination'
import VisState from './VisState'

export default interface ExpenseCategory {
	category: string
	categoryId: number
	createdAt: Date
	id: number
	isCogs: boolean
	isEditable: boolean
	parentId: number
	transactionPosted: boolean
	updatedAt: Date
	visState: VisState
}

export function transformExpenseCategoryParsedResponse(category: any): ExpenseCategory {
	return {
		category: category.category,
		categoryId: category.categoryid,
		createdAt: category.created_at && transformDateResponse(category.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		id: category.id,
		isCogs: category.is_cogs,
		isEditable: category.is_editable,
		parentId: category.parentid,
		transactionPosted: category.transaction_posted,
		updatedAt: category.updated_at && transformDateResponse(category.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		visState: category.vis_state,
	}
}

export function transformExpenseCategoryResponse(
	data: string,
	headers: Array<string>,
	status: string
): ExpenseCategory | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformAccountingErrorResponse(response)
	}

	const { category } = response.response.result

	return transformExpenseCategoryParsedResponse(category)
}

export function transformExpenseCategoryListResponse(
	data: string,
	headers: Array<string>,
	status: string
): { categories: ExpenseCategory[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformAccountingErrorResponse(response)
	}

	const { categories, page, pages, per_page, total } = response.response.result

	return {
		categories: categories.map((category: any): ExpenseCategory => transformExpenseCategoryParsedResponse(category)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}
