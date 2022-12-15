/* eslint-disable @typescript-eslint/camelcase */
import Address, { transformAddressParsedResponse, AddressResponse } from './Address'
import PhoneNumber, { transformPhoneNumberParsedResponse, PhoneNumberResponse } from './PhoneNumber'
import BusinessClient, { transformBusinessClientParsedResponse, BusinessClientResponse } from './BusinessClient'
import { Nullable } from './helpers'

export default interface Business {
	id: number
	name: string
	accountId: string
	address: Nullable<Address>
	phoneNumber?: Nullable<PhoneNumber>
	businessClients: BusinessClient[]
}

export interface BusinessResponse {
	id: number
	name: string
	account_id: string
	address: AddressResponse
	phone_number: Nullable<PhoneNumberResponse>
	business_clients: BusinessClientResponse[]
}

export function transformBusinessParsedResponse(business: BusinessResponse): Business {
	return {
		id: business.id,
		name: business.name,
		accountId: business.account_id !== null ? business.account_id.toString() : '',
		address: business.address !== null ? transformAddressParsedResponse(business.address) : null,
		phoneNumber: business.phone_number !== null ? transformPhoneNumberParsedResponse(business.phone_number) : null,
		businessClients: business.business_clients.map((client: any): BusinessClient => transformBusinessClientParsedResponse(client)),
	}
}
