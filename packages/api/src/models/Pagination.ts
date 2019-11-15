/**
 * Pagination response
 *
 * @page The current page number
 * @pages The total number of pages
 * @total The total number of items
 * @size Number of items per page
 */
export default interface Pagination {
	page: number
	pages: number
	total: number
	size: number
}
