import ClientBusiness, {
	transformClientBusinessResponse,
} from './ClientBusiness'
import AccountBusiness, {
	transformAccountBusinessResponse,
} from './AccountBusiness'

export default interface BusinessClient {
	id: string
	businessId: string
	accountId: string
	userId: string
	clientBusiness: ClientBusiness
	accountBusiness: AccountBusiness
}

/**
 * Parse a JSON string to @BusinessClient object
 * @param json JSON string
 * eg: '{
 *          "id": 22347,
 *          "business_id": 77128,
 *          "account_id": "Xr82w",
 *          "userid": 74353,
 *          "client_business": {
 *              "business_id": 77128
 *          },
 *          "account_business": {
 *              "account_business_id": 363103,
 *              "account_id": "Xr82w"
 *          }
 *      }'
 * @returns BusinessClient object
 */
export function transformBusinessClientJSON(json: string): BusinessClient {
	const {
		id,
		business_id: businessId = '',
		account_id: accountId = '',
		userid: userId = '',
		client_business: clientBusiness,
		account_business: accountBusiness,
	} = JSON.parse(json)

	return {
		id: id.toString(),
		businessId: businessId.toString(),
		accountId: accountId.toString(),
		userId: userId.toString(),
		clientBusiness: transformClientBusinessResponse(clientBusiness),
		accountBusiness: transformAccountBusinessResponse(accountBusiness),
	}
}

/**
 * Format a BusinessClient response object
 * @param data Business client object
 * eg: {
 *          "id": 22347,
 *          "business_id": 77128,
 *          "account_id": "Xr82w",
 *          "userid": 74353,
 *          "client_business": {
 *              "business_id": 77128
 *          },
 *          "account_business": {
 *              "account_business_id": 363103,
 *              "account_id": "Xr82w"
 *          }
 *      }
 * @returns Business client object
 */
export function transformBusinessClientResponse(data: any): BusinessClient {
	const {
		id,
		business_id: businessId = '',
		account_id: accountId = '',
		userid: userId = '',
		client_business: clientBusiness,
		account_business: accountBusiness,
	} = data
	return {
		id: id.toString(),
		businessId: businessId.toString(),
		accountId: accountId.toString(),
		userId: userId.toString(),
		clientBusiness: transformClientBusinessResponse(clientBusiness),
		accountBusiness: transformAccountBusinessResponse(accountBusiness),
	}
}
