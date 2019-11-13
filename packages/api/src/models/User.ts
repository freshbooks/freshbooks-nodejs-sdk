/* eslint-disable @typescript-eslint/camelcase */
import Error from './Error'
import PhoneNumber, { transformPhoneNumberResponse } from './PhoneNumber'
import Address, { transformAddressResponse } from './Address'
import BusinessMembership, {
	transformBusinessMembershipResponse,
} from './BusinessMembership'
import Role, { transformRoleResponse } from './Role'
import Profession, { transformProfessionResponse } from './Profession'
import Group, { transformGroupResponse } from './Group'

export default interface User {
	id: string
	firstName: string
	lastName: string
	email: string
	phoneNumbers?: PhoneNumber[]
	addresses?: Address[]
	permissions: Map<string, Map<string, any>>
	subscriptionStatuses: Map<string, string>
	businessMemberships?: BusinessMembership[]
	roles?: Role[]
	profession?: Profession
	groups?: Group[]
	links?: Map<string, string>
}

export function transformUserResponse(data: string): User | Error {
	const { response, error, error_description } = JSON.parse(data)

	if (error) {
		return {
			code: error,
			message: error_description,
		}
	}

	const {
		id,
		first_name,
		last_name,
		email,
		phone_numbers: phoneNumbers = [],
		addresses = [],
		permissions,
		subscriptionStatuses,
		businessMemberships = [],
		roles = [],
		profession,
		groups = [],
		links = {},
	} = response
	return {
		id: id.toString(),
		firstName: first_name,
		lastName: last_name,
		email,
		phoneNumbers: phoneNumbers.map((phoneNumber: any) =>
			transformPhoneNumberResponse(phoneNumber)
		),
		permissions,
		subscriptionStatuses,
		businessMemberships: businessMemberships.map((businessMembership: any) =>
			transformBusinessMembershipResponse(businessMembership)
		),
		roles: roles.map((role: any) => transformRoleResponse(role)),
		addresses: addresses
			.filter((entry: any) => entry)
			.map((address: any) => transformAddressResponse(address)),
		profession: transformProfessionResponse(profession),
		groups: groups.map((group: any) => transformGroupResponse(group)),
		links,
	}
}
