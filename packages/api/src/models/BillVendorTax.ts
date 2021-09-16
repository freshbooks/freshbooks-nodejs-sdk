import { DateFormat, transformDateResponse } from './Date'
import { isAccountingErrorResponse, transformErrorResponse, ErrorResponse } from './Error'
import Money, { transformMoneyRequest } from './Money'
import Pagination from './Pagination'

export default interface BillVendorTax {
	vendorId?: number
	taxId?: number
	systemTaxid?: number
	enabled?: boolean
	name?: string
	amount?: string
	taxAuthorityid?: string
	createdAt?: Date
	updatedAt?: Date
}

export function transformBillVendorTaxResponse(billVendorTax: any): BillVendorTax {
	return {
		vendorId: billVendorTax.vendor_id,
		taxId: billVendorTax.tax_id,
		systemTaxid: billVendorTax.system_taxid,
		enabled: billVendorTax.enabled,
		name: billVendorTax.name,
		amount: billVendorTax.amount,
		taxAuthorityid: billVendorTax.tax_authorityid,
		createdAt: transformDateResponse(billVendorTax.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		updatedAt: transformDateResponse(billVendorTax.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
	}
}

export function transformBillVendorTaxRequest({
	vendorId,
	taxId,
	systemTaxid,
	enabled,
	taxAuthorityid,
}: BillVendorTax): any {
	return {
		vendor_id: vendorId,
		tax_id: taxId,
		system_taxid: systemTaxid,
		enabled,
		tax_authorityid: taxAuthorityid,
	}
}

export function transformBillVendorTaxJSON(json: string): BillVendorTax {
	const response: BillVendorTax = JSON.parse(json)
	return transformBillVendorTaxResponse(response)
}
