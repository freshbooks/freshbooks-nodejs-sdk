import { buildQueryString } from '../helpers'

/* eslint-disable import/prefer-default-export */
type QueryParamType = { [key: string]: string[] }

/**
 * Builder to build AxiosRequestConfig 'include' params
 * for the `/accounting/account/<accountId>/users/clients` endpoint
 */
export class IncludesQueryBuilder {
	queryParams: QueryParamType

	constructor() {
		this.queryParams = {
			'include[]': [],
		}
	}

	includes(key: string): IncludesQueryBuilder {
		this.queryParams = {
			...this.queryParams,
			'include[]': this.queryParams['include[]'].concat(key),
		}
		return this
	}

	build(): string {
		return buildQueryString(this.queryParams)
	}
}
