/* eslint-disable @typescript-eslint/camelcase */
import { transformErrorResponse, isProjectErrorResponse, ErrorResponse } from './Error'

export default interface ServiceRate {
	rate?: string
	businessId?: number
	serviceId?: number
}

export function transformServiceRateResponse(data: string): ServiceRate | ErrorResponse {
	const response = JSON.parse(data)

	if (isProjectErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { service_rate } = response
	
	return transformServiceRateParsedResponse(service_rate)
}

function transformServiceRateParsedResponse(serviceRate: any): ServiceRate {
	return {
		rate: serviceRate.rate,
		businessId: serviceRate.business_id,
		serviceId: serviceRate.service_id,
	}
}

export function transformServiceRateRequest(service_rate: ServiceRate): string {
	const request = JSON.stringify({
		service_rate: {
			rate: service_rate.rate,
		},
	})
	return request
}
