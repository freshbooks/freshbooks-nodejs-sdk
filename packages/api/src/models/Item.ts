/* eslint-disable @typescript-eslint/camelcase */
import Money, { transformMoneyResponse, transformMoneyRequest } from './Money'
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

	return transformItemData(item)
}

export function transformItemListResponse(data: string): { items: Item[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { items, per_page, total, page, pages } = response.response.result

	return {
		items: items.map((item: any) => transformItemData(item)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

function transformItemData(item: any): Item {
	return {
		id: item.id.toString(),
		accountingSystemId: item.accounting_systemid,
		updated: new Date(item.updated),
		name: item.name,
		description: item.description,
		qty: item.qty,
		sku: item.sku,
		inventory: item.inventory,
		unitCost: transformMoneyResponse(item.unit_cost),
		tax1: item.tax1.toString(),
		tax2: item.tax2.toString(),
		visState: item.vis_state,
	}
}

export function transformItemRequest({
	name,
	description,
	qty,
	sku,
	inventory,
	unitCost,
	tax1,
	tax2,
	visState,
}: Item): string {
	const result = JSON.stringify({
		item: {
			name,
			description,
			qty,
			sku,
			inventory,
			unit_cost: unitCost && transformMoneyRequest(unitCost),
			tax1,
			tax2,
			vis_state: visState,
		},
	})
	return result
}
