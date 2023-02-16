/* eslint-disable @typescript-eslint/camelcase */
import { transformEventErrorResponse, isEventErrorResponse, ErrorResponse } from './Error'
import { Nullable } from './helpers'
import Pagination from './Pagination'
import { transformDateResponse, DateFormat } from './Date'

export default interface Callback {
	callbackId?: number
	event: string
	uri: string
	verified?: boolean
	updatedAt?: Nullable<Date>
}

export function transformCallbackResponse(
	data: string,
	headers: Array<string>,
	status: string
): Callback | ErrorResponse {
	const response = JSON.parse(data)

	if (isEventErrorResponse(status)) {
		return transformEventErrorResponse(response)
	}

	const { callback } = response.response.result

	return transformCallbackParsedResponse(callback)
}

export function transformCallbackListResponse(
	data: string,
	headers: Array<string>,
	status: string
): { callbacks: Callback[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isEventErrorResponse(status)) {
		return transformEventErrorResponse(response)
	}

	const { callbacks, per_page, total, page, pages } = response.response.result

	return {
		callbacks: callbacks.map((callback: any): Callback => transformCallbackParsedResponse(callback)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

export function transformCallbackParsedResponse(callback: any): Callback {
	return {
		callbackId: callback.callbackid,
		uri: callback.uri,
		event: callback.event,
		verified: callback.verified,
		updatedAt: callback.updated_at && transformDateResponse(callback.updated_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
	}
}

export function transformCallbackRequest(callback: Callback): string {
	const payload = {
		callback: {
			uri: callback.uri,
			event: callback.event,
		},
	}
	return JSON.stringify(payload)
}

export function transformCallbackVerifierRequest(verifier: string): string {
	const payload = {
		callback: {
			verifier: verifier,
		},
	}
	return JSON.stringify(payload)
}

export function transformCallbackResendRequest(): string {
	const payload = {
		callback: {
			resend: true,
		},
	}
	return JSON.stringify(payload)
}
