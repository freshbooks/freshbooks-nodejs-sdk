import VisState from './VisState'
import { transformIdResponse } from './helpers'
import { transformDateResponse, DateFormat } from './Date'

/* eslint-disable @typescript-eslint/camelcase */
export default interface Category {
	category: string
	categoryId: string
	createdAt: Date
	id: string
	isCogs: boolean
	isEditable: boolean
	parentId: string
	updatedAt: Date
	visState: VisState
}

/**
 * Format an Category response object
 * @param data Category response object
 * eg: {
 *      "category": "Accident Insurance",
 *      "categoryid": 3012676,
 *      "created_at": "2019-06-05 11:42:54",
 *      "id": 3012676,
 *      "is_cogs": false,
 *      "is_editable": false,
 *      "parentid": 3012670,
 *      "updated_at": "2019-06-05 11:42:54",
 *      "vis_state": 0
 *    }
 * @returns Category object
 */
export function transformCategoryResponse({
	category,
	categoryid: categoryId,
	created_at: createdAt,
	id,
	is_cogs: isCogs,
	is_editable: isEditable,
	parentid: parentId,
	updated_at: updatedAt,
	vis_state: visState,
}: any): Category {
	return {
		category,
		categoryId: transformIdResponse(categoryId),
		createdAt: transformDateResponse(createdAt, DateFormat['YYYY-MM-DD hh:mm:ss']),
		id: transformIdResponse(id),
		isCogs,
		isEditable,
		parentId: transformIdResponse(parentId),
		updatedAt: transformDateResponse(updatedAt, DateFormat['YYYY-MM-DD hh:mm:ss']),
		visState,
	}
}

/**
 * Format an Category response JSON object
 * @param data Category response JSON object
 * eg: `{
 *      "category": "Accident Insurance",
 *      "categoryid": 3012676,
 *      "created_at": "2019-06-05 11:42:54",
 *      "id": 3012676,
 *      "is_cogs": false,
 *      "is_editable": false,
 *      "parentid": 3012670,
 *      "updated_at": "2019-06-05 11:42:54",
 *      "vis_state": 0
 *    }`
 * @returns Category object
 */
export function transformCategoryJSON(data: string): Category {
	const category = JSON.parse(data)
	return transformCategoryResponse(category)
}
