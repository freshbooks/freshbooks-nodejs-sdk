export default interface PhoneNumber {
	title: string
	number: string
}

/**
 * Parse a JSON string to @PhoneNumber object
 * @param json JSON string
 * eg: '{ "title": "Mobile", "phone_number": "555-555-5555"}'
 */
export function transformPhoneNumberJSON(json: string): PhoneNumber {
	const { title, phone_number: number } = JSON.parse(json)

	return {
		title,
		number,
	}
}

/**
 * @param data Phone number object
 * eg: { title: 'Mobile', number: '555-555-5555'}
 * @returns Phone number object
 */
export function transformPhoneNumberResponse(data: any): PhoneNumber {
	const { title, phone_number: number } = data
	return {
		title,
		number,
	}
}
