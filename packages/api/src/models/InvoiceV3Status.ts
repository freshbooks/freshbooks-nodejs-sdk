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

export default InvoiceV3Status
