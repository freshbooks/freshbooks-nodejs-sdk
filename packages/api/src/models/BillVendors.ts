/* eslint-disable @typescript-eslint/camelcase */
import { isAccountingErrorResponse, transformErrorResponse, ErrorResponse } from './Error'
import Money, { MoneyResponse, transformMoneyResponse } from './Money'
import { transformDateResponse, DateFormat } from './Date'
import VisState from './VisState'
import Pagination from './Pagination'
import BillVendorTax, { transformBillVendorTaxRequest, transformBillVendorTaxResponse } from './BillVendorTax'

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

export function transformBillVendorsResponse(data: string): BillVendors | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { bill_vendor } = response.response.result
	
	return transformBillVendorsData(bill_vendor)
}

export function transformBillVendorsListResponse(data: string): { bill_vendors: BillVendors[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { bill_vendors, per_page, total, page, pages } = response.response.result

	return {
		bill_vendors: bill_vendors.map((vendor: any) => transformBillVendorsData(vendor)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

export function transformBillVendorsData(billVendor: any): BillVendors {
	return {
		accountNumber: billVendor.account_number,
		city: billVendor.city,
		country: billVendor.country,
		currencyCode: billVendor.currency_code,
		is1099: billVendor.is_1099,
		language: billVendor.language,
		note: billVendor.note,
		outstandingBalance: 
			billVendor.outstanding_balance && 
			billVendor.outstanding_balance.map((balance: any): Money => transformMoneyResponse(balance)),
		overdueBalance: 
			billVendor.overdue_balance && 
			billVendor.overdue_balance.map((balance: any): Money => transformMoneyResponse(balance)),
		phone: billVendor.phone,
		postalCode: billVendor.postal_code,
		primaryContactEmail: billVendor.primary_contact_email,
		primaryContactFirstName: billVendor.primary_contact_first_name,
		primaryContactLastName: billVendor.primary_contact_last_name,
		province: billVendor.province,
		street: billVendor.street,
		street2: billVendor.street2,
		taxDefaults: 
			billVendor.tax_defaults && 
			billVendor.tax_defaults.map((billVendorTax: any): BillVendorTax => transformBillVendorTaxResponse(billVendorTax)),
		vendorId: billVendor.vendorid,
		visState: billVendor.vis_state,
		website: billVendor.website,
		vendorName: billVendor.vendor_name,
		createdAt: billVendor.created_at && transformDateResponse(billVendor.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		updatedAt: billVendor.updated_at && transformDateResponse(billVendor.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
	}
}

export function transformBillVendorsRequest(vendor: BillVendors): string {
	const request = JSON.stringify({
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
				vendor.taxDefaults.map((billVendorTax: any): BillVendorTax => transformBillVendorTaxRequest(billVendorTax)),
			vendorid: vendor.vendorId,
			vis_state: vendor.visState,
			website: vendor.website,
			vendor_name: vendor.vendorName,
		},
	})
	return request
}
