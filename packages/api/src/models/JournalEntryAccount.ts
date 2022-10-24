/* eslint-disable @typescript-eslint/camelcase */
import { DateFormat, transformDateResponse } from './Date'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import Pagination from './Pagination'
import SubAccount, { transformSubAccountResponse } from './SubAccount'

export default interface JournalEntryAccount {
    accountName: string
    accountNumber: string
    accountType: string
    accountId: number
	  accountingSystemId?: string
    balance?: number
    createdAt?: Date
    currencyCode?: string
    id: number
    subAccounts?: SubAccount[]
}

export function transformJournalEntryAccountData(account: any): JournalEntryAccount {
	return {
        accountName: account.account_name,
        accountNumber: account.account_number,
        accountType: account.account_type,
        accountId: account.accountid,
		    accountingSystemId: account.accounting_systemid,
        balance: Number(account.balance),
        createdAt: account.created_at && transformDateResponse(account.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
        currencyCode: account.currency_code,
        id: account.id,
        subAccounts: account.sub_accounts && account.sub_accounts.map((subAccount: any): SubAccount => transformSubAccountResponse(subAccount)),
	}
}

export function transformJournalEntryAccountListResponse(data: string): { journalEntryAccounts: JournalEntryAccount[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: {
			result: { journal_entry_accounts, per_page, total, page, pages },
		},
	} = response

	return {
		journalEntryAccounts: journal_entry_accounts.map((account: any) => transformJournalEntryAccountData(account)),
		pages: {
			size: per_page,
			total,
			page,
			pages,
		},
	}
}
