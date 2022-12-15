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

export function transformPhoneNumberParsedResponse(phoneNumber: PhoneNumberResponse): PhoneNumber {
	return {
		title: phoneNumber.title,
		number: phoneNumber.phone_number,
	}
}
