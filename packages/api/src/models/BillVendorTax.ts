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

export function transformBillVendorTaxParsedResponse(billVendorTax: any): BillVendorTax {
	return {
		vendorId: billVendorTax.vendorid,
		taxId: billVendorTax.tax_id,
		systemTaxid: billVendorTax.system_taxid,
		enabled: billVendorTax.enabled,
		name: billVendorTax.name,
		amount: billVendorTax.amount,
		taxAuthorityid: billVendorTax.tax_authorityid,
		createdAt: billVendorTax.created_at && transformDateResponse(billVendorTax.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		updatedAt: billVendorTax.updated_at && transformDateResponse(billVendorTax.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
	}
}

export function transformBillVendorTaxRequest(billVendorTax: BillVendorTax): any {
	return {
		vendorid: billVendorTax.vendorId,
		tax_id: billVendorTax.taxId,
		system_taxid: billVendorTax.systemTaxid,
		enabled: billVendorTax.enabled,
		tax_authorityid: billVendorTax.taxAuthorityid,
	}
}
