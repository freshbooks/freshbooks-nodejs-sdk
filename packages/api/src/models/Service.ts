/* eslint-disable @typescript-eslint/camelcase */
import Pagination from './Pagination'
import { transformErrorResponse, isProjectErrorResponse, ErrorResponse } from './Error'

import VisState from './VisState'

export default interface Service {
	businessId?: string
	id?: string
	name?: string
	billable?: boolean
	visState?: VisState
}
export function transformServiceData({
	business_id: businessId,
	id: id,
	name: name,
	billable: billable,
	vis_state: visState,
}: any): Service {
	return {
		businessId,
		id,
		name,
		billable,
		visState,
	}
}
export function transformServiceResponse(data: string): Service | ErrorResponse {
	const response = JSON.parse(data)
	if (isProjectErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { service } = response
	return transformServiceData(service)
}

export function transformListServicesResponse(
	data: string
): { services: Service[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isProjectErrorResponse(response)) {
		return transformErrorResponse(response)
	}
	const { services, meta } = response
	const { total, per_page, page, pages } = meta
	return {
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
		services: services.map((service: Service) => transformServiceData(service)),
	}
}

export function transformServiceRequest(service: Service): string {
	const request = JSON.stringify({
		service: {
			name: service.name,
		},
	})
	return request
}
