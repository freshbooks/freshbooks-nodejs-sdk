/* eslint-disable @typescript-eslint/camelcase */
import Money from './Money'
import { transformDateResponse, DateFormat } from './Date'
import { Nullable } from './helpers'

export enum LineType {
	normal,
	billing,
}

export default interface Line {
	amount?: Money
	compoundedTax?: boolean
	date?: Date
	description?: string
	expenseId?: number
	invoiceId?: string
	lineId?: string
	name?: string
	qty?: number
	retainerId?: string
	creditId?: string
	retainerPeriodId?: string
	taxName1?: Nullable<string>
	taxAmount1?: Nullable<number>
	taxName2?: Nullable<string>
	taxAmount2?: Nullable<number>
	taxNumber1?: Nullable<number>
	taxNumber2?: Nullable<number>
	type?: LineType
	unitCost?: Money
	updated?: Date
}

export function transformLineParsedResponse(line: any): Line {
	return {
		amount: line.amount,
		compoundedTax: line.compounded_tax,
		date: line.date && transformDateResponse(line.date, DateFormat['YYYY-MM-DD hh:mm:ss']),
		description: line.description,
		expenseId: line.expenseid,
		invoiceId: line.invoiceid,
		lineId: line.lineid,
		creditId: line.creditid,
		name: line.name,
		qty: line.qty,
		retainerId: line.retainer_id,
		retainerPeriodId: line.retainer_period_id,
		taxName1: line.taxName1,
		taxAmount1: line.taxAmount1,
		taxName2: line.taxName2,
		taxAmount2: line.taxAmount2,
		taxNumber1: line.taxNumber1,
		taxNumber2: line.taxNumber2,
		type: line.type,
		unitCost: line.unit_cost,
		updated: line.updated && transformDateResponse(line.updated, DateFormat['YYYY-MM-DD hh:mm:ss']),
	}
}

/**
 * Format a Line request object
 * @param data Account business object
 * eg: { "amount": "1234.00", "code": "USD" }
 * @returns Money object
 */
export function transformLineRequest({
	compoundedTax,
	description,
	expenseId,
	invoiceId,
	name,
	qty,
	taxName1,
	taxAmount1,
	taxName2,
	taxAmount2,
	type,
	unitCost,
}: Line): any {
	return {
		compounded_tax: compoundedTax,
		type,
		description,
		expenseid: expenseId,
		invoiceid: invoiceId,
		name,
		qty,
		taxName1,
		taxAmount1,
		taxName2,
		taxAmount2,
		unit_cost: unitCost,
	}
}
