interface APIError {
	message: string
	errorCode?: number
	field?: string
	object?: string
	value?: string
}

export type ErrorResponse = { errors: APIError[] } | { message: string }

export class APIClientConfigError extends Error {}

export default class APIClientError extends Error {
	name: string

	message: string

	statusCode?: string

	errors?: APIError[]

	constructor(name: string, message: string, statusCode?: string, errors?: APIError[]) {
		super()
		this.name = name
		this.message = message
		this.statusCode = statusCode
		this.errors = errors
	}
}

export function isAccountingErrorResponse(status: string, response: any): boolean {
	if (parseInt(status) >= 400 || response.response.error || response.response.errors) {
		return true
	}
	return false
}

export function isAuthErrorResponse(status: string, response: any): boolean {
	if (parseInt(status) >= 400 || response.error || response.error_description) {
		return true
	}
	return false
}

export function isEventErrorResponse(status: string): boolean {
	return parseInt(status) >= 400
}

export function isOnlinePaymentErrorResponse(status: string, response: any): boolean {
	if (parseInt(status) >= 400 || response.error_type) {
		return true
	}
	return false
}

export function isProjectErrorResponse(status: string, response: any): boolean {
	if (parseInt(status) >= 400 || response.error || response.errno) {
		return true
	}
	return false
}

export const transformAccountingErrorResponse = (errorResponse: any): ErrorResponse => {
	const { response } = errorResponse
	if (response && response.errors) {
		return {
			errors: response.errors.map(
				({ message: msg, errno: errorCode, field, object, value }: any): APIError => ({
					message: msg,
					errorCode,
					field,
					object,
					value,
				})
			),
		}
	}
	return {
		message: 'Returned an unexpected response',
	}
}

export const transformAuthErrorResponse = (errorResponse: any): ErrorResponse => {
	if (errorResponse.error && errorResponse.error_description) {
		return {
			message: errorResponse.error_description,
		}
	}
	return {
		message: 'Returned an unexpected response',
	}
}

export const transformEventErrorResponse = (errorResponse: any): ErrorResponse => {
	const { message, details } = errorResponse
	if (message && details) {
		const errors: APIError[] = []
		const badRequest = details.find((detail: { fieldViolations: any }) => detail.fieldViolations)
		if (badRequest) {
			badRequest.fieldViolations.forEach((error: { field: any; description: any }) => {
				errors.push({
					field: error.field,
					message: error.description,
				})
			})
			return { errors }
		}
	}
	if (message) return { message }
	return {
		message: 'Returned an unexpected response',
	}
}

export const transformOnlinePaymentsErrorResponse = (errorResponse: any): ErrorResponse => {
	const { error_type: errorType, message } = errorResponse
	if (errorType && message) {
		return {
			message,
		}
	}
	return {
		message: 'Returned an unexpected response',
	}
}

export const transformProjectErrorResponse = (errorResponse: any): ErrorResponse => {
	const { error, errno, message } = errorResponse
	if (error && errno) {
		return {
			errors: Object.keys(error).map(
				(key): APIError => ({
					errorCode: errno,
					field: key,
					message: error[key],
				})
			),
		}
	}
	if (error) {
		return {
			message: error,
		}
	}
	if (message) {
		return {
			message: message,
		}
	}
	return {
		message: 'Returned an unexpected response',
	}
}
