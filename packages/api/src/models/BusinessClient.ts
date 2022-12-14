/* eslint-disable @typescript-eslint/camelcase */
import ClientBusiness, { transformClientBusinessParsedResponse, ClientBusinessResponse } from './ClientBusiness'
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

export function transformBusinessClientParsedResponse(businessClient: BusinessClientResponse): BusinessClient {
	return {
		id: businessClient.id,
		businessId: businessClient.business_id,
		accountId: businessClient.account_id,
		userId: businessClient.userid,
		clientBusiness: businessClient.client_business && transformClientBusinessParsedResponse(businessClient.client_business),
		accountBusiness: businessClient.account_business && transformAccountBusinessParsedResponse(businessClient.account_business),
	}
}
