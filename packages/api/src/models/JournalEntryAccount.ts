/* eslint-disable @typescript-eslint/camelcase */
import { DateFormat, transformDateResponse } from './Date'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import Pagination from './Pagination'
import SubAccount, { transformSubAccountParsedResponse } from './SubAccount'

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

export function transformJournalEntryAccountListResponse(data: string): { journalEntryAccounts: JournalEntryAccount[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { journal_entry_accounts, per_page, total, page, pages } = response.response.result

	return {
		journalEntryAccounts: journal_entry_accounts.map((account: any): JournalEntryAccount => transformJournalEntryAccountParsedResponse(account)),
		pages: {
			total,
            size: per_page,
			pages,
			page,
		},
	}
}

export function transformJournalEntryAccountParsedResponse(account: any): JournalEntryAccount {
	return {
        accountName: account.account_name,
        accountNumber: account.account_number,
        accountType: account.account_type,
        accountId: account.accountid,
        accountingSystemId: account.accounting_systemid,
        balance: account.balance ? Number(account.balance) : account.balance,
        createdAt: account.created_at && transformDateResponse(account.created_at, DateFormat['YYYY-MM-DD hh:mm:ss']),
        currencyCode: account.currency_code,
        id: account.id,
        subAccounts: account.sub_accounts && account.sub_accounts.map((subAccount: any): SubAccount => transformSubAccountParsedResponse(subAccount)),
	}
}
