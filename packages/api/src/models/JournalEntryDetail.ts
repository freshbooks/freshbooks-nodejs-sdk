/* eslint-disable @typescript-eslint/camelcase */
import { DateFormat, transformDateResponse } from './Date'
import Entry, { transformEntryParsedResponse } from './Entry'
import { ErrorResponse, isAccountingErrorResponse, transformAccountingErrorResponse } from './Error'
import JournalEntryAccount, { transformJournalEntryAccountParsedResponse } from './JournalEntryAccount'
import Money, { transformMoneyParsedResponse } from './Money'
import { Nullable } from './helpers'
import Pagination from './Pagination'
import SubAccount, { transformSubAccountParsedResponse } from './SubAccount'

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

export function transformJournalEntryDetailListResponse(
	data: string,
	headers: Array<string>,
	status: string
): { journalEntryDetails: JournalEntryDetail[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(status, response)) {
		return transformAccountingErrorResponse(response)
	}

	const { journal_entry_details, page, pages, per_page, total } = response.response.result

	return {
		journalEntryDetails: journal_entry_details.map(
			(detail: any): JournalEntryDetail => transformJournalEntryDetailParsedResponse(detail)
		),
		pages: {
			total,
			size: per_page,
			pages,
			page,
		},
	}
}

export function transformJournalEntryDetailParsedResponse(detail: any): JournalEntryDetail {
	return {
		account: detail.account && transformJournalEntryAccountParsedResponse(detail.account),
		accountingSystemId: detail.accounting_systemid,
		balance: detail.balance && transformMoneyParsedResponse(detail.balance),
		credit: detail.credit && transformMoneyParsedResponse(detail.credit),
		debit: detail.debit && transformMoneyParsedResponse(detail.debit),
		description: detail.description,
		detailType: detail.detail_type,
		detailId: detail.detailid,
		entry: detail.entry && transformEntryParsedResponse(detail.entry),
		id: detail.id,
		name: detail.name,
		subAccount: detail.sub_account && transformSubAccountParsedResponse(detail.sub_account),
		userEnteredDate:
			detail.user_entered_date && transformDateResponse(detail.user_entered_date, DateFormat['YYYY-MM-DD']),
	}
}
