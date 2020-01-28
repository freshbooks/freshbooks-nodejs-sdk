/* eslint-disable @typescript-eslint/camelcase */
import Pagination from './Pagination'
import { transformErrorResponse, isErrorResponse, ErrorResponse } from './Error'
import Money, { transformMoneyResponse } from './Money'
import { Nullable } from './helpers'
import VisState from './VisState'
import Line, { transformLineRequest, transformLineResponse } from './Line'
import { transformDateResponse, DateFormat, transformDateRequest } from './Date'
import Owner, { transformOwnerResponse } from './Owner'

enum AutoBillStatus {
	retry = 'retry',
	failed = 'failed',
	success = 'success',
}
enum DisplayStatus {
	draft = 'draft',
	created = 'created',
	sent = 'sent',
	viewed = 'viewed',
	outstanding = 'outstanding',
}
enum PaymentStatus {
	unpaid = 'unpaid',
	partial = 'partial',
	paid = 'paid',
	autoPaid = 'auto-paid',
}
enum InvoiceStatus {
	disputed = 'disputed',
	draft = 'draft',
	sent = 'sent',
	viewed = 'viewed',
	paid = 'paid',
	autoPaid = 'auto-paid',
	retry = 'retry',
	failed = 'failed',
	partial = 'partial',
}
enum DepositStatus {
	paid = 'paid',
	unpaid = 'unpaid',
	partial = 'partial',
	none = 'none',
	converted = 'converted',
}
enum InvoiceV3Status {
	created = 'created',
	draft = 'draft',
	sent = 'sent',
	viewed = 'viewed',
	failed = 'failed',
	retry = 'retry',
	success = 'success',
	autopaid = 'autopaid',
	paid = 'paid',
	partial = 'partial',
	disputed = 'disputed',
	resolved = 'resolved',
	overdue = 'overdue',
	declined = 'declined',
	pending = 'pending',
	depositPartial = 'deposit-partial',
	depositPaid = 'deposit-paid',
}

export default interface Invoice {
	id?: string
	accountId?: string
	accountingSystemId?: string
	address?: string
	amount?: Money
	autoBill?: boolean
	autobillStatus?: Nullable<AutoBillStatus>
	basecampId?: string
	city?: string
	code?: string
	country?: string
	createDate: Date
	createdAt?: Date
	currencyCode?: string
	currentOrganization?: string
	customerId: string
	datePaid?: Nullable<Date>
	depositAmount?: Nullable<number>
	depositPercentage?: Nullable<string>
	depositStatus?: DepositStatus
	description?: string
	discountDescription?: Nullable<string>
	discountTotal?: Money
	discountValue?: number
	displayStatus?: DisplayStatus
	disputeStatus?: Nullable<string>
	dueDate?: Date
	dueOffsetDays?: number
	estimateId?: string
	extArchive?: string
	fName?: string
	fulfillmentDate?: Nullable<Date>
	generationDate?: Nullable<Date>
	gmail?: boolean
	invoiceNumber?: string
	invoiceId?: string
	language?: string
	lastOrderStatus?: Nullable<string>
	lines?: Line[]
	lName?: string
	notes?: string
	organization?: string
	outstanding?: Money
	owner?: Owner
	ownerId?: string
	paid?: Money
	parent?: string
	paymentDetails?: string
	paymentStatus?: PaymentStatus
	poNumber?: Nullable<string>
	province?: string
	returnUri?: Nullable<string>
	sentId?: string
	showAttachments?: boolean
	status?: InvoiceStatus
	street?: string
	street2?: string
	template?: string
	terms?: Nullable<string>
	updated?: Nullable<Date>
	v3Status?: InvoiceV3Status
	vatName?: string
	vatNumber?: string
	visState?: VisState
}

