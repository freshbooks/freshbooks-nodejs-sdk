/* eslint-disable @typescript-eslint/camelcase */
import ClientBusiness, { transformClientBusinessResponse, ClientBusinessResponse } from './ClientBusiness'
import AccountBusiness, { transformAccountBusinessParsedResponse, AccountBusinessResponse } from './AccountBusiness'

export default interface BusinessClient {
	id: number
	businessId: number
	accountId: string
	userId: number
	clientBusiness: ClientBusiness
	accountBusiness: AccountBusiness
}

export interface BusinessClientResponse {
	id: number
	business_id: number
	account_id: string
	userid: number
	client_business: ClientBusinessResponse
	account_business: AccountBusinessResponse
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
export function transformBusinessClientResponse({
	id,
	business_id,
	account_id,
	userid,
	client_business,
	account_business,
}: BusinessClientResponse): BusinessClient {
	return {
		id: id,
		businessId: business_id,
		accountId: account_id,
		userId: userid,
		clientBusiness: transformClientBusinessResponse(client_business),
		accountBusiness: transformAccountBusinessParsedResponse(account_business),
	}
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
	const response: BusinessClientResponse = JSON.parse(json)
	return transformBusinessClientResponse(response)
}
