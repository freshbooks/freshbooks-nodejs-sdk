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
	identityId: number
	active: boolean
	company: string
	id: number
	email: string
}

export function transformProjectGroupResponse(projectGroup: any): ProjectGroup {
	return {
		id: projectGroup.id,
		members: projectGroup.members && projectGroup.members.map(transformProjectGroupMemberResponse),
	}
}

export function transformProjectGroupMemberResponse(projectGroupMember: any): ProjectGroupMembers {
	return {
		firstName: projectGroupMember.first_name,
		lastName: projectGroupMember.last_name,
		role: projectGroupMember.role,
		identityId: projectGroupMember.identity_id,
		active: projectGroupMember.active,
		company: projectGroupMember.company,
		id: projectGroupMember.id,
		email: projectGroupMember.email,
	}
}
