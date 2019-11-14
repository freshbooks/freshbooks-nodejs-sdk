import { filterNullKeys } from './helpers'

export default interface Address {
	id: string
	street?: string
	city?: string
	province?: string
	country?: string
	postalCode?: string
}

/**
 * Parse a JSON string to @Address object
 * @param json JSON string
 * eg: '{ 'id': 1, 'street': 'King Street', 'city': 'Toronto', 'province': 'Ontario', 'postal_code': 'K3I6R9'}'
 * @returns Address object
 */
export function transformAddressJSON(json: string): Address {
	const {
		id,
		street,
		city,
		province,
		country,
		postal_code: postalCode,
	} = JSON.parse(json)
	const model = {
		id: id.toString(),
		street,
		city,
		province,
		country,
		postalCode,
	}
	filterNullKeys(model)
	return model
}

/**
 * Format an Address response object
 * @param data Address object
 * eg: { 'id': 1, 'street': 'King Street', 'city': 'Toronto', 'province': 'Ontario', 'postal_code': 'K3I6R9'}
 * @returns Address object
 */
export function transformAddressResponse(data: any): Address {
	const { id, street, city, province, country, postal_code: postalCode } = data

	const model = {
		id: id.toString(),
		street,
		city,
		province,
		country,
		postalCode,
	}
	filterNullKeys(model)
	return model
}
