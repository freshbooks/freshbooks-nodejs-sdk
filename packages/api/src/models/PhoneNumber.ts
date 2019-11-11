export default interface PhoneNumber {
	title: string
	number: string
}

/**
 * Parse a JSON string to @PhoneNumber object
 * @param json JSON string
 */
export function transformPhoneNumberJSON(json: string): PhoneNumber {
	const { title, number } = JSON.parse(json)

	return {
		title,
		number,
	}
}

/**
 * @param data Phone number object
 * eg: { title: 'Mobile', '555-555-5555'}
 * @returns Phone number object
 */
export function transformPhoneNumberResponse(data: any): PhoneNumber {
	const { title, number } = data
	return {
		title,
		number,
	}
}

/**
 * Convert a @PhoneNumber object to JSON string
 * @param phoneNumber @PhoneNumber object
 * @returns JSON string representing a phone number
 */
export function transformUserRequest(phoneNumber: PhoneNumber): string {
	return JSON.stringify(phoneNumber)
}
