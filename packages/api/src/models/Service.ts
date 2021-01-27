/* eslint-disable @typescript-eslint/camelcase */
import VisState from './VisState'

export default interface Service {
	businessId: string
	id: string
	name: string
	billable: boolean
	visState: VisState
}

export function transformServiceResponse(data: any): Service {
	return {
		businessId: data.business_id,
		id: data.id,
		name: data.name,
		billable: data.billable,
		visState: data.vis_state,
	}
}
