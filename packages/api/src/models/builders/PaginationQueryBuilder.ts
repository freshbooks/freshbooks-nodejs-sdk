/* eslint-disable @typescript-eslint/camelcase */
import { buildQueryString, QueryParamType } from '../helpers'

/* eslint-disable import/prefer-default-export */

/**
 * Builder to build AxiosRequestConfig 'include' params
 * for the `/accounting/account/<accountId>/users/clients` endpoint
 */
export class PaginationQueryBuilder {
	queryParams: QueryParamType

	constructor() {
		this.queryParams = {}
	}

	page(page: number | string): PaginationQueryBuilder {
		this.queryParams = {
			...this.queryParams,
			page,
		}
		return this
	}

	perPage(perPage: number | string): PaginationQueryBuilder {
		this.queryParams = {
			...this.queryParams,
			per_page: perPage,
		}
		return this
	}

	build(): string {
		return buildQueryString(this.queryParams)
	}
}
