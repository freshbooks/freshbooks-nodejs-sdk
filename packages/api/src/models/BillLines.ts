/* eslint-disable @typescript-eslint/camelcase */
import Money, { transformMoneyRequest, transformMoneyResponse } from './Money'

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

export function transformBillLinesResponse(billLine: any): BillLines {
	return {
		categoryId: billLine.categoryid,
		category: billLine.category,
		listIndex: billLine.list_index,
		description: billLine.description,
		quantity: billLine.quantity,
		unitCost: billLine.unit_cost && transformMoneyResponse(billLine.unit_cost),
		amount: billLine.amount && transformMoneyResponse(billLine.amount),
		totalAmount: billLine.total_amount && transformMoneyResponse(billLine.total_amount),
		taxName1: billLine.tax_name1,
		taxName2: billLine.tax_name2,
		taxPercent1: billLine.tax_percent1,
		taxPercent2: billLine.tax_percent2,
		taxAuthorityId1: billLine.tax_authorityid1,
		taxAuthorityId2: billLine.tax_authorityid2,
		taxAmount1: billLine.tax_amount1 && transformMoneyResponse(billLine.tax_amount1),
		taxAmount2: billLine.tax_amount2 && transformMoneyResponse(billLine.tax_amount2),
	}
}

export function transformBillLinesRequest(billLine: BillLines): any {
	return {
		categoryid: billLine.categoryId,
		category: billLine.category,
		list_index: billLine.listIndex,
		description: billLine.description,
		quantity: billLine.quantity,
		unit_cost: billLine.unitCost && transformMoneyRequest(billLine.unitCost),
		amount: billLine.amount && transformMoneyRequest(billLine.amount),
		total_amount: billLine.totalAmount && transformMoneyRequest(billLine.totalAmount),
		tax_name1: billLine.taxName1,
		tax_name2: billLine.taxName2,
		tax_percent1: billLine.taxPercent1,
		tax_percent2: billLine.taxPercent2,
		tax_authorityid1: billLine.taxAuthorityId1,
		tax_authorityid2: billLine.taxAuthorityId2,
		tax_amount1: billLine.taxAmount1 && transformMoneyRequest(billLine.taxAmount1),
		tax_amount2: billLine.taxAmount2 && transformMoneyRequest(billLine.taxAmount2),
	}
}
