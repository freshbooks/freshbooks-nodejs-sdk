/* eslint-disable @typescript-eslint/camelcase */
export default interface AccountBusiness {
	accountId: string
	businessId: number
}

export interface AccountBusinessResponse {
	account_id: string
	account_business_id: number
}

export function transformAccountBusinessResponse(accountBusiness: AccountBusinessResponse): AccountBusiness {
	return {
		accountId: accountBusiness.account_id,
		businessId: Number(accountBusiness.account_business_id),
	}
}
