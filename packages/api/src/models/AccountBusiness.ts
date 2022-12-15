/* eslint-disable @typescript-eslint/camelcase */
export default interface AccountBusiness {
	accountId: string
	businessId: number
}

export interface AccountBusinessResponse {
	account_id: string
	account_business_id: number
}

export function transformAccountBusinessParsedResponse(business: AccountBusinessResponse): AccountBusiness {
	return {
		accountId: business.account_id,
		businessId: Number(business.account_business_id),
	}
}
