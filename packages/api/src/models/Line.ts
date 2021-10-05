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
	taxName1?: string
	taxAmount1?: number
	taxName2?: string
	taxAmount2?: number
	taxNumber1?: Nullable<number>
	taxNumber2?: Nullable<number>
	type?: LineType
	unitCost?: Money
	updated?: Date
}

/**
 * Format a Line response object
 * @param line Account business object
 * eg:             
 * 	{
 * 		amount: 
 *		 	{
				amount: "3000.00",
				code: "USD"
			},
		compounded_tax: false,
		date: null,
		description: "",
		expenseid: 0,
		invoiceid: 225500,
		lineid: 2,
		modern_project_id: null,
		modern_time_entries: [],
		name: "TV Ads",
		qty: "1",
		retainer_id: null,
		retainer_period_id: null,
		taskno: 2,
		taxAmount1: "0",
		taxAmount2: "0",
		taxName1: "",
		taxName2: "",
		taxNumber1: null,
		taxNumber2: null,
		type: 0,
		unit_cost: {
			amount: "3000.00",
			code: "USD"
		},
		updated: "2019-11-25 15:43:26"
	}
 * @returns Money object
 */
export function transformLineResponse(line: any): Line {
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
