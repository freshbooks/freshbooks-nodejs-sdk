export default interface InvoiceCustomizedEmail {
	body?: string
	subject?: string
}

export function transformInvoiceCustomizedEmailRequest(invoiceCustomizedEmail: InvoiceCustomizedEmail): any {
	return {
		body: invoiceCustomizedEmail.body,
		subject: invoiceCustomizedEmail.subject,
	}
}
