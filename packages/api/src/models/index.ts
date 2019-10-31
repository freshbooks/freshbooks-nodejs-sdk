export { User } from './User'
export { Invoice } from './Invoices'

export interface Error {
	code: string
	message?: string
}

export interface Pagination {
	page: number
	pages: number
	total: number
	size: number
}
