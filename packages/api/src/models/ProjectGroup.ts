/* eslint-disable @typescript-eslint/camelcase */
import { Nullable } from './helpers'

export default interface ProjectGroup {
	id: string
	members?: Nullable<ProjectGroupMember[]>
}

export interface ProjectGroupMember {
	firstName: string
	lastName: string
	role: 'owner'
	identityId: number
	active: boolean
	company: string
	id: number
	email: string
}

export function transformProjectGroupParsedResponse(group: any): ProjectGroup {
	return {
		id: group.id,
		members: group.members && group.members.map(transformProjectGroupMemberParsedResponse),
	}
}

export function transformProjectGroupMemberParsedResponse(member: any): ProjectGroupMember {
	return {
		firstName: member.first_name,
		lastName: member.last_name,
		role: member.role,
		identityId: member.identity_id,
		active: member.active,
		company: member.company,
		id: member.id,
		email: member.email,
	}
}
