/* eslint-disable @typescript-eslint/camelcase */
import Error from './Error'
import PhoneNumber, { transformPhoneNumberResponse } from './PhoneNumber'
import Address, { transformAddressResponse } from './Address'

export default interface User {
	id: string
	firstName: string
	lastName: string
	phoneNumbers?: PhoneNumber[]
	addresses?: Address[]
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
		phoneNumbers = [],
		addresses = [],
	} = response
	return {
		id,
		firstName: first_name,
		lastName: last_name,
		phoneNumbers: phoneNumbers.map((phoneNumber: any) =>
			transformPhoneNumberResponse(phoneNumber)
		),
		addresses: addresses.map((address: any) =>
			transformAddressResponse(address)
		),
	}
}
