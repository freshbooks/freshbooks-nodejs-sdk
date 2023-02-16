/* eslint-disable @typescript-eslint/camelcase */
import { isAccountingErrorResponse, transformAccountingErrorResponse, ErrorResponse } from './Error'
import Money, { MoneyResponse, transformMoneyParsedResponse } from './Money'
import { transformDateResponse, DateFormat } from './Date'
import VisState from './VisState'
import Pagination from './Pagination'
import BillVendorTax, {
	transformBillVendorTaxParsedRequest,
	transformBillVendorTaxParsedResponse,
} from './BillVendorTax'

export default interface BillVendors {
	accountNumber?: string
	city?: string
	country?: string
	currencyCode?: string
	is1099?: boolean
	language?: string
	note?: string
	outstandingBalance?: MoneyResponse[]
	overdueBalance?: MoneyResponse[]
	phone?: string
	postalCode?: string
	primaryContactEmail?: string
	primaryContactFirstName?: string
	primaryContactLastName?: string
	province?: string
	street?: string
	street2?: string
	taxDefaults?: BillVendorTax[]
	vendorId?: number
	visState?: VisState
	website?: string
	vendorName?: string
	createdAt?: Date
	updatedAt?: Date
}

export function transformBillVendorsResponse(
	data: string,
	headers: Array<string>,
	status: string
): BillVendors | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformAccountingErrorResponse(response)
	}

	const { bill_vendor } = response.response.result

	return transformBillVendorsParsedResponse(bill_vendor)
}

export function transformBillVendorsListResponse(
	data: string,
	headers: Array<string>,
	status: string
): { bill_vendors: BillVendors[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformAccountingErrorResponse(response)
	}

	const { bill_vendors, per_page, total, page, pages } = response.response.result

	return {
		bill_vendors: bill_vendors.map((vendor: any): BillVendors => transformBillVendorsParsedResponse(vendor)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

export function transformBillVendorsParsedResponse(vendor: any): BillVendors {
	return {
		accountNumber: vendor.account_number,
		city: vendor.city,
		country: vendor.country,
		currencyCode: vendor.currency_code,
		is1099: vendor.is_1099,
		language: vendor.language,
		note: vendor.note,
		outstandingBalance:
			vendor.outstanding_balance &&
			vendor.outstanding_balance.map((balance: any): Money => transformMoneyParsedResponse(balance)),
		overdueBalance:
			vendor.overdue_balance &&
			vendor.overdue_balance.map((balance: any): Money => transformMoneyParsedResponse(balance)),
		phone: vendor.phone,
		postalCode: vendor.postal_code,
		primaryContactEmail: vendor.primary_contact_email,
		primaryContactFirstName: vendor.primary_contact_first_name,
		primaryContactLastName: vendor.primary_contact_last_name,
		province: vendor.province,
		street: vendor.street,
		street2: vendor.street2,
		taxDefaults:
			vendor.tax_defaults &&
			vendor.tax_defaults.map((tax: any): BillVendorTax => transformBillVendorTaxParsedResponse(tax)),
		vendorId: vendor.vendorid,
		visState: vendor.vis_state,
		website: vendor.website,
		vendorName: vendor.vendor_name,
		createdAt: vendor.created_at && transformDateResponse(vendor.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		updatedAt: vendor.updated_at && transformDateResponse(vendor.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
	}
}

export function transformBillVendorsRequest(vendor: BillVendors): string {
	return JSON.stringify({
		bill_vendor: {
			account_number: vendor.accountNumber,
			city: vendor.city,
			country: vendor.country,
			currency_code: vendor.currencyCode,
			is_1099: vendor.is1099,
			language: vendor.language,
			note: vendor.note,
			phone: vendor.phone,
			postal_code: vendor.postalCode,
			primary_contact_email: vendor.primaryContactEmail,
			primary_contact_first_name: vendor.primaryContactFirstName,
			primary_contact_last_name: vendor.primaryContactLastName,
			province: vendor.province,
			street: vendor.street,
			street2: vendor.street2,
			tax_defaults:
				vendor.taxDefaults &&
				vendor.taxDefaults.map((tax: BillVendorTax): any => transformBillVendorTaxParsedRequest(tax)),
			vendorid: vendor.vendorId,
			vis_state: vendor.visState,
			website: vendor.website,
			vendor_name: vendor.vendorName,
		},
	})
}
