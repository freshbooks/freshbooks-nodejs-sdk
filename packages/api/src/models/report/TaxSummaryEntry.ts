/* eslint-disable @typescript-eslint/camelcase */
import Money, { MoneyResponse, transformMoneyResponse } from '../Money'

export default interface TaxSummaryEntry {
	taxName: string
	netTax: Money
	netTaxableAmount: Money
	taxCollected: Money
	taxPaid: Money
	taxableAmountCollected: Money
	taxableAmountPaid: Money
}

export interface TaxSummaryEntryResponse {
	tax_name: string
	net_tax: MoneyResponse
	net_taxable_amount: MoneyResponse
	tax_collected: MoneyResponse
	tax_paid: MoneyResponse
	taxable_amount_collected: MoneyResponse
	taxable_amount_paid: MoneyResponse
}

export function transformTaxSummaryEntryRespone(response: TaxSummaryEntryResponse): TaxSummaryEntry {
	return {
		taxName: response.tax_name,
		netTax: response.net_tax && transformMoneyResponse(response.net_tax),
		netTaxableAmount: response.net_taxable_amount && transformMoneyResponse(response.net_taxable_amount),
		taxCollected: response.tax_collected && transformMoneyResponse(response.tax_collected),
		taxPaid: response.tax_paid && transformMoneyResponse(response.tax_paid),
		taxableAmountCollected:
			response.taxable_amount_collected && transformMoneyResponse(response.taxable_amount_collected),
		taxableAmountPaid: response.taxable_amount_paid && transformMoneyResponse(response.taxable_amount_paid),
	}
}

export function transformTaxSummaryEntryResponeList(data: TaxSummaryEntryResponse[]): TaxSummaryEntry[] {
	if (data && data.length > 0) {
		return data.map((child: TaxSummaryEntryResponse) => transformTaxSummaryEntryRespone(child))
	} else {
		return []
	}
}
