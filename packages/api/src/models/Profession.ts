/* eslint-disable @typescript-eslint/camelcase */
export default interface Profession {
	id: string
	title: string
	company: string
	businessId: string
	designation: string
}

/**
 * Parse a JSON string to @Profession object
 * @param json JSON string
 * eg: '{"id": 17748, "title": "Accounting", "company": "BillSpring", "designation": null, "business_id": 2122866}'
 * @returns Profession object
 */
export function transformProfessionJSON(json: string): Profession {
	const { id, title, company, designation, business_id } = JSON.parse(json)
	return {
		id: id.toString(),
		title,
		company,
		designation,
		businessId: business_id ? business_id.toString() : undefined,
	}
}

/**
 * Format an Profession response object
 * @param data Profession object
 * eg: {"id": 17748, "title": "Accounting", "company": "BillSpring", "designation": null, "business_id": 2122866}
 * @returns Profession object
 */
export function transformProfessionResponse(data: any): Profession {
	const { id, title, company, designation, business_id } = data
	return {
		id: id.toString(),
		title,
		company,
		designation,
		businessId: business_id ? business_id.toString() : undefined,
	}
}
