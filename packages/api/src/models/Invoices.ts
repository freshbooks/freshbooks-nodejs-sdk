/* eslint-disable @typescript-eslint/camelcase */
import Pagination from './Pagination'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Money, { transformMoneyParsedResponse } from './Money'
import { Nullable } from './helpers'
import VisState from './VisState'
import Line, { transformLineParsedRequest, transformLineParsedResponse } from './Line'
import InvoiceCustomizedEmail, { transformInvoiceCustomizedEmailRequest } from './InvoiceCustomizedEmail'
import { transformDateResponse, DateFormat, transformDateRequest } from './Date'
import Owner, { transformOwnerParsedResponse } from './Owner'

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
	id?: number
	accountId?: string
	accountingSystemId?: string
	actionEmail?: Nullable<boolean>
	actionMarkAsSent?: Nullable<boolean>
	address?: string
	amount?: Money
	autoBill?: boolean
	autobillStatus?: Nullable<AutoBillStatus>
	city?: string
	code?: string
	country?: string
	createDate: Date
	createdAt?: Date
	currencyCode?: string
	currentOrganization?: string
	customerId: number
	datePaid?: Nullable<Date>
	depositAmount?: Nullable<Money>
	depositPercentage?: Nullable<string>
	depositStatus?: DepositStatus
	description?: string
	discountDescription?: Nullable<string>
	discountTotal?: Money
	discountValue?: string
	displayStatus?: DisplayStatus
	disputeStatus?: Nullable<string>
	dueDate?: Date
	dueOffsetDays?: number
	email?: string
	emailIncludePdf?: boolean
	emailRecipients?: string[]
	estimateId?: number
	extArchive?: number
	fName?: string
	fulfillmentDate?: Nullable<Date>
	generationDate?: Nullable<Date>
	gmail?: boolean
	invoiceCustomizedEmail?: InvoiceCustomizedEmail
	invoiceNumber?: string
	invoiceId?: number
	language?: string
	lastOrderStatus?: Nullable<string>
	lines?: Line[]
	lName?: string
	notes?: string
	organization?: string
	outstanding?: Money
	owner?: Owner
	ownerId?: number
	paid?: Money
	parent?: number
	paymentDetails?: string
	paymentStatus?: PaymentStatus
	poNumber?: Nullable<string>
	province?: string
	returnUri?: Nullable<string>
	sentId?: number
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

export function transformInvoiceResponse(
	data: string,
	headers: Array<string>,
	status: string
): Invoice | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformErrorResponse(response)
	}

	const { invoice } = response.response.result

	return transformInvoiceParsedResponse(invoice)
}

