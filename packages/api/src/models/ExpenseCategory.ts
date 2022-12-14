/* eslint-disable @typescript-eslint/camelcase */
import { transformDateResponse, DateFormat } from './Date'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
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

export function transformExpenseCategoryData(category: any): ExpenseCategory {
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

export function transformExpenseCategoryResponse(data: string): ExpenseCategory | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { category } = response.response.result

	return transformExpenseCategoryData(category)
}

export function transformExpenseCategoryListResponse(data: string): { categories: ExpenseCategory[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: {
			result: { categories, page, pages, per_page, total },
		},
	} = response

	return {
		categories: categories.map((category: any) => transformExpenseCategoryData(category)),
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
	}
}
