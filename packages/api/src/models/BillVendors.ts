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

export function transformBillVendorsData({
	account_number: accountNumber,
	city,
	country,
	currency_code: currencyCode,
	is_1099: is1099,
	language,
	note,
	outstanding_balance: outstandingBalance,
	overdue_balance: overdueBalance,
	phone,
	postal_code: postalCode,
	primary_contact_email: primaryContactEmail,
	primary_contact_first_name: primaryContactFirstName,
	primary_contact_last_name: primaryContactLastName,
	province,
	street,
	street2,
	tax_defaults: taxDefaults,
	vendorid: vendorId,
	vis_state: visState,
	website,
	vendor_name: vendorName,
	created_at: createdAt,
	updated_at: updatedAt,
}: any): BillVendors {
	return {
		accountNumber,
		city,
		country,
		currencyCode,
		is1099,
		language,
		note,
		outstandingBalance:
			outstandingBalance && outstandingBalance.map((balance: any): Money => transformMoneyResponse(balance)),
		overdueBalance: overdueBalance && overdueBalance.map((balance: any): Money => transformMoneyResponse(balance)),
		phone,
		postalCode,
		primaryContactEmail,
		primaryContactFirstName,
		primaryContactLastName,
		province,
		street,
		street2,
		taxDefaults:
			taxDefaults &&
			taxDefaults.map((billVendorTax: any): BillVendorTax => transformBillVendorTaxResponse(billVendorTax)),
		vendorId,
		visState,
		website,
		vendorName,
		createdAt: createdAt && transformDateResponse(createdAt, DateFormat['YYYY-MM-DD hh:mm:ss']),
		updatedAt: updatedAt && transformDateResponse(updatedAt, DateFormat['YYYY-MM-DD hh:mm:ss']),
	}
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