export function transformInvoiceListResponse(
	data: string,
	headers: Array<string>,
	status: string
): { invoices: Invoice[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformErrorResponse(response)
	}

	const { invoices, per_page, total, page, pages } = response.response.result

	return {
		invoices: invoices.map((invoice: any): Invoice => transformInvoiceParsedResponse(invoice)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

function transformInvoiceParsedResponse(invoice: any): Invoice {
	return {
		id: invoice.id,
		accountId: invoice.accountid,
		accountingSystemId: invoice.accounting_systemid,
		address: invoice.address,
		amount: invoice.amount && transformMoneyParsedResponse(invoice.amount),
		autoBill: invoice.auto_bill,
		autobillStatus: invoice.autobill_status,
		city: invoice.city,
		code: invoice.code,
		country: invoice.country,
		createDate: invoice.create_date && transformDateResponse(invoice.create_date, DateFormat['YYYY-MM-DD']),
		createdAt: invoice.created_at && transformDateResponse(invoice.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
		currencyCode: invoice.currency_code,
		currentOrganization: invoice.current_organization,
		customerId: invoice.customerid,
		datePaid: invoice.date_paid,
		depositAmount: invoice.deposit_amount,
		depositPercentage: invoice.deposit_percentage,
		depositStatus: invoice.deposit_status,
		description: invoice.description,
		discountDescription: invoice.discount_description,
		discountTotal: invoice.discount_total && transformMoneyParsedResponse(invoice.discount_total),
		discountValue: invoice.discount_value,
		displayStatus: invoice.display_status,
		disputeStatus: invoice.dispute_status,
		dueDate: invoice.due_date && transformDateResponse(invoice.due_date, DateFormat['YYYY-MM-DD']),
		dueOffsetDays: invoice.due_offset_days,
		email: invoice.email,
		estimateId: invoice.estimateid,
		extArchive: invoice.ext_archive,
		fName: invoice.fname,
		fulfillmentDate: invoice.fulfillment_date,
		generationDate: invoice.generation_date,
		gmail: invoice.gmail,
		invoiceNumber: invoice.invoice_number,
		invoiceId: invoice.invoiceid,
		language: invoice.language,
		lastOrderStatus: invoice.last_order_status,
		lines: invoice.lines && invoice.lines.map((line: any): Line => transformLineParsedResponse(line)),
		lName: invoice.lname,
		notes: invoice.notes,
		organization: invoice.organization,
		outstanding: invoice.outstanding && transformMoneyParsedResponse(invoice.outstanding),
		owner: invoice.owner && transformOwnerParsedResponse(invoice.owner),
		ownerId: invoice.ownerid,
		paid: invoice.paid && transformMoneyParsedResponse(invoice.paid),
		parent: invoice.parent,
		paymentDetails: invoice.payment_details,
		paymentStatus: invoice.payment_status,
		poNumber: invoice.po_number,
		province: invoice.province,
		returnUri: invoice.return_uri,
		sentId: invoice.sentid,
		showAttachments: invoice.show_attachments,
		status: invoice.status,
		street: invoice.street,
		street2: invoice.street2,
		template: invoice.template,
		terms: invoice.terms,
		updated: invoice.updated && transformDateResponse(invoice.updated, DateFormat['YYYY-MM-DD hh:mm:ss']),
		v3Status: invoice.v3_status,
		vatName: invoice.vat_name,
		vatNumber: invoice.vat_number,
		visState: invoice.vis_state,
	}
}

export function transformInvoiceRequest(invoice: Invoice): string {
	if (invoice.actionEmail === true) {
		const payload = JSON.stringify({
			invoice: {
				action_email: true,
				email_recipients: invoice.emailRecipients,
				email_include_pdf: invoice.emailIncludePdf,
				invoice_customized_email:
					invoice.invoiceCustomizedEmail && transformInvoiceCustomizedEmailRequest(invoice.invoiceCustomizedEmail),
			},
		})
		return payload
	}
	if (invoice.actionMarkAsSent === true) {
		return JSON.stringify({
			invoice: {
				action_mark_as_sent: true,
			},
		})
	}

	return JSON.stringify({
		invoice: {
			address: invoice.address,
			auto_bill: invoice.autoBill,
			city: invoice.city,
			code: invoice.code,
			country: invoice.country,
			currency_code: invoice.currencyCode,
			customerid: invoice.customerId,
			create_date: invoice.createDate && transformDateRequest(invoice.createDate),
			deposit_amount: invoice.depositAmount,
			deposit_percentage: invoice.depositPercentage,
			discount_description: invoice.discountDescription,
			discount_value: invoice.discountValue,
			due_offset_days: invoice.dueOffsetDays,
			email: invoice.email,
			estimateid: invoice.estimateId,
			ext_archive: invoice.extArchive,
			fname: invoice.fName,
			fulfillment_date: invoice.fulfillmentDate,
			generation_date: invoice.generationDate,
			invoice_number: invoice.invoiceNumber,
			language: invoice.language,
			last_order_status: invoice.lastOrderStatus,
			lines: invoice.lines && invoice.lines.map((line: Line): any => transformLineParsedRequest(line)),
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
}
