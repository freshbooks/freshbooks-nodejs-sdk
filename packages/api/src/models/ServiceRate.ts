/* eslint-disable @typescript-eslint/camelcase */
import { transformErrorResponse, isProjectErrorResponse, ErrorResponse } from './Error'

export default interface ServiceRate {
	rate?: string
	businessId?: number
	serviceId?: number
}
function transformServiceRateData({ rate: rate, business_id: businessId, service_id: serviceId }: any): ServiceRate {
	return {
		rate,
		businessId,
		serviceId,
	}
}
export function transformServiceRateResponse(data: string): ServiceRate | ErrorResponse {
	const response = JSON.parse(data)
	if (isProjectErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { service_rate } = response
	return transformServiceRateData(service_rate)
}

export function transformServiceRateRequest(service_rate: ServiceRate): string {
	const request = JSON.stringify({
		service_rate: {
			rate: service_rate.rate,
		},
	})
	return request
}
