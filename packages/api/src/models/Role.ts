/* eslint-disable @typescript-eslint/camelcase */
export default interface Role {
	id: number
	role: string
	systemId: number
	userId: number
	accountId: string
	createdAt: Date
	links: { [key: string]: string }
}

export interface RoleResponse {
	id: number
	role: string
	systemid: number
	userid: number
	accountid: string
	created_at: string
	links: { [key: string]: string }
}

export function transformRoleResponse(role: RoleResponse): Role {
	return {
		id: role.id,
		role: role.role,
		systemId: role.systemid,
		userId: role.userid,
		accountId: role.accountid.toString(),
		createdAt: new Date(role.created_at),
		links: role.links,
	}
}
