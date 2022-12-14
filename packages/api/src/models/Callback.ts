/* eslint-disable @typescript-eslint/camelcase */
import { transformErrorResponse, isEventErrorResponse, ErrorResponse } from './Error'
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
export function transformCallbackData({
	callbackid: callbackId,
	uri,
	event,
	verified,
	updated_at: updatedAt,
}: any): Callback {
	return {
		callbackId,
		uri,
		event,
		verified,
		updatedAt: transformDateResponse(updatedAt, DateFormat['YYYY-MM-DD hh:mm:ss']),
	}
}

export function transformCallbackResponse(data: string): Callback | ErrorResponse {
	const response = JSON.parse(data)
	
	if (isEventErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { callback } = response.response.result
	
	return transformCallbackData(callback)
}

 export function transformCallbackListResponse(data: string): { callbacks: Callback[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isEventErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { callbacks, per_page, total, page, pages } = response.response.result
	
	return {
		callbacks: callbacks.map((callback: Callback) => transformCallbackData(callback)),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},	
	}
}

export function transformCallbackRequest(callback: Callback): string {
	let payload = {
		callback: {
			uri: callback.uri,
			event: callback.event,
		}
	}
	const request = JSON.stringify(payload)
	return request
}

export function transformCallbackVerifierRequest(verifier: string): string {
	let payload = {
		callback: {
			verifier: verifier
		}
	}
	const request = JSON.stringify(payload)
	return request
}

export function transformCallbackResendRequest(): string {
	let payload = {
		callback: {
			resend: true
		}
	}
	const request = JSON.stringify(payload)
	return request
}
