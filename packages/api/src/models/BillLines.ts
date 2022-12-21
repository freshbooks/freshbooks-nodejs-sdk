/* eslint-disable @typescript-eslint/camelcase */
import Money, { transformMoneyRequest, transformMoneyParsedResponse } from './Money'

export default interface BillLines {
	categoryId?: number
	category?: string
	listIndex?: number
	description?: string
	quantity?: number
	unitCost?: Money
	amount?: Money
	totalAmount?: Money
	taxName1?: string
	taxName2?: string
	taxPercent1?: number
	taxPercent2?: number
	taxAuthorityId1?: string
	taxAuthorityId2?: string
	taxAmount1?: Money
	taxAmount2?: Money
}

export function transformBillLinesParsedResponse(line: any): BillLines {
	return {
		categoryId: line.categoryid,
		category: line.category,
		listIndex: line.list_index,
		description: line.description,
		quantity: line.quantity,
		unitCost: line.unit_cost && transformMoneyParsedResponse(line.unit_cost),
		amount: line.amount && transformMoneyParsedResponse(line.amount),
		totalAmount: line.total_amount && transformMoneyParsedResponse(line.total_amount),
		taxName1: line.tax_name1,
		taxName2: line.tax_name2,
		taxPercent1: line.tax_percent1,
		taxPercent2: line.tax_percent2,
		taxAuthorityId1: line.tax_authorityid1,
		taxAuthorityId2: line.tax_authorityid2,
		taxAmount1: line.tax_amount1 && transformMoneyParsedResponse(line.tax_amount1),
		taxAmount2: line.tax_amount2 && transformMoneyParsedResponse(line.tax_amount2),
	}
}

export function transformBillLinesParsedRequest(line: BillLines): any {
	return {
		categoryid: line.categoryId,
		description: line.description,
		quantity: line.quantity,
		unit_cost: line.unitCost && transformMoneyRequest(line.unitCost),
		tax_name1: line.taxName1,
		tax_name2: line.taxName2,
		tax_percent1: line.taxPercent1,
		tax_percent2: line.taxPercent2,
		tax_authorityid1: line.taxAuthorityId1,
		tax_authorityid2: line.taxAuthorityId2,
	}
}
