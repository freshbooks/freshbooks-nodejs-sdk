/* eslint-disable import/prefer-default-export */
export type Nullable<T> = T | null

export type ParamType = string | boolean | number | object
export type QueryParamType = { [key: string]: ParamType }
export const buildQueryString = (params: QueryParamType): string => {
	let queryString = ''
	Object.keys(params).forEach(key => {
		const value = params[key]
		if (value instanceof Array) {
			for (let i = 0; i < value.length; i += 1) {
				queryString = queryString.concat(`&${key}=${value[i]}`)
			}
		} else {
			queryString = queryString.concat(`&${key}=${value}`)
		}
	})
	return encodeURIComponent(queryString.substr(1))
}
