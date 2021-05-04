/* eslint-disable @typescript-eslint/camelcase */
import Address, { transformAddressResponse, AddressResponse } from './Address'
import PhoneNumber, { transformPhoneNumberResponse, PhoneNumberResponse } from './PhoneNumber'
import BusinessClient, { transformBusinessClientResponse, BusinessClientResponse } from './BusinessClient'
import { Nullable } from './helpers'

export default interface Business {
	id: string
	name: string
	accountId: string
	address: Address
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

/**
 * Format a Business response object
 * @param data Business object
 * eg: {
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
 *      }
 * @returns Business object
 */
export function transformBusinessResponse({
	id,
	name,
	account_id: accountId = '',
	address,
	phone_number,
	business_clients,
}: BusinessResponse): Business {
	return {
		id: id.toString(),
		name,
		accountId: accountId !== null ? accountId.toString() : '',
		address: transformAddressResponse(address),
		phoneNumber: phone_number !== null ? transformPhoneNumberResponse(phone_number) : null,
		businessClients: business_clients.map(transformBusinessClientResponse),
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
	return transformBusinessResponse(response)
}
