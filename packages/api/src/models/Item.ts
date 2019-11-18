/* eslint-disable @typescript-eslint/camelcase */
import Money from './Money'
import Error from './Error'
import { Nullable } from './helpers'
import { transformMoneyResponse } from './Money'

enum VisState {
	active,
	deleted,
}

export default interface Item {
	id: string
	accountingSystemId: string
	updated: Date
	name: string
	description?: Nullable<string>
	qty: number
	sku?: Nullable<string>
	inventory?: Nullable<number>
	unitCost: Money
	tax1: string
	tax2: string
	visState: VisState
}

export function transformItemResponse(data: string): Item | Error {
	const {
		response: {
			result: { item },
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

	const {
		id,
		accounting_systemid: accountingSystemId,
		updated,
		name,
		description,
		qty,
		sku,
		inventory,
		unit_cost: unitCost,
		tax1,
		tax2,
		vis_state: visState,
	} = item
	return {
		id: id.toString(),
		accountingSystemId,
		updated: new Date(updated),
		name,
		description,
		qty: Number(qty),
		sku,
		inventory: !inventory ? null : Number(inventory),
		unitCost: transformMoneyResponse(unitCost),
		tax1: tax1.toString(),
		tax2: tax2.toString(),
		visState,
	}
}
