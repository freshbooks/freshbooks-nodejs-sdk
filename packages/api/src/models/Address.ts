/* eslint-disable @typescript-eslint/camelcase */
import { Nullable } from './helpers'

export default interface Address {
	id: number
	street?: Nullable<string>
	city?: Nullable<string>
	province?: Nullable<string>
	country?: Nullable<string>
	postalCode?: Nullable<string>
}

export interface AddressResponse {
	id: number
	street: Nullable<string>
	city: Nullable<string>
	province: Nullable<string>
	country: Nullable<string>
	postal_code: Nullable<string>
}

export function transformAddressResponse(address: AddressResponse): Address {
	return {
		id: address.id,
		street: address.street,
		city: address.city,
		province: address.province,
		country: address.country,
		postalCode: address.postal_code,
	}
}
