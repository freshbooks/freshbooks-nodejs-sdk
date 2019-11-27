/* eslint-disable import/prefer-default-export */
export type Nullable<T> = T | null

function encode(val: string): string {
	return encodeURIComponent(val)
		.replace(/%40/gi, '@')
		.replace(/%3A/gi, ':')
		.replace(/%24/g, '$')
		.replace(/%2C/gi, ',')
		.replace(/%20/g, '+')
		.replace(/%5B/gi, '[')
		.replace(/%5D/gi, ']')
		.replace(/%26/g, '&')
		.replace(/%3D/gi, '=')
}

export type ParamType = string | boolean | number | object
export type QueryParamType = { [key: string]: ParamType }
export const buildQueryString = (params: QueryParamType): string => {
	let queryString = ''
	Object.keys(params).forEach(key => {
		const value = params[key]
		if (value instanceof Array) {
			for (let i = 0; i < value.length; i += 1) {
				queryString = queryString.concat(encode(`&${key}=${value[i]}`))
			}
		} else {
			queryString = queryString.concat(encode(`&${key}=${value}`))
		}
	})
	return queryString.substr(1)
}
