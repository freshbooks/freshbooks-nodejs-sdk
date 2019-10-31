/* eslint-disable @typescript-eslint/camelcase */
import Pagination from './Pagination'

export default interface Invoice {
	id: string
}

export function transformListInvoicesResponse(
	data: string
): { invoices: Invoice[]; pages: Pagination } {
	const {
		response: {
			result: { invoices, per_page, total, page, pages },
		},
	} = JSON.parse(data)

	return {
		invoices: invoices.map((invoice: { id: string }) => ({
			id: invoice.id,
		})),
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
	}
}
