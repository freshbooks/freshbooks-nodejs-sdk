import Address, { transformAddressResponse } from './Address'
import PhoneNumber, { transformPhoneNumberResponse } from './PhoneNumber'
import BusinessClient, {
	transformBusinessClientResponse,
} from './BusinessClient'

export default interface Business {
	id: string
	name: string
	accountId: string
	address: Address
	phoneNumber?: PhoneNumber
	businessClients: BusinessClient[]
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
	const {
		id,
		name,
		account_id: accountId = '',
		address,
		phone_number: phoneNumber,
		business_clients: businessClients,
	} = JSON.parse(json)

	return {
		id: id.toString(),
		name,
		accountId: accountId.toString(),
		address: transformAddressResponse(address),
		phoneNumber: transformPhoneNumberResponse(phoneNumber) || null,
		businessClients: businessClients.map((businessClient: any) =>
			transformBusinessClientResponse(businessClient)
		),
	}
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
export function transformBusinessResponse(data: any): Business {
	const {
		id,
		name,
		account_id: accountId = '',
		address,
		phone_number: phoneNumber,
		business_clients: businessClients,
	} = data
	return {
		id: id.toString(),
		name,
		accountId: accountId.toString(),
		address: transformAddressResponse(address),
		phoneNumber: transformPhoneNumberResponse(phoneNumber),
		businessClients: businessClients.map((businessClient: any) =>
			transformBusinessClientResponse(businessClient)
		),
	}
}
