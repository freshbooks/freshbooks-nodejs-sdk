export default interface Address {
	id: string
	street: string
	city: string
	province: string
	postalCode: string
}

/**
 * Parse a JSON string to @Address object
 * @param json JSON string
 * eg: '{ 'id': 1, 'street': 'King Street', 'city': 'Toronto', 'province': 'Ontario', 'postal_code': 'K3I6R9'}'
 * @returns Address object
 */
export function transformAddressJSON(json: string): Address {
	const { id, street, city, province, postal_code: postalCode } = JSON.parse(
		json
	)
	return {
		id: id.toString(),
		street,
		city,
		province,
		postalCode,
	}
}

/**
 * Format an Address response object
 * @param data Address object
 * eg: { 'id': 1, 'street': 'King Street', 'city': 'Toronto', 'province': 'Ontario', 'postal_code': 'K3I6R9'}
 * @returns Address object
 */
export function transformAddressResponse(data: any): Address {
	const { id, street, city, province, postal_code: postalCode } = data

	return {
		id: id.toString(),
		street,
		city,
		province,
		postalCode,
	}
}
