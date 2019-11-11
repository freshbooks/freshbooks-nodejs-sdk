export default interface Address {
	id: number
	street: string
	city: string
	province: string
	postalCode: string
}

/**
 * Parse a JSON string to @Address object
 * @param json JSON string
 */
export function transformAddressJSON(json: string): Address {
	const { id, street, city, province, postalCode } = JSON.parse(json)
	return {
		id,
		street,
		city,
		province,
		postalCode,
	}
}

/**
 * Format an Address response object
 * @param data Address object
 * eg: { 'id': 1, 'street': 'King Street', 'city': 'Toronto', 'province': 'Ontario', 'postalCode': 'K3I6R9'}
 * @returns Address object
 */
export function transformAddressResponse(data: any): Address {
	const { id, street, city, province, postalCode } = data

	return {
		id,
		street,
		city,
		province,
		postalCode,
	}
}

/**
 * Convert a @Address object to JSON string
 * @param address @Address object
 * @returns JSON string representing an address
 */
export function transformAddressRequest(address: Address): string {
	return JSON.stringify(address)
}
