/* eslint-disable @typescript-eslint/camelcase */
import { DateFormat, transformDateResponse } from './Date'
import Entry, { transformEntryParsedResponse } from './Entry'
import { ErrorResponse, isAccountingErrorResponse, transformErrorResponse } from './Error'
import JournalEntryAccount, { transformJournalEntryAccountParsedResponse } from './JournalEntryAccount'
import Money, { transformMoneyResponse } from './Money'
import { Nullable } from './helpers'
import Pagination from './Pagination'
import SubAccount, { transformSubAccountResponse } from './SubAccount'

export default interface JournalEntryDetail {
    account: JournalEntryAccount
    accountingSystemId: string
    balance: Money
    credit: Nullable<Money>
    debit: Nullable<Money>
    description: string
    detailType: string
    detailId: number
    entry: Entry
    id: number
    name: string
    subAccount: SubAccount
    userEnteredDate: Date
}

export function transformJournalEntryDetailData(detail: any): JournalEntryDetail {
	return {
        account: detail.account && transformJournalEntryAccountParsedResponse(detail.account),
        accountingSystemId: detail.accounting_systemid,
        balance: detail.balance && transformMoneyResponse(detail.balance),
        credit: detail.credit && transformMoneyResponse(detail.credit),
        debit: detail.debit && transformMoneyResponse(detail.debit),
        description: detail.description,
        detailType: detail.detail_type,
        detailId: detail.detailid,
        entry: detail.entry && transformEntryParsedResponse(detail.entry),
        id: detail.id,
        name: detail.name,
        subAccount: detail.sub_account && transformSubAccountResponse(detail.sub_account),
        userEnteredDate: detail.user_entered_date && transformDateResponse(detail.user_entered_date, DateFormat['YYYY-MM-DD']),
	}
}

export function transformJournalEntryDetailListResponse(data: string): { journalEntryDetails: JournalEntryDetail[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: {
			result: { journal_entry_details, page, pages, per_page, total },
		},
	} = response

	return {
		journalEntryDetails: journal_entry_details.map((detail: any) => transformJournalEntryDetailData(detail)),
		pages: {
			page,
			pages,
            size: per_page,
			total,
		},
	}
}
