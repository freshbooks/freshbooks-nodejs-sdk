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

export function transformProfessionResponse(profession: ProfessionResponse): Profession {
	return {
		id: profession.id.toString(),
		title: profession.title,
		company: profession.company,
		designation: profession.designation,
		businessId: profession.business_id !== null ? profession.business_id.toString() : null,
	}
}
