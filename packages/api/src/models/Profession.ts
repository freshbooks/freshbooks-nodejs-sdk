/* eslint-disable @typescript-eslint/camelcase */
import { filterNullKeys } from './helpers'

export default interface Profession {
	id: string
	title?: string
	company: string
	businessId?: string
	designation?: string
}

/**
 * Parse a JSON string to @Profession object
 * @param json JSON string
 * eg: '{"id": 17748, "title": "Accounting", "company": "BillSpring", "designation": null, "business_id": 2122866}'
 * @returns Profession object
 */
export function transformProfessionJSON(json: string): Profession {
	const {
		id,
		title,
		company,
		designation,
		business_id: businessId,
	} = JSON.parse(json)
	const model = {
		id: id.toString(),
		title,
		company,
		designation,
		businessId: businessId && businessId.toString(),
	}
	filterNullKeys(model)
	return model
}

/**
 * Format an Profession response object
 * @param data Profession object
 * eg: {"id": 17748, "title": "Accounting", "company": "BillSpring", "designation": null, "business_id": 2122866}
 * @returns Profession object
 */
export function transformProfessionResponse(data: any): Profession {
	const { id, title, company, designation, business_id: businessId } = data
	const model = {
		id: id.toString(),
		title,
		company,
		designation,
		businessId: businessId && businessId.toString(),
	}
	filterNullKeys(model)
	return model
}
