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

	const {
		response: { result },
	} = response
	const { callback } = result
	return transformCallbackData(callback)
}

/**
 * Parses JSON list response and converts to internal callback list response
 * @param data representing JSON response
 * @returns callback list response
 */
 export function transformCallbackListResponse(data: string): { callbacks: Callback[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isEventErrorResponse(response)) {
		return transformErrorResponse(response)
	}
	const {
		response: { result },
	} = response
	const { callbacks, per_page, total, page, pages } = result
	return {
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
		callbacks: callbacks.map((callback: Callback) => transformCallbackData(callback)),
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
