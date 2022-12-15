/* eslint-disable @typescript-eslint/camelcase */
import { isAccountingErrorResponse, transformErrorResponse, ErrorResponse } from './Error'
import PhoneNumber, { transformPhoneNumberParsedResponse } from './PhoneNumber'
import Address, { transformAddressParsedResponse, AddressResponse } from './Address'
import BusinessMembership, { transformBusinessMembershipParsedResponse } from './BusinessMembership'
import Role, { transformRoleParsedResponse } from './Role'
import Profession, { transformProfessionParsedResponse } from './Profession'
import Group, { transformGroupParsedResponse } from './Group'
import Permission from './Permission'
import { Nullable } from './helpers'

export default interface User {
	id: number
	firstName: string
	lastName: string
	email: string
	phoneNumbers?: Nullable<PhoneNumber[]>
	addresses?: Nullable<Address[]>
	permissions: Map<string, Map<string, Permission>>
	subscriptionStatuses: Map<string, string>
	businessMemberships?: Nullable<BusinessMembership[]>
	roles?: Nullable<Role[]>
	profession?: Nullable<Profession>
	groups?: Nullable<Group[]>
	links?: Nullable<Map<string, string>>
}

export function transformUserResponse(data: string): User | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const user = response.response

	return transformUserParsedResponse(user)
}

export function transformUserParsedResponse(user: any): User {
	return {
		id: user.id.toString(),
		firstName: user.first_name,
		lastName: user.last_name,
		email: user.email,
		phoneNumbers: user.phone_numbers && user.phone_numbers.map((phoneNumber: any): PhoneNumber => transformPhoneNumberParsedResponse(phoneNumber)),
		permissions: user.permissions,
		subscriptionStatuses: user.subscription_statuses,
		businessMemberships: user.business_memberships && user.business_memberships.map((membership: any): BusinessMembership => transformBusinessMembershipParsedResponse(membership)),
		roles: user.roles && user.roles.map((role: any): Role => transformRoleParsedResponse(role)),
		addresses: user.addresses && user.addresses.filter((address: Nullable<AddressResponse>) => address !== null).map((address: any): Address => transformAddressParsedResponse(address)),
		profession: user.profession && transformProfessionParsedResponse(user.profession),
		groups: user.groups && user.groups.map((group: any): Group => transformGroupParsedResponse(group)),
		links: user.links,
	}
}
