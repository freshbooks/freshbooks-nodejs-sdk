/* eslint-disable @typescript-eslint/camelcase */
import { transformProjectErrorResponse, isProjectErrorResponse, ErrorResponse } from './Error'

export default interface ServiceRate {
	rate?: string
	businessId?: number
	serviceId?: number
}

function transformServiceRateParsedResponse(rate: any): ServiceRate {
	return {
		rate: rate.rate,
		businessId: rate.business_id,
		serviceId: rate.service_id,
	}
}

export function transformServiceRateResponse(
	data: string,
	headers: Array<string>,
	status: string
): ServiceRate | ErrorResponse {
	const response = JSON.parse(data)

	if (isProjectErrorResponse(status, response)) {
		return transformProjectErrorResponse(response)
	}

	const { service_rate } = response

	return transformServiceRateParsedResponse(service_rate)
}

export function transformServiceRateRequest(rate: ServiceRate): string {
	return JSON.stringify({
		service_rate: {
			rate: rate.rate,
		},
	})
}
