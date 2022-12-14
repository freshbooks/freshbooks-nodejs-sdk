/* eslint-disable @typescript-eslint/camelcase */
import { Nullable } from './helpers'

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
