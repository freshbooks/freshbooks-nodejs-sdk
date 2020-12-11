import { ParamType, QueryParamType, buildQueryString } from '../helpers'

/* eslint-disable import/prefer-default-export */
interface RangeType {
	min?: string | number | Date
	max?: string | number | Date
}

/**
 * Builder to build AxiosRequestConfig 'search' params
 * for accounting endpoints
 */
export class SearchQueryBuilder {
	queryParams: QueryParamType

	constructor() {
		this.queryParams = {}
	}

	private static handleDate(date: Date): string {
		const year = date.getFullYear()
		const month = date.toLocaleDateString(undefined, { month: '2-digit' })
		const day = date.toLocaleDateString(undefined, { day: '2-digit' })
		return `${year}-${month}-${day}`
	}

	in(key: string, values: ParamType[]): SearchQueryBuilder {
		this.queryParams = { ...this.queryParams, [`search[${key}][]`]: values }
		return this
	}

	equals(key: string, value: ParamType): SearchQueryBuilder {
		this.queryParams = { ...this.queryParams, [`search[${key}]`]: value }
		return this
	}

	like(key: string, value: ParamType): SearchQueryBuilder {
		this.queryParams = { ...this.queryParams, [`search[${key}_like]`]: value }
		return this
	}

	between(key: string, { min, max }: RangeType): SearchQueryBuilder {
		if (min) {
			const value =
				min instanceof Date ? SearchQueryBuilder.handleDate(min) : min
			this.queryParams = { ...this.queryParams, [`search[${key}_min]`]: value }
		}
		if (max) {
			const value =
				max instanceof Date ? SearchQueryBuilder.handleDate(max) : max
			this.queryParams = {
				...this.queryParams,
				[`search[${key}_max]`]: value,
			}
		}
		return this
	}

	build(): string {
		return buildQueryString(this.queryParams)
	}
}
