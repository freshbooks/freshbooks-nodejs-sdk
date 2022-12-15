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

	const {
		id,
		first_name,
		last_name,
		email,
		phone_numbers: phoneNumbers = [],
		addresses = [],
		permissions = {},
		subscription_statuses: subscriptionStatuses,
		business_memberships: businessMemberships = [],
		roles = [],
		profession,
		groups = [],
		links = {},
	} = response.response
	return {
		id: id.toString(), // store ids as string
		firstName: first_name,
		lastName: last_name,
		email,
		phoneNumbers: phoneNumbers.map(transformPhoneNumberParsedResponse),
		permissions,
		subscriptionStatuses,
		businessMemberships: businessMemberships.map(transformBusinessMembershipParsedResponse),
		roles: roles.map(transformRoleParsedResponse),
		addresses: addresses.filter((address: Nullable<AddressResponse>) => address !== null).map(transformAddressParsedResponse),
		profession: profession && transformProfessionParsedResponse(profession),
		groups: groups.map(transformGroupParsedResponse),
		links,
	}
}
