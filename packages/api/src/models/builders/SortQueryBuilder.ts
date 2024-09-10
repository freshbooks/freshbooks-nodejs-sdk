class SortQueryParam {
	key: string
	direction: string

	constructor(key: string, direction: string) {
		this.key = key
		this.direction = direction
	}
}

/**
 * Builder to build AxiosRequestConfig 'sort' params
 * for accounting endpoints
 */
export class SortQueryBuilder {
	queryParams: SortQueryParam[]

	constructor() {
		this.queryParams = [] as SortQueryParam[]
	}

	asc(key: string): SortQueryBuilder {
		this.queryParams.push(new SortQueryParam(key, 'asc'))
		return this
	}

	ascending(key: string): SortQueryBuilder {
		return this.asc(key)
	}

	desc(key: string): SortQueryBuilder {
		this.queryParams.push(new SortQueryParam(key, 'desc'))
		return this
	}

	descending(key: string): SortQueryBuilder {
		return this.desc(key)
	}

	build(resourceType?: string): string {
		let isAccountingLike = false
		if (!resourceType || ['AccountingResource', 'EventsResource'].includes(resourceType)) {
			isAccountingLike = true
		}
		let queryString = ''
		this.queryParams.forEach((param) => {
			let key = param.key
			let direction = param.direction

			if (isAccountingLike) {
				direction = direction === 'asc' ? '_asc' : '_desc'
			} else {
				key = `-${key}`
				direction = ''
			}

			queryString = queryString.concat(`&sort=${key}${direction}`)
		})
		return queryString.substr(1)
	}
}
