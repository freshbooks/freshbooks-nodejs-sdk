import { Nullable } from './helpers'

/* eslint-disable @typescript-eslint/camelcase */
export default interface Profession {
	id: string
	title?: Nullable<string>
	company: string
	businessId?: Nullable<string>
	designation?: Nullable<string>
}

interface ProfessionResponse {
	id: number
	title: Nullable<string>
	company: string
	business_id: Nullable<number>
	designation: Nullable<string>
}

/**
 * Format an Profession response object
 * @param data Profession object
 * eg: {"id": 17748, "title": "Accounting", "company": "BillSpring", "designation": null, "business_id": 2122866}
 * @returns Profession object
 */
export function transformProfessionResponse({
	id,
	title,
	company,
	designation,
	business_id,
}: ProfessionResponse): Profession {
	return {
		id: id.toString(),
		title,
		company,
		designation,
		businessId: business_id !== null ? business_id.toString() : null,
	}
}
