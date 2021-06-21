import { Nullable } from './helpers'

/* eslint-disable @typescript-eslint/camelcase */
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

/**
 * Format an Address response object
 * @param data Address object
 * eg: { 'id': 1, 'street': 'King Street', 'city': 'Toronto', 'province': 'Ontario', 'postal_code': 'K3I6R9'}
 * @returns Address object
 */
export function transformAddressResponse({
	id,
	street,
	city,
	province,
	country,
	postal_code,
}: AddressResponse): Address {
	return {
		id: id,
		street,
		city,
		province,
		country,
		postalCode: postal_code,
	}
}

/**
 * Parse a JSON string to @Address object
 * @param json JSON string
 * eg: '{ 'id': 1, 'street': 'King Street', 'city': 'Toronto', 'province': 'Ontario', 'postal_code': 'K3I6R9'}'
 * @returns Address object
 */
export function transformAddressJSON(json: string): Address {
	const response: AddressResponse = JSON.parse(json)
	return transformAddressResponse(response)
}
