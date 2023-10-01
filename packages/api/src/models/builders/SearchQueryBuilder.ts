import { ParamType } from '../helpers'

/* eslint-disable import/prefer-default-export */
interface RangeType {
	min?: string | number | Date
	max?: string | number | Date
}

class QueryParam {
	type: string
	key: string
	value: ParamType

	constructor(type: string, key: string, value: ParamType) {
		this.type = type
		this.key = key
		this.value = value
	}
}

/**
 * Builder to build AxiosRequestConfig 'search' params
 * for accounting endpoints
 */
export class SearchQueryBuilder {
	queryParams: QueryParam[]

	constructor() {
		this.queryParams = [] as QueryParam[]
	}

	private static handleDate(date: Date): string {
		const year = date.getFullYear()
		const month = date.toLocaleDateString(undefined, { month: '2-digit' })
		const day = date.toLocaleDateString(undefined, { day: '2-digit' })
		return `${year}-${month}-${day}`
	}

	in(key: string, values: ParamType[]): SearchQueryBuilder {
		this.queryParams.push(new QueryParam('in', key, values))
		return this
	}

	equals(key: string, value: ParamType): SearchQueryBuilder {
		this.queryParams.push(new QueryParam('equals', key, value))
		return this
	}

	like(key: string, value: ParamType): SearchQueryBuilder {
		this.queryParams.push(new QueryParam('like', key, value))
		return this
	}

	between(key: string, { min, max }: RangeType): SearchQueryBuilder {
		if (min) {
			const value = min instanceof Date ? SearchQueryBuilder.handleDate(min) : min
			this.queryParams.push(new QueryParam('between', `${key}_min`, value))
		}
		if (max) {
			const value = max instanceof Date ? SearchQueryBuilder.handleDate(max) : max
			this.queryParams.push(new QueryParam('between', `${key}_max`, value))
		}
		return this
	}

	boolean(key: string, value: boolean): SearchQueryBuilder {
		this.queryParams.push(new QueryParam('boolean', key, value))
		return this
	}

	build(resourceType?: string): string {
		let isAccountingLike = false
		if (!resourceType || ['AccountingResource', 'EventsResource'].includes(resourceType)) {
			isAccountingLike = true
		}
		let queryString = ''
		this.queryParams.forEach((param) => {
			const type = param.type
			const key = param.key
			const value = param.value
			if (type === 'like' || type === 'between' || (type === 'equals' && isAccountingLike)) {
				queryString = queryString.concat(`&search[${key}]=${value}`)
			} else if (type === 'in' && value instanceof Array) {
				for (let i = 0; i < value.length; i += 1) {
					queryString = queryString.concat(`&search[${key}][]=${value[i]}`)
				}
			} else {
				queryString = queryString.concat(`&${key}=${value}`)
			}
		})
		return queryString.substr(1)
	}
}
