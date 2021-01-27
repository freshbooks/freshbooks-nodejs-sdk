/* eslint-disable @typescript-eslint/camelcase */
import { Nullable } from './helpers'

export default interface ProjectGroup {
	id: string
	members?: Nullable<ProjectGroupMembers[]>
}

export interface ProjectGroupMembers {
	firstName: string
	lastName: string
	role: 'owner'
	identityId: string
	active: boolean
	company: string
	id: string
	email: string
}

export function transformProjectGroupMemberResponse(data: any): ProjectGroupMembers {
	return {
		firstName: data.first_name,
		lastName: data.last_name,
		role: data.role,
		identityId: data.identity_id,
		active: data.active,
		company: data.company,
		id: data.id,
		email: data.email,
	}
}

export function transformProjectGroupResponse(data: any): ProjectGroup {
	return {
		id: data.id,
		members: data.members && data.members.map(transformProjectGroupMemberResponse),
	}
}
