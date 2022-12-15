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

export function transformBusinessClientParsedResponse(client: BusinessClientResponse): BusinessClient {
	return {
		id: client.id,
		businessId: client.business_id,
		accountId: client.account_id,
		userId: client.userid,
		clientBusiness: client.client_business && transformClientBusinessParsedResponse(client.client_business),
		accountBusiness: client.account_business && transformAccountBusinessParsedResponse(client.account_business),
	}
}