function transformInvoiceData({
	accountid: accountId,
	accounting_systemid: accountingSystemId,
	address,
	amount,
	auto_bill: autoBill,
	autobill_status: autobillStatus,
	basecampid: basecampId,
	city,
	code,
	country,
	create_date: createDate,
	created_at: createdAt,
	currency_code: currencyCode,
	current_organization: currentOrganization,
	customerid: customerId,
	date_paid: datePaid,
	deposit_amount: depositAmount,
	deposit_percentage: depositPercentage,
	deposit_status: depositStatus,
	description,
	discount_description: discountDescription,
	discount_total: discountTotal,
	discount_value: discountValue,
	display_status: displayStatus,
	dispute_status: disputeStatus,
	due_date: dueDate,
	due_offset_days: dueOffsetDays,
	estimateid: estimateId,
	ext_archive: extArchive,
	fname: fName,
	fulfillment_date: fulfillmentDate,
	generation_date: generationDate,
	gmail,
	id,
	invoice_number: invoiceNumber,
	invoiceid: invoiceId,
	language,
	last_order_status: lastOrderStatus,
	lines,
	lname: lName,
	notes,
	organization,
	outstanding,
	owner,
	ownerid: ownerId,
	paid,
	parent,
	payment_details: paymentDetails,
	payment_status: paymentStatus,
	po_number: poNumber,
	province,
	return_uri: returnUri,
	sentid: sentId,
	show_attachments: showAttachments,
	status,
	street,
	street2,
	template,
	terms,
	updated,
	v3_status: v3Status,
	vat_name: vatName,
	vat_number: vatNumber,
	vis_state: visState,
}: any): Invoice {
	return {
		id,
		accountId,
		accountingSystemId,
		address,
		amount: transformMoneyResponse(amount),
		autoBill,
		autobillStatus,
		basecampId,
		city,
		code,
		country,
		createDate: transformDateResponse(createDate, DateFormat['YYYY-MM-DD']),
		createdAt: transformDateResponse(
			createdAt,
			DateFormat['YYYY-MM-DD hh:mm:ss']
		),
		currencyCode,
		currentOrganization,
		customerId,
		datePaid,
		depositAmount,
		depositPercentage,
		depositStatus,
		description,
		discountDescription,
		discountTotal: transformMoneyResponse(discountTotal),
		discountValue,
		displayStatus,
		disputeStatus,
		dueDate: transformDateResponse(dueDate, DateFormat['YYYY-MM-DD']),
		dueOffsetDays,
		estimateId,
		extArchive,
		fName,
		fulfillmentDate,
		generationDate,
		gmail,
		invoiceNumber,
		invoiceId,
		language,
		lastOrderStatus,
		lines: lines && lines.map((line: any): Line => transformLineResponse(line)),
		lName,
		notes,
		organization,
		outstanding: transformMoneyResponse(outstanding),
		owner: owner && transformOwnerResponse(owner),
		ownerId,
		paid: transformMoneyResponse(paid),
		parent,
		paymentDetails,
		paymentStatus,
		poNumber,
		province,
		returnUri,
		sentId,
		showAttachments,
		status,
		street,
		street2,
		template,
		terms,
		updated: transformDateResponse(updated, DateFormat['YYYY-MM-DD hh:mm:ss']),
		v3Status,
		vatName,
		vatNumber,
		visState,
	}
}

export function transformListInvoicesResponse(
	data: string
): { invoices: Invoice[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { invoices, per_page, total, page, pages } = response.response.result
	return {
		invoices: invoices.map((invoice: any) => transformInvoiceData(invoice)),
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
	}
}

export function transformInvoiceResponse(
	data: string
): Invoice | ErrorResponse {
	const response = JSON.parse(data)

	if (isErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: { result },
	} = response
	const { invoice } = result
	return transformInvoiceData(invoice)
}

export function transformInvoiceRequest(invoice: Invoice): string {
	const request = JSON.stringify({
		invoice: {
			address: invoice.address,
			auto_bill: invoice.autoBill,
			basecampid: invoice.basecampId,
			city: invoice.city,
			code: invoice.code,
			country: invoice.country,
			currency_code: invoice.currencyCode,
			customerid: invoice.customerId,
			create_date: transformDateRequest(invoice.createDate),
			deposit_amount: invoice.depositAmount,
			deposit_percentage: invoice.depositPercentage,
			discount_description: invoice.discountDescription,
			discount_value: invoice.discountValue,
			due_offset_days: invoice.dueOffsetDays,
			estimateid: invoice.estimateId,
			ext_archive: invoice.extArchive,
			fname: invoice.fName,
			fulfillment_date: invoice.fulfillmentDate,
			generation_date: invoice.generationDate,
			invoice_number: invoice.invoiceNumber,
			language: invoice.language,
			last_order_status: invoice.lastOrderStatus,
			lines:
				invoice.lines && invoice.lines.map(line => transformLineRequest(line)),
			lname: invoice.lName,
			notes: invoice.notes,
			organization: invoice.organization,
			parent: invoice.parent,
			payment_details: invoice.paymentDetails,
			po_number: invoice.poNumber,
			province: invoice.province,
			return_uri: invoice.returnUri,
			show_attachments: invoice.showAttachments,
			status: invoice.status,
			street: invoice.street,
			street2: invoice.street2,
			template: invoice.template,
			terms: invoice.terms,
			vat_name: invoice.vatName,
			vat_number: invoice.vatNumber,
			vis_state: invoice.visState,
		},
	})
	return request
}
