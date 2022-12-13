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

export function transformBusinessClientResponse(businessClient: BusinessClientResponse): BusinessClient {
	return {
		id: businessClient.id,
		businessId: businessClient.business_id,
		accountId: businessClient.account_id,
		userId: businessClient.userid,
		clientBusiness: businessClient.client_business && transformClientBusinessResponse(businessClient.client_business),
		accountBusiness: businessClient.account_business && transformAccountBusinessParsedResponse(businessClient.account_business),
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
