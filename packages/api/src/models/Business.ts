/* eslint-disable @typescript-eslint/camelcase */
import Address, { transformAddressParsedResponse, AddressResponse } from './Address'
import PhoneNumber, { transformPhoneNumberResponse, PhoneNumberResponse } from './PhoneNumber'
import BusinessClient, { transformBusinessClientResponse, BusinessClientResponse } from './BusinessClient'
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
		phoneNumber: business.phone_number !== null ? transformPhoneNumberResponse(business.phone_number) : null,
		businessClients: business.business_clients.map(transformBusinessClientResponse),
	}
}

/**
 * Parse a JSON string to @Business object
 * @param json JSON string
 * eg: '{
 *          "id": 77128,
 *          "name": "BillSpring",
 *          "account_id": "zDmNq",
 *          "address": {
 *              "id": 74595,
 *              "street": "123",
 *              "city": "Toronto",
 *              "province": "Ontario",
 *              "country": "Canada",
 *              "postal_code": "A1B2C3"
 *          },
 *          "phone_number": null,
 *          "business_clients": [
 *           {
 *              "id": 22347,
 *              "business_id": 77128,
 *              "account_id": "Xr82w",
 *              "userid": 74353,
 *              "client_business": {
 *                  "business_id": 77128
 *              },
 *              "account_business": {
 *                  "account_business_id": 363103,
 *                  "account_id": "Xr82w"
 *              }
 *           }
 *          ]
 *      }'
 * @returns Business object
 */
export function transformBusinessJSON(json: string): Business {
	const response: BusinessResponse = JSON.parse(json)
	return transformBusinessParsedResponse(response)
}
