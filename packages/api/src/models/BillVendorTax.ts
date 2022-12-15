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

export function transformBillVendorTaxParsedResponse(tax: any): BillVendorTax {
	return {
		vendorId: tax.vendorid,
		taxId: tax.tax_id,
		systemTaxid: tax.system_taxid,
		enabled: tax.enabled,
		name: tax.name,
		amount: tax.amount,
		taxAuthorityid: tax.tax_authorityid,
		createdAt: tax.created_at && transformDateResponse(tax.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		updatedAt: tax.updated_at && transformDateResponse(tax.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
	}
}

export function transformBillVendorTaxRequest(tax: BillVendorTax): any {
	return {
		vendorid: tax.vendorId,
		tax_id: tax.taxId,
		system_taxid: tax.systemTaxid,
		enabled: tax.enabled,
		tax_authorityid: tax.taxAuthorityid,
	}
}
