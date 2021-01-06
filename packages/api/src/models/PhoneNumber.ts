import { Nullable } from './helpers'

/* eslint-disable @typescript-eslint/camelcase */
export default interface PhoneNumber {
	title: string
	number?: Nullable<string>
}

export interface PhoneNumberResponse {
	title: string
	phone_number: Nullable<string>
}

/**
 * Format a phone number response object
 * @param data @PhoneNumber object
 * eg: { title: 'Mobile', number: '555-555-5555'}
 * @returns @PhoneNumber object
 */
export function transformPhoneNumberResponse({ title, phone_number }: PhoneNumberResponse): PhoneNumber {
	return {
		title,
		number: phone_number,
	}
}

/**
 * Parse a JSON string to @PhoneNumber object
 * @param json JSON string
 * eg: '{ "title": "Mobile", "phone_number": "555-555-5555"}'
 * @returns @PhoneNumber object
 */
export function transformPhoneNumberJSON(json: string): PhoneNumber {
	const response: PhoneNumberResponse = JSON.parse(json)
	return transformPhoneNumberResponse(response)
}
