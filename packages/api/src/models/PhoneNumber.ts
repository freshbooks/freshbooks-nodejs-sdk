import { filterNullKeys } from './helpers'

export default interface PhoneNumber {
	title: string
	number?: string
}

/**
 * Parse a JSON string to @PhoneNumber object
 * @param json JSON string
 * eg: '{ "title": "Mobile", "phone_number": "555-555-5555"}'
 * @returns @PhoneNumber object
 */
export function transformPhoneNumberJSON(json: string): PhoneNumber {
	const { title, phone_number: number } = JSON.parse(json)
	const model = {
		title,
		number,
	}
	filterNullKeys(model)
	return model
}

/**
 * Format a phone number response object
 * @param data @PhoneNumber object
 * eg: { title: 'Mobile', number: '555-555-5555'}
 * @returns @PhoneNumber object
 */
export function transformPhoneNumberResponse(data: any): PhoneNumber {
	const { title, phone_number: number } = data
	const model = {
		title,
		number,
	}
	filterNullKeys(model)
	return model
}
