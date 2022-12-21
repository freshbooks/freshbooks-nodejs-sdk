/* eslint-disable @typescript-eslint/camelcase */
import Money, { transformMoneyParsedRequest, transformMoneyParsedResponse } from './Money'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import { Nullable } from './helpers'
import Pagination from './Pagination'
import { isTemplateExpression } from 'typescript'

enum VisState {
	active,
	deleted,
}

export default interface Item {
	id: number
	accountingSystemId: string
	updated: Date
	name: string
	description?: Nullable<string>
	qty: string
	sku?: Nullable<string>
	inventory?: Nullable<string>
	unitCost: Money
	tax1: number
	tax2: number
	visState: VisState
}

export function transformItemResponse(data: string): Item | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { item } = response.response.result

	return transformItemParsedResponse(item)
}

export function transformItemListResponse(data: string): { items: Item[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { items, per_page, total, page, pages } = response.response.result

	return {
		items: items.map((item: any): Item => transformItemParsedResponse(item)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

function transformItemParsedResponse(item: any): Item {
	return {
		id: item.id.toString(),
		accountingSystemId: item.accounting_systemid,
		updated: new Date(item.updated),
		name: item.name,
		description: item.description,
		qty: item.qty,
		sku: item.sku,
		inventory: item.inventory,
		unitCost: transformMoneyParsedResponse(item.unit_cost),
		tax1: item.tax1.toString(),
		tax2: item.tax2.toString(),
		visState: item.vis_state,
	}
}

export function transformItemRequest(item: Item): string {
	return JSON.stringify({
		item: {
			name: item.name,
			description: item.description,
			qty: item.qty,
			sku: item.sku,
			inventory: item.inventory,
			unit_cost: item.unitCost && transformMoneyParsedRequest(item.unitCost),
			tax1: item.tax1,
			tax2: item.tax2,
			vis_state: item.visState,
		},
	})
}
