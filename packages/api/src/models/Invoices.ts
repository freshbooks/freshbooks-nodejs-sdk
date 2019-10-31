/* eslint-disable @typescript-eslint/camelcase */
import Pagination from './Pagination'
import Error from './Error'

export default interface Invoice {
	id: string
}

export function transformListInvoicesResponse(
	data: string
): { invoices: Invoice[]; pages: Pagination } | Error {
	const {
		response: { errors, result },
	} = JSON.parse(data)

	if (errors) {
		return {
			code: errors[0].errno,
			message: errors[0].message,
		}
	}

	const { invoices, per_page, total, page, pages } = result
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
