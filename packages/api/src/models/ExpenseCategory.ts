import { transformDateResponse, DateFormat } from './Date'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import VisState from './VisState'

/* eslint-disable @typescript-eslint/camelcase */
export default interface ExpenseCategory {
	category: string
	categoryId: number
	createdAt: Date
	id: number
	isCogs: boolean
	isEditable: boolean
	parentId: number
	updatedAt: Date
	visState: VisState
}

export function transformExpenseCategoryData({
	category,
	categoryid: categoryId,
	created_at: createdAt,
	id,
	is_cogs: isCogs,
	is_editable: isEditable,
	parentid: parentId,
	updated_at: updatedAt,
	vis_state: visState,
}: any): ExpenseCategory {
	return {
		category,
		categoryId: categoryId,
		createdAt: transformDateResponse(createdAt, DateFormat['YYYY-MM-DD hh:mm:ss']),
		id: id,
		isCogs,
		isEditable,
		parentId: parentId,
		updatedAt: transformDateResponse(updatedAt, DateFormat['YYYY-MM-DD hh:mm:ss']),
		visState,
	}
}

export function transformExpenseCategoryResponse(data: string): ExpenseCategory | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: {
			result: { category },
		},
	} = response

	return transformExpenseCategoryData(category)
}
