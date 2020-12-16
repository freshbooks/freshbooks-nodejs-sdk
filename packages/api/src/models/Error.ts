interface APIError {
	number: number
	field?: string
	message?: string
	object?: string
	value?: string
}

export type ErrorResponse = { errors: APIError[] } | { code: string; message: string }

export default class APIClientError extends Error {
	name: string

	message: string

	code?: string

	errors?: APIError[]

	constructor(name: string, message: string, code?: string, errors?: APIError[]) {
		super()
		this.name = name
		this.message = message
		this.code = code
		this.errors = errors
	}
}

export const isAccountingErrorResponse = ({ error, error_type: errorType, response }: any): any =>
	error || errorType || response.errors

export const isProjectErrorResponse = ({ error, error_type: errorType }: any): any => error || errorType

export const transformErrorResponse = (errorResponse: any): ErrorResponse => {
	const { response, error, errno, error_description: errorDescription, error_type: errorType, message } = errorResponse

	// singular error e.g., as returned by APIClient.users.me()
	if (error && errorDescription) {
		return {
			code: error,
			message: errorDescription,
		}
	}

	// not_found error
	if (errorType && message) {
		return {
			code: errorType,
			message,
		}
	}

	// general error supplied by valid endpoint
	if (response) {
		return {
			errors: response.errors.map(
				({ errno: number, field, message: msg, object, value }: any): APIError => ({
					number,
					field,
					message: msg,
					object,
					value,
				})
			),
		}
	}

	// Project-style payload error
	if (error && errno) {
		return {
			code: errno,
			// eslint-disable-next-line no-underscore-dangle
			errors: Object.keys(error).map(
				(key): APIError => ({
					number: errno,
					field: key,
					message: error[key],
				})
			),
		}
	}

	return {
		code: errorType,
		message: error,
	}
}
